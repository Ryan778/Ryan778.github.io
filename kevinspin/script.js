var timeSpun = 0; 
var timeSpun_all = 0;

if(localStorage.kevinSpin_totalTime !== undefined){
  timeSpun_all = parseInt(localStorage.kevinSpin_totalTime);
}

function padZero(n){
  if(n.toString().length === 1){
    return '0' + n
  }
  else{
    return n
  }
}
function displayTime(){
  var h = Math.floor(timeSpun/3600);
  var m = Math.floor((timeSpun%3600)/60);
  var s = timeSpun%60;
  time.innerHTML = h + ':' + padZero(m) + ':' + padZero(s);
  
  var ha = Math.floor(timeSpun_all/3600);
  var ma = Math.floor((timeSpun_all%3600)/60);
  var sa = timeSpun_all%60;
  time_all.innerHTML = ha + ':' + padZero(ma) + ':' + padZero(sa);
}

window.onload = function(){
  displayTime();
  load.innerHTML = '';
  audio.play();
  vid.play();
  setInterval(function(){
    timeSpun++; 
    timeSpun_all ++;
    localStorage.kevinSpin_totalTime = timeSpun_all;
    displayTime();
  }, 1000);
}

function msConfirm(){
  var c = alertify.confirm('<b>External Link</b><br>Are you sure you would like to visit Meat Spin?<br><span style="color: #888">We take zero responsibility for any mental damage potentially caused from visiting this site.</span>', function(){
    window.open('http://meatspin.com', '_blank');
  }, function(){
    window.open('http://leekspin.com', '_blank');
  })
}