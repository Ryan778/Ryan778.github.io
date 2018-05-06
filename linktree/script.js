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
  a[i].addEventListener('click', handleClick);
}
