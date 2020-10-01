var fileNode = $("#form input");

$('#submitBtn').on('click', function(){
    var data = {}
    fileNode.each(function(){
        var key = $(this).attr('name');
        var val = $(this).val();
        if(key === 'url'){
            val = encodeURIComponent(val);
        }
        if(key == 'undefined'){
            return;
        }
        data[key] = val;
    })
    console.log(data)
    $.get(
        "/api/v1/skeleton",
        data,  
        function(ret){
            if(ret.status.code !== 200){
                return console.log(ret.msg);
            }
            $('.code').val(ret.data.html)
            $('#foot').append(`
                <img src="${ret.data.img}" />
            `)
        },
        'json');   
})
