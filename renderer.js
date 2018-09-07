// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require('electron').ipcRenderer
var aud = document.getElementById("myaudio");
document.getElementById("play").addEventListener('click', function(event){
    var reply = ipc.sendSync("mp3", "select mp3 files");
    aud.src = reply;
    aud.play();
});