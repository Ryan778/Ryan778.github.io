/* DarudeSandstorm.js
Copyright (C) 2017 Ryan Zhang. 
Licensed under CC-BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
This means that you are free to modify it and redistribute it, but not removing the attribution (this text right here) or profiting from it. 

To run, simply open the file. 
To stop, simply restart the computer. 
Once the script has been run, it can be deleted and the music will still play.
*/

var WShell = WScript.CreateObject('WScript.Shell');
var popup = WShell.popup('Background Music Player Troll\nCopyright (C) Ryan Zhang 2017. Licensed under CC-BY-NC 4.0\n\nPress OK to start the script or CANCEL to abort the script.\nOnce the script starts, the file can be deleted.', 0, 'Background Music Player Troll (Darude Sandstorm)', 1)
if(popup === 2){
  WScript.Quit()
}
while (true){
  var oPlayer = WScript.CreateObject('WMPlayer.OCX')
  oPlayer.URL = 'https://archive.org/download/DarudeSandstorm_201411/Darude%20-%20Sandstorm.mp3'
  oPlayer.controls.play() 
  while (oPlayer.playState != 1 ){
    WScript.Sleep (100)
  }
  oPlayer.close()
}