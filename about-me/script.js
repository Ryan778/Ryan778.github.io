/* Peeking into the code of the webpage? Don't expect too much. seriously. 
   At least it's not a huge mess and somewhat organized :D
*/

function handleOutboundLinkClicks(url) {
  ga('send', 'event', {
    eventCategory: 'Outbound Link',
    eventAction: 'click',
    eventLabel: url,
    transport: 'beacon'
  });
}

function handleInternalLinkClicks(url) {
  ga('send', 'event', {
    eventCategory: 'Internal Link',
    eventAction: 'click',
    eventLabel: url,
    transport: 'beacon'
  });
}

function initialize(){
  $('.sm-desc').each(function(i, ele){
    ele.dataset.name = ele.parentNode.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText;
    ele.dataset.text = ele.innerHTML;
  })
  window.onresize();
  $('a').each(function(i, e){
    if(e.parentNode){
      if(e.parentNode.className === 'social'){
        let lnk = e.href;
        e.parentNode.onclick = function(){
          handleOutboundLinkClicks(lnk);
          window.open(lnk, '_blank')
          this.blur();
        }
        e.removeAttribute('href');
      }
    }
  })

  $('.social').each(function(i, e){
    e.onmouseenter = function(){
      if($('#'+e.id.replace('btn', 'btnp')).html() !== e.dataset.usrn){
        e.dataset.name = $('#'+e.id.replace('btn', 'btnp')).html();
        let t = $('#'+e.id.replace('btn', 'btnp'));
        t.css('opacity', '0');
        setTimeout(function(){
          t.html(e.dataset.usrn);
          t.css('opacity', '1');
        }, 100)
      }
    }
    e.onfocus = e.onmouseenter;
    e.onmouseleave = function(){
      if($('#'+e.id.replace('btn', 'btnp')).html() === e.dataset.usrn){
        let t = $('#'+e.id.replace('btn', 'btnp'));
        t.css('opacity', '0');
        setTimeout(function(){
          t.html(e.dataset.name);
          t.css('opacity', '1');
        }, 100)
      }
    }
    e.onblur = e.onmouseleave;
  })
  $('#intro_me').css({'opacity': '1', 'bottom': '0px'})
}

window.onresize = function(){
  if(window.innerHeight < 1080){
    let wh = window.innerHeight;
    if(wh < 320){wh = 320};
    $('#intro').css('height', wh+'px');
  }
  else{
    $('#intro').css('height', '1080px');
  }
  if(window.innerWidth < 600){
    //Make text just a little bit easier to read (and a little bit shorter)
    $('#intro_me').css('padding', '10px');
    $('.div-inner').css('padding', '10px');
    let n = 0;
    $('.sm-desc').each(function(i, ele){
      n ++;
      ele.innerHTML = '<a id="mi_'+n+'">More Info</a>';
      $('#mi_'+n).on('click', function(){
        alertify.alert("<b>"+ele.dataset.name+"</b><br><i>&ldquo;"+ele.dataset.text+"&rdquo;</i>")
      })
    })
  }
  else{
    $('#intro_me').css('padding', '20px');
    $('.div-inner').css('padding', '20px');
    $('.sm-desc').each(function(i, ele){
      ele.innerHTML = ele.dataset.text;
    })
  }
}

$(document).ready(function(){
  initialize();
})

function notPublic(){
  alertify.alert('<b>Private Account</b><br>This profile is not open to the public.')
}