var currentOption = 'rick';
var previewTracks = {
  'sandstorm': 'https://archive.org/download/DarudeSandstorm_201411/Darude%20-%20Sandstorm.mp3',
  'rick': 'https://pixelcoding.nl/download/rickroll.mp3',
  'sax': 'https://ryan778.github.io/bkmusic/tracks/sax.mp3'
}
var dlTracks = {
  'sandstorm': 'DarudeSandstorm.js',
  'rick': 'RickRoll.js',
  'sax': 'EpicSaxGuy.js'
}
function selectOption(newopt){
  document.getElementById('opt_'+currentOption).className = 'option';
  currentOption = newopt;
  document.getElementById('opt_'+newopt).className = 'option selected';
  if(!audio.paused){
    audio.pause();
    previewbtn.innerHTML = "<i class='fa fa-play fa-fw'></i>";
  }
  showDL(agree.checked);
}
function showDL(x){
  var dl = document.getElementById('dl');
  if(x){
    dl.href = currentOption+'.js';
    dl.download = dlTracks[currentOption];
  }
  else{
    dl.removeAttribute('href');
    dl.removeAttribute('download');
  }
}
function preview(){
  var audio = document.getElementById('audio');
  if(audio.paused){
    previewbtn.innerHTML = "<i class='fa fa-cog fa-spin fa-fw'></i>";
    audio.src = previewTracks[currentOption];
    audio.play();
  }
  else{
    previewbtn.innerHTML = "<i class='fa fa-play fa-fw'></i>";
    audio.pause();
  }
}

window.onload = function(){
  var audio = document.getElementById('audio');
  audio.onplaying = function(){
    previewbtn.innerHTML = "<i class='fa fa-stop fa-fw'></i>";
  }
}