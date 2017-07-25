function flop() {
  btn.style.transform = 'scale(0)';
  lnk.style.display = 'none';
  btn.style.opacity = 0;
  visits.style.opacity = 0;
  vid.style.display = 'initial';
  vid.src='https://www.youtube.com/embed/L5inD4XWz4U?autoplay=1&enablejsapi=1&disablekb=1&end=139&iv_load_policy=3&modestbranding=1&rel=0&controls=0&loop=1';
  setTimeout(function(){
    vid.style.opacity = 1;
  }, 750);
  setTimeout(function(){
    if(document.documentElement.webkitRequestFullScreen){document.documentElement.webkitRequestFullscreen()}
    else if(document.documentElement.mozRequestFullScreen){document.documentElement.mozRequestFullscreen()}
    else if(document.documentElement.msRequestFullScreen){document.documentElement.msRequestFullscreen()}
    else if(document.documentElement.requestFullScreen){document.documentElement.requestFullscreen()}
  }, 400)
  if(!localStorage.getItem('flop_visitCounter')){
    localStorage.setItem('flop_visitCounter', 'MQ==')
  }
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function vidlnk() {
  window.open('https://www.youtube.com/watch?v=L5inD4XWz4U', '_blank');
  window.open('https://ryan778.github.io/kevinspin', '_self');
}

if (document.addEventListener) {
  document.addEventListener('webkitfullscreenchange', exitHandler, false);
  document.addEventListener('mozfullscreenchange', exitHandler, false);
  document.addEventListener('fullscreenchange', exitHandler, false);
  document.addEventListener('MSFullscreenChange', exitHandler, false);
}

function exitHandler() {
  if (!document.webkitIsFullScreen && !document.mozFullScreen) {
    location.hash = 'r'
    vid.src='//about:blank';
    btn.style.transform = '';
    btn.style.opacity = 1;
    visits.style.opacity = 1;
    vid.style.display = 'none';
    vid.style.opacity = 0;
  }
}

window.onload = function(){
  if(location.hash === '#r') {
    lnk.style.display = 'initial';
  }
  if(localStorage.getItem('flop_visitCounter')){
    if(!isNaN(parseInt(atob(localStorage.getItem('flop_visitCounter'))))){
      let n = parseInt(atob(localStorage.getItem('flop_visitCounter')))+1;
      localStorage.setItem('flop_visitCounter', btoa(n));
      count.innerHTML = ordinal_suffix_of(n);
      if(n === 2){
        desc.innerHTML = 'surprise suprise, you came back'}
      else if(n === 3){
        desc.innerHTML = 'thrice? wonder what comes after "thrice"...'}
      else if(n === 4){
        desc.innerHTML = 'quice? frice? get the reference?'}
      else if(n === 5){
        desc.innerHTML = 'hmm, five times..? you must be really bored.'}
      else if(n >= 6 && n <= 8){
        desc.innerHTML = 'maybe i shouldn\'t change this so much...'}
      else if(n === 9){
        desc.innerHTML = 'wow, this page must inspire you a lot'}
      else if(n >= 10 && n <= 49){
        desc.innerHTML = 'looks like you\'ve hit the double digits, you can stop now'}
      else if(n === 50){
        desc.innerHTML = 'half way to a hundred :D'}
      else if(n >= 51 && n < 100){
        desc.innerHTML = 'hmm, '+(100-n)+' more visits til 100'}
      else if(n === 100){
        desc.innerHTML = 'wow, you reached 100! you\'ve wasted way too much of your time...'}
      else if(n === 101){
        desc.innerHTML = 'trying to reach 1,000 visits now?'}
      else if(n >= 102 && n < 950){
        desc.innerHTML = 'well, '+(1000-n)+' more visits til 1,000!'}
      else if(n >= 950 && n < 990){
        desc.innerHTML = (1000-n)+' more, getting close!'}
      else if(n >= 990 && n < 1000){
        desc.innerHTML = (1000-n)+' more, almost there!'}
      else if(n === 1000){
        desc.innerHTML = 'yay, you did it! i\'m awfully disappointed in you.'}
      else if(n > 1000){
        desc.innerHTML = 'don\'t you have anything better to do?'
        if(n > 1015){
          desc.innerHTML += '<br>want more? <a href="https://github.com/Ryan778/Ryan778.github.io/issues" target="_blank">send a request here</a>'
        }
      }
      visits.style.display = 'initial';
      visits.style.opacity = 1;
    }
  }
}