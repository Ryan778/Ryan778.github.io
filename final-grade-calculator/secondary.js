/* secondary.js
 * Handles what dialogs (the messages up top, not the alert boxes) to show and whether to show them or not
 * Also handles the theme toggle button
 * (C) 2019 Ryan Zhang. All Rights Reserved. 
 * Interested in anything on here? Contact me at https://ryan778.github.io/about-me/ and we can discuss. 
 */

let s_dismissed = []; 
let s_curTheme = 1; // 1 = light, 0 = dark
if(localStorage.fgc_dismissedDialogs){
  $('#sp-resetDialogs').show();
  s_dismissed = localStorage.fgc_dismissedDialogs.split('|')}

function d_show(ele, key){
  if(s_dismissed.indexOf(key) === -1){
    $(ele).show(); 
  }
}

$('.btn-close').on('click', (e) => {
  $('#sp-resetDialogs').show();
  s_dismissed.push(e.currentTarget.dataset.key); 
  localStorage.fgc_dismissedDialogs = s_dismissed.join('|');
  $(e.currentTarget.parentElement.parentElement).hide();
})

$('#a-resetDialogs').on('click', (e) => {
  if(e.currentTarget.dataset.hasReset){location.reload()}
  localStorage.removeItem('fgc_dismissedDialogs');
  e.currentTarget.innerText = 'Success! (Reload to show)';
  e.currentTarget.dataset.hasReset = '1';
})

$('#i-toggleTheme').on('click', (e) => {
  s_curTheme = !s_curTheme;
  e.currentTarget.innerHTML = s_curTheme?'nights_stay':'wb_sunny';
  document.getElementById('theme').href = `themes/${s_curTheme?'default':'dark'}.css`;
})

d_show('#al_rel', 'r1.0.0')
if(!window.matchMedia("(prefers-color-scheme: light)").matches || new Date().getHours() > 22 || new Date().getHours() < 6){
  s_curTheme = 0;
  d_show('#al_dark', 'autodark')}