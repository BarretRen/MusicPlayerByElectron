// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require("electron").ipcRenderer;
const fs = require("fs");
let songPath;
let songs;

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
    var path = ipc.sendSync("add-music-dir");
    fs.readdir(path[0], function (err, files) {
        if (err === null) {
            initPlaylist(files);
            songPath=path[0];
            songs = files;
        }
    });
});

//列表栏双击事件


// 初始化歌单数据
function initPlaylist(data) {
    var docFrag = document.createDocumentFragment(),
        songLen = data.length,
        tr = null;

    // 清空
    $("#infoList_playlist").html(' ');
    // 生成歌单列表
    for (var i = 0; i < songLen; i++) {
        // 创建tr 设置tr
        tr = document.createElement("tr");
        tr.dataset.index = i;
        tr.dataset.id = i;
        tr.dataset.songName = data[i];
        tr.innerHTML = `
			<td class="index" data-num="`+ ((+i + 1) < 10 ? "0" + (+i + 1) : (+i + 1)) + `">` + ((+i + 1) < 10 ? "0" + (+i + 1) : (+i + 1)) + `</td>
			<td>`+ data[i] + `</td>
        `;
        docFrag.appendChild(tr);
    }
    // 重新渲染DOM
    $("#infoList_playlist").append(docFrag);
}

//点击播放音乐
function playSongInList(ele, event) {
    var index = ele.index;
    $("#audio").src=songPath+"\\"+songs[index];
    console.log(songPath+"\\"+songs[index]);
    $("#audio").play();
    stylePlayBtn($playBtnGroup.find(".play"),"play");
}

//设置播放按钮样式
function stylePlayBtn($ele,playType) {
	var html_play='<i class="fa fa-play" aria-hidden="true"></i>';
	var html_pause='<i class="fa fa-pause" aria-hidden="true"></i>';
	$ele.html((playType==="play"?html_pause:html_play));
};