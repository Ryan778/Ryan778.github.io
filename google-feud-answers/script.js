var awesomplete;
var cb = false;

var valid_items = Object.keys(db);
function checkInput(input){
    if(valid_items.indexOf(input.value) !== -1){
        if(cb) {cb.destroy()}
        for(var i = 1; i <= 10; i++){
            document.getElementById('t'+i).innerHTML = '<span class="tres"><span title="Click to Copy!" data-clipboard-text="'+db[input.value][i-1]+'" class="tans">'+db[input.value][i-1]+'</span><span class="tpts">'+(11-i)+',000</span></span>';
            awesomplete.close();
        }
        cb = new Clipboard('.tans');
        cb.on('success', function(e) {
          e.clearSelection();
          if(e.trigger.innerHTML !== '<span class="green">Answer Copied!</span>'){
              let etmp = e.trigger.innerHTML;
              e.trigger.innerHTML = '<span class="green">Answer Copied!</span>';
              setTimeout(function(){e.trigger.innerHTML = etmp}, 1000)}
        });
        cb.on('error', function(e) {
          alertify.closeLogOnClick(true).error('Press CTRL+C to Copy');
        });
    }
    else if(t1.innerHTML !== '[1]'){
        for(var i = 1; i <= 10; i++){
            document.getElementById('t'+i).innerHTML = '['+i+']';
        }
    }
}

function showInfo(n){
    switch(n){
        case 0: 
            alertify.alert('<b>About</b><br>Google Feud Answers - &copy; Ryan Zhang 2017<br><br>A page dedicated to providing quick and easy answers to Google Feud. <br>No sifting through hundreds of blog posts, this site is updated directly from the Google Feud database, and provides answers instantaneously!<br>Made by <a href="../about-me/" target="_blank">Ryan Zhang</a> - Initial version made in under three hours!<br><br>Last Database Update: '+lastUpdate+' (Contact me if answers have changed)');
            break;
        case 1: 
            alertify.alert('<b>Legal</b><br>This site is not endorsed by or affiliated with Google, Family Feud, or Google Feud. <br>Google and the Google logo are registered trademarks of Google Inc. <br>Family Feud is a registered trademark of FremantleMedia North America, Inc.<br><a href="http://www.googlefeud.com" target="_blank">Google Feud</a> is not a trademark, but was made by <a href="https://twitter.com/justinhook" target="_blank">@justinhook</a> and the inspiration for this site comes from his site. (also because there were no good answers site)<br>Uses <a href="https://alertifyjs.org" target="_blank">AlertifyJS</a>, <a href="https://leaverou.github.io/awesomplete/" target="_blank">Awesomplete</a>, and <a href="https://clipboardjs.com/" target="_blank">clipboard.js</a> licenced under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a><br><a href="https://twitter.com/justinhook" target="_blank">@justinhook</a>, if this site bothers and/or interests you (despite hundreds of blogs providing Google Feud Answers), feel free to contact me! :D')
            break;
        case 2:
            alertify.alert('<b>Contact</b><br>Suggestions? Out of date answers? Contact me!<br>GitHub Issues: <a href="https://github.com/Ryan778/Ryan778.github.io/issues" target="_blank">Issues and/or Suggestions</a><br>Twitter: <a href="https://twitter.com/ryanz778" target="_blank">@ryanz778</a>')
            break;
    }
}


window.onload = function(){
    awesomplete = new Awesomplete(input, {
        list: valid_items
    });
    document.getElementById('input').addEventListener("awesomplete-selectcomplete", function(event){
        checkInput(input);
    });
}
