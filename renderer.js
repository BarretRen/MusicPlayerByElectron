// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const ipc = require("electron").ipcRenderer;
const fs = require("fs");
let songPath;
let songs = new Array();
let currentSong = 0;
let player = document.getElementById("player");

//接收出书后path，填充table
ipc.on("init-path", function (event, arg) {
    loadSongsFromPath(arg);
});

//function utils
//格式化时间
function formatTime(seconds) {
    var h = 0,
        i = 0,
        s = Math.floor(seconds);
    h = Math.floor(s / 3600);
    i = Math.floor((s % 3600) / 60);
    s = s % 3600 % 60;

    return {
        H: h = h < 10 ? "0" + h : h,
        I: i = i < 10 ? "0" + i : i,
        S: s = s < 10 ? "0" + s : s
    };
};
//end function utils

// 展开与缩放歌曲详情页
$("#btnExpandPlayBox").on("click", function () {
    // style: 展开歌曲详情页
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
    loadSongsFromPath(path);

});

function loadSongsFromPath(path) {
    fs.readdir(path, function (err, files) {
        if (err === null) {
            initPlaylist(files);
            songPath = path;
            registerTrDbclick();
        }
    });
}

function registerTrDbclick() {
    //列表栏双击事件
    $("tr").dblclick(function () {
        currentSong = $(this).children("td").eq(0).text() - 1;
        player.src = songPath + "\\" + $(this).children("td").eq(1).text();
        player.play();
        $("#smallwindow_songName").html($(this).children("td").eq(1).text());
        $("#songName_detail").html($(this).children("td").eq(1).text());
        stylePlayBtn($("#playBtnGroup").find(".play"), "play");
        $("#vol_progress_bar").css("width", "100%");
    });
}

// 初始化歌单数据
function initPlaylist(data) {
    var docFrag = document.createDocumentFragment(),
        songLen = data.length,
        tr = null;

    // 清空
    $("#infoList_playlist").html(' ');
    // 生成歌单列表
    for (var i = 0; i < songLen; i++) {
        //检查是不是mp3文件
        if (data[i].toLocaleLowerCase().lastIndexOf('mp3') != (data[i].length - 3)) {
            continue;
        }
        songs.push(data[i]);
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

//设置播放按钮样式
function stylePlayBtn($ele, playType) {
    var html_play = '<i class="fa fa-play" aria-hidden="true"></i>';
    var html_pause = '<i class="fa fa-pause" aria-hidden="true"></i>';
    $ele.html((playType === "play" ? html_pause : html_play));
};

//播放暂停按钮点击事件
$("#playBtnGroup").find(".play").on("click", function () {
    if (!player.src) {
        //显示提示消息
        ipc.send("msg-box", "没有播放资源，请选择曲目");
    }
    else {
        if (!player.paused) {
            player.pause();
            // play按钮样式
            stylePlayBtn($("#playBtnGroup").find(".play"), "pause");
        }
        else {
            player.play();
            // play按钮样式
            stylePlayBtn($("#playBtnGroup").find(".play"), "play");
        }
    }
});

//播放按钮前一首点击事件
$("#playBtnGroup").find(".prev").on("click", function () {
    if (songs.length > 0) {
        if (currentSong > 0) {
            currentSong--;
        }
        player.src = songPath + "\\" + songs[currentSong];
        player.play();
        $("#smallwindow_songName").html(songs[currentSong]);
        $("#songName_detail").html(songs[currentSong]);
        stylePlayBtn($("#playBtnGroup").find(".play"), "play");
    }
})

//播放按钮后一首点击事件
$("#playBtnGroup").find(".next").on("click", function () {
    if (songs.length > 0) {
        if (currentSong >= (songs.length - 1)) {
            currentSong = 0;
        }
        else {
            currentSong++;
        }
        player.src = songPath + "\\" + songs[currentSong];
        player.play();
        $("#smallwindow_songName").html(songs[currentSong]);
        $("#songName_detail").html(songs[currentSong]);
        stylePlayBtn($("#playBtnGroup").find(".play"), "play");
    }
})

//播放器监听，进度条，歌曲完成重播
player.addEventListener("timeupdate", function () {
    var objTimeCurTime = formatTime(this.currentTime);
    var objTimeDuration = formatTime(this.duration);
    $("#audio_currentTime").html(objTimeCurTime.I + ":" + objTimeCurTime.S);
    $("#audio_duration").html(objTimeDuration.I + ":" + objTimeDuration.S);
    // 更新进度条
    $("#progress_bar").css("width", (this.currentTime / this.duration).toFixed(4) * 100 + "%");
});

player.addEventListener("ended", function () {
    player.play();
});

// 监听音频播放事件
player.addEventListener("play", function () {
    // 转盘动画恢复
    $("#bgDisc").css({
        "-webkit-animation-play-state": "running",
        "animation-play-state": "running"
    });
    // 磁针放下
    $("#discNeedle").addClass("play");
});
// 监听音频暂停事件
player.addEventListener("pause", function () {
    // 转盘动画停止
    $("#bgDisc").css({
        "-webkit-animation-play-state": "paused",
        "animation-play-state": "paused"
    });
    // 磁针抬起
    $("#discNeedle").removeClass("play");
});

//点击进度条，跳转歌曲位置
$("#progress_box").on("click", function (ev) {
    var ev = ev ? ev : window.event;
    var ex = ev.clientX;
    var arcOffset = $("#progress_box").get(0).getBoundingClientRect();
    var disX = ex - arcOffset.left;
    var positon = ((disX / $("#progress_box").width()) * 100).toFixed(2);
    positon = positon <= 0 ? 0 : (positon >= 100 ? 100 : positon);
    if (player.src) {
        $("#progress_bar").css("width", positon + "%");
        player.currentTime = positon * player.duration / 100;
    }
});

//点击音量条
$("#vol_progress_box").on("click", function (ev) {
    var ev = ev ? ev : window.event;
    var ex = ev.clientX;
    var arcOffset = $("#vol_progress_box").get(0).getBoundingClientRect();
    var disX = ex - arcOffset.left;
    var positon = ((disX / $("#vol_progress_box").width()) * 100).toFixed(2);
    positon = positon <= 0 ? 0 : (positon >= 100 ? 100 : positon);
    if (player.src) {
        $("#vol_progress_bar").css("width", positon + "%");
        player.volume = (positon / 100).toFixed(2);
        if (player.volume <= 0) {
            $("#muteBtn").html('<i class="fa fa-volume-off" aria-hidden="true"></i>')
        }
    }
});

//静音按钮点击事件
$("#muteBtn").on("click", function () {
    if (!player.muted) {
        player.muted = true;
        $("#muteBtn").html('<i class="fa fa-volume-off" aria-hidden="true"></i>').attr("title", "恢复音量");
        $("#vol_progress_bar").css("display", "none");
    } else {
        player.muted = false;
        $("#muteBtn").html('<i class="fa fa-volume-up" aria-hidden="true"></i>').attr("title", "静音");
        $("#vol_progress_bar").css("display", "block");
    }
});