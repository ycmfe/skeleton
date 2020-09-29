var fileNode = $("#form")[0];
var token;
var domain;
$.ajax({
    url:"/api/v1/upload",
    dataType: 'json',
    success: (ret) => {
        domain = ret.data.bucket.domain;
        $(fileNode).append('<input type="hidden" name="token" value="'+ ret.data.uploadToken +'" />')
    },
    error: (e) => {
        console.log("错误！！", e);
    }
});

function getStatic(type){
    $.ajax({
        url:"/api/v1/static",
        dataType: 'json',
        data: {
            type: type
        },
        success: (ret) => {
            var data = [];
            ret.data.forEach(item => data.push(`<li class="list-group-item">${item.url}</li>`))
            $('.list-group').html(data.join(''))
        },
        error: (e) => {
            console.log("错误！！", e);
        }
    })
}
getStatic(1);
$('.nav li').on('click', function(){
    var $index = $(this).index() + 1;
    getStatic($index);
    $(this).addClass('active').siblings('li').removeClass('active');
    return false;
})

$('#submitBtn').on('click', function(){
    // if(!$('[name=version]').val()){
    //     return;
    // }
    var form = new FormData(fileNode);
    $.ajax({
        url:"/api/v1/upload",
        type:"post",
        data: form,
        dataType: 'json',
        processData: false,
        contentType: false,
        success:function(ret){
            if(ret.code !== 200){
                return alert(ret.msg);
            }
            $('.alert').html(domain + '/' + ret.data.key);
        },
        error:function(e){
            console.log("错误！！", e);
            alert('错误！请查看控制台')
        }
    });   
})
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         const sw = navigator.serviceWorker;
//         /**
//          * 卸载
//          */
//         function unRegister(){
//             sw.getRegistration('sw').then(registration => {
//                 // 手动注销
//                 registration.unregister();
//                 // 清除缓存
//                 window.caches && caches.keys && caches.keys().then((keys) => {
//                     keys.forEach(function(key) {
//                         caches.delete(key);
//                     });
//                 });
//             });
//         }
//         sw.register('sw.js').then(() => {
//             console.log('start')
//         }).catch((e) => {
//             console.error('Error during service worker registration:', e)
//             unRegister();
//         });
//     });
// }

