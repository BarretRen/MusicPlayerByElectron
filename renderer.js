// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// 展开与缩放歌曲详情页
$("#btnExpandPlayBox").on("click",function () {
    // style: 展开歌曲详情页
    console.log('i am here');
    $("#pageSongDetail").css({
        "top":"60px",
        "right":0,
        "opacity":1
    });
});
$("#btnCompressPlayBox").on("click",function () {
    // style: 缩放歌曲详情页
    $("#pageSongDetail").css({
        "top":"100%",
        "right":"100%",
        "opacity":0
    });
});