var currentOption = 'rick';
var previewTracks = {
  'sandstorm': 'https://archive.org/download/DarudeSandstorm_201411/Darude%20-%20Sandstorm.mp3',
  'rick': 'https://pixelcoding.nl/download/rickroll.mp3',
  'sax': 'https://ryan778.github.io/bkmusic/tracks/sax.mp3', 
  'nyan': 'https://web.archive.org/web/20170517005627/http://www.nyan.cat/music/technyancolor.mp3', 
  'tacos': 'https://ryan778.github.io/bkmusic/tracks/rainingtacos.mp3',
  'whitenoise': 'https://ryan778.github.io/bkmusic/tracks/whitenoise.mp3'
}
var dlTracks = {
  'sandstorm': 'DarudeSandstorm.js',
  'rick': 'RickRoll.js',
  'sax': 'EpicSaxGuy.js',
  'nyan': 'NyanCat.js',
  'tacos': 'RainingTacos.js',
  'whitenoise': 'WhiteNoise.js'
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

function showAbout(){
  alertify.alert("<b>About</b><br>Inspired by <a href='http://www.latlmes.com/'>La Tlmes</a>, this site serves to allow people to harmlessly prank their friends, coworkers, and enemies. I don't take responsibility (you agreed to this when downloading the scripts) but will take suggestions and/or comments. <br><b>Contact Me:</b> <br>Twitter: <a href='https://twitter.com/ryanz778'>@ryanz778</a>, Mail: <a href='mailto:rjoker778@gmail.com'>rjoker778@gmail.com</a>")
}

function showDMCA(){
  alertify.alert("<b>DMCA</b><br>Some tracks aren't hosted on this site, thus, contact the site owner hosting the tracks for DMCA takedown requests.<br><br>If a track is on my site, contact me at <a href='mailto:rjoker778@gmail.com'>rjoker778@gmail.com</a> for DMCA requests");
}

window.onload = function(){
  var audio = document.getElementById('audio');
  audio.onplaying = function(){
    previewbtn.innerHTML = "<i class='fa fa-stop fa-fw'></i>";
  }
}