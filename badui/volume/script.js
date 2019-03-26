// script.js (/badui/volume)
// (C) 2019 Ryan Zhang. See index.html for legal.

let firstClick = true;
$('#hammer').on('click', (event) => {
  if(firstClick) {audio.play(); firstClick = false}
  $('#hammer').css('transform', 'rotate(45deg) translateX(180px) translateY(30px)');
  $('#button').css('transform', 'translateY(15px)');
  setTimeout(function(){
    $('#hammer').css('transform', 'rotate(-45deg)');
    $('#button').css('transform', 'translateY(0px)');
    volRate = 1.5;
  }, 80)
})

let vol = 0;
let volRate = 0;

function modVol(){
  $('#audio')[0].volume = vol / 100;
  volRate -= 0.075;
  vol += volRate;
  if(vol < 0) {vol = 0}
  if(vol > 100) {vol = 100}

  let volFormatted = vol;
  if(vol < 10){volFormatted = vol.toFixed(2)}
  else if(vol < 100){volFormatted = vol.toFixed(1)}
  else{volFormatted = 100}
  $('#vol-text').text(volFormatted + '%');
  $('#range').val(vol);
}

setInterval(modVol, 25);
