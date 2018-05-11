let a = document.getElementsByTagName('a');
function handleClick(e, a){
  e.preventDefault();
  e.srcElement.style.backgroundColor = '#93fdb077';
  e.srcElement.style.borderColor = '#00dd3c';
  let l = e.srcElement.parentElement.href;
  function redir(){
    window.open(l, '_self')}
  ga('send', 'event', 'Link', 'click', 'Linktree (link id: '+e.srcElement.parentElement.dataset.linkid+')', {hitCallback: redir});
  setTimeout(redir, 750);
}
for(let i = 0; i < a.length; i++){
  if(a[i].className.includes('nl')){continue;}
  a[i].addEventListener('click', handleClick);
}

function spc(n){//Show photo credits
  if(n === 0){
    document.getElementById('pc').style.display = 'none';
    document.getElementById('bk').style.filter = 'blur(7px)';
  }
  else{
    document.getElementById('bk').style.backgroundImage = 'url(lake.jpg)';
    document.getElementById('bk').style.filter = 'none';
    document.getElementById('pc').style.display = 'initial';
  }
}
