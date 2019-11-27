var audio = document.getElementById('audio');
var micContext = null;
var meter = null;
var rafID = null;
var volbar_width = 200; 
var player = {
  vol: 0
}
var config = {
  ver: 1,
  pauseWhenQuiet: true, // pause the music when it goes below a threshold
  invertVolume: true, // if true, louder mic = quieter music
  curveUp: true, // apply secondary square root curve to increase overall volume
  slowFade: true, // volume fades slower
  active: true
}

function saveConfig(){
  localStorage.adaptiveMusic = btoa(JSON.stringify(config))}
if(localStorage.adaptiveMusic){
  try {
    let newConfig = JSON.parse(atob(localStorage.adaptiveMusic)); 
    if(newConfig.ver == config.ver) {
      config = newConfig; 
    }
  }
  catch (e) {
    M.toast({html: 'Your saved settings are corrupted, and have been reset.', classes: 'red darken-1'});
    localStorage.removeItem(adaptiveMusic); 
  }
}

function reqMicPermission(){
  try {
    // borrowed from https://github.com/cwilso/volume-meter/blob/master/main.js under the MIT license
    // monkeypatch getUserMedia
    navigator.getUserMedia = 
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

    // ask for an audio input
    navigator.getUserMedia(
    {
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, gotStream, didntGetStream);
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}

var mediaStreamSource = null;

function didntGetStream() {
    M.Modal.getInstance($('#m_permDenied')[0]).open();
}

function gotStream(stream) {
  M.toast({html: 'Success! Starting Up...', classes: 'green darken-2'});
  $('#btn_reqMic').prop('disabled', true);
  $('#btn_reqMic').html(`<span class='green-text'><i class='fas fa-check'></i> </span><span class='black-text'>Success!</span>`)
  
  // Create an AudioNode from the stream.
  mediaStreamSource = micContext.createMediaStreamSource(stream);

  // Create a new volume meter and connect it.
  meter = createAudioMeter(micContext);
  mediaStreamSource.connect(meter);
}

let volPeak = [0, 0] //[value, timestamp]
function updateMicInputValue(){
  if(meter){
    let w = volbar_width;
    let rmv = meter.volume * 1.5; 
    let mv = Math.sqrt(rmv);
    if(mv > 1.2){mv = 1.2} //Peak at 120% curved, 144% raw
    let tval = mv; 
    if(tval < 0.01){tval = 0}
    if(tval >= 0.1){tval = (tval*100).toFixed(1)}
    else if(tval < 0.1){tval = (tval*100).toFixed(2)}
    else{tval = '100'}
    $('#vol-val').text(tval);
    $('#vol-cur').css('width', (mv*w)+'px');
    // }
    if(volPeak[0] < mv && mv > 0.10){
      volPeak[0] = mv;
      volPeak[1] = Date.now();
      $('#vol-peak').css('width', (mv*w)+'px');
      $('#vp-val').text((mv*100).toFixed(1)+'%');
      $('#vp-val').css('opacity', '1');
    }
    else if(Date.now() > volPeak[1] + 800){
      if(volPeak < 0.15){
        volPeak = 0;
        $('#vol-peak').css('width', '0px');
        $('#vp-val').css('opacity', '0');
      }
      else{
        volPeak[0] *= (config.slowFade ? 0.9:0.8);
        $('#vp-val').css('opacity', '0');
        $('#vol-peak').css('width', (volPeak[0]*w)+'px');
      }
    }
    player.vol = (volPeak[0] < 1 ? volPeak[0] : 1); 
    updateAudio(); 
  }
}

function updateAudio(){
  let rvol = player.vol; // resulting volume
  if(config.curveUp){
    rvol = Math.sqrt(rvol); 
  }
  if(config.invertVolume){
    rvol = 1 - rvol; 
  }
  if(config.pauseWhenQuiet) {
    rvol = (rvol - 0.1) * (10/9); 
    if(rvol < 0){
      audio.volume = 0; 
      if(!audio.paused) audio.pause(); 
      return; 
    }
    if(audio.paused && config.active){
      audio.play(); 
    }
  }
  audio.volume = rvol;
}

function addFile(ele) {
  let file = ele.files[0]; 
  jsmediatags.read(file, {
    onSuccess: tag => {
      $('#audio_name').text(tag.tags.title + ' by ' + tag.tags.artist); 
    }, 
    onError: e => {
      // no ID3 tag
      return; 
    }
  });
  let url = URL.createObjectURL(file); 
  $('#audio_name').text(file.name)
  audio.src = url; 
}

setInterval(updateMicInputValue, 50);

// On load stuff
window.onload = function() {
  M.AutoInit();

  // monkeypatch Web Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // grab an audio context
  micContext = new AudioContext();

  // initialize setting switches
  $('.inp-setting').forEach((ele) => {
    ele.checked = config[ele.dataset.for];
    $(ele).on('change', (e) => {
      let ele = e.target; 
      config[ele.dataset.for] = ele.checked; 
      saveConfig(); 
    }); 
  })
}