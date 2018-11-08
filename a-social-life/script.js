var inputs = [];
var stage = 0; //set to 0 when done testing

var ctx = document.getElementById("canv-a").getContext('2d');
var chart1 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade (early on)"],
        ticks: {
          min: 0,
          max: 24
        },
        datasets: [{
            label: 'Friends (approx.)',
            data: [2, 5, 8, 11, 20, 22],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }, {
            label: 'Friends (who went to my high school)',
            data: [2, 5, 8, 11, 20, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById("canv-b").getContext('2d');
var chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ["4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade (early on)"],
        ticks: {
          min: 0,
          max: 24
        },
        datasets: [{
            label: 'Friends (approx, only ones in my school)',
            data: [2, 5, 8, 11, 20, 2],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }, {
            label: 'Friends (actually in my grade)',
            data: [1, 3, 5, 8, 12, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

var ctx3 = document.getElementById("canv-c").getContext('2d');
var chart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
        labels: ["4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade (Now)"],
        ticks: {
          min: 0,
          max: 24
        },
        datasets: [{
            label: 'Friends (approx, only ones in my school)',
            data: [2, 5, 8, 11, 20, 2, 24],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(102, 255, 179, 0.5)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(102, 255, 179, 1)'
            ],
            borderWidth: 1
        }, {
            label: 'Friends (actually in my grade)',
            data: [1, 3, 5, 8, 12, 0, 12],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(102, 255, 179, 0.5)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(102, 255, 179, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

$('#i1_ck1')[0].oninput = function(){
  if(i1_ck1.checked){
    document.getElementById('int1-a').style.display='initial'
  }
  else{
    document.getElementById('int1-a').style.display='none';
    document.getElementById('int1-c').style.display='initial';
  }
}

function calcClubTime(){
  let t = $('#int2_1').val();
  if($('#int2_1').val() < 0){
    $('#int2_1').val(Math.abs($('#int2_1').val()))}
  t *= $('#int2_2').val();
  if($('#int2_2').val() < 10){
    return '' //user is likely not done typing
  }
  t *= 36; //roughly the number of school weeks in a year minus the first week or two
  t /= 60; //convert to horus
  $('#int2_res').text(Math.round(t*10)/10);
  $('#contBtn_s7')[0].removeAttribute('disabled');
  $('.int2_res_comp').each(function(n, ele){
    $(ele).text(Math.floor(t / $(ele).data('factor')));
  })
}

$('#int2_1')[0].oninput = calcClubTime;
$('#int2_2')[0].oninput = calcClubTime;

var isScrolling;
window.addEventListener('scroll', function ( event ) {
  window.clearTimeout( isScrolling );
  isScrolling = setTimeout(function() {
    scrollLimitCheck(); //Check if the limit has passed
  }, 132);
}, false);

function scrollLimitCheck(){
  let yLimit = 999999;
  let target = s0;
  if(stage === 0){
    yLimit = sp1.offsetTop - (window.innerHeight / 2);
    target = s2;
  }
  else if(stage === 1){
    yLimit = sp2.offsetTop - (window.innerHeight / 2);
    target = s6;
  }
  if(window.scrollY > yLimit){
    window.scrollTo(0, target.offsetTop);
    M.toast({html: 'Slow down, please!', classes: 'orange'});
  }
}

function w_cont(v){
  if(v === 1){
    stage = 1;
    if($('#i1_o2')[0].checked){
      $('.int1-resB').show()}
    else if($('#i1_o3')[0].checked){
      $('.int1-resC').show()}
    else {
      $('.int1-resA').show()}
    sp1.style.display = 'none';
    window.scrollTo(0, s3.offsetTop);
    M.toast({html: 'Great! Let\'s keep going!', classes: 'green'})
  }
  else if(v === 2){
    stage = 2; 
    sp2.style.display = 'none';
    window.scrollTo(0, s7.offsetTop);
    M.toast({html: 'Great! Let\'s keep going!', classes: 'green'});
  }
}

window.onload = function(){
  if(s1.offsetHeight < 650){
    $('.slide').css('font-size', '1.4em')
  }
}
