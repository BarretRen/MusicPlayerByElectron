// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require("electron").ipcRenderer;
const fs = require("fs");

// 展开与缩放歌曲详情页
$("#btnExpandPlayBox").on("click", function () {
    // style: 展开歌曲详情页
    console.log('i am here');
    $("#pageSongDetail").css({
        "top": "60px",
        "right": 0,
        "opacity": 1
    });
});
$("#btnCompressPlayBox").on("click", function () {
    // style: 缩放歌曲详情页
    $("#pageSongDetail").css({
        "top": "100%",
        "right": "100%",
        "opacity": 0
    });
});

$("#addDir").on("click", function () {
    //打开目录对话框
    var path=ipc.sendSync("add-music-dir");
    console.log(path);
    // fs.readdir(path[0], function (err, files) {
    //     if (err === null)
    //         console.log(files);
    // });
});