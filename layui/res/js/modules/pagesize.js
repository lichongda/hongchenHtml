/*

@Name：红尘
@Author：Absolutely 
@Site：http://www.lyblogs.cn

*/


layui.define('jquery', function (exports) {
    var $ = layui.jquery;
    function pagesize(id, pageSize, pageTotal) {
        $('#' + id + ' .layui-laypage').append('<span class="laypage-extend-pagesize">共&nbsp;'+
		'<font color="#000000">'+pageTotal+'</font> '+
		'&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;每页显示'+  
		'<input type="number" id="hongchenPageSize" min="1" onkeyup="this.value = this.value.replace(/\D/, \'\');" value="1" class="layui-laypage-skip" >条'+ 
		'<button type="button" class="layui-laypage-btn">确定</button></span>');
        $('#' + id + ' .laypage-extend-pagesize input[class=layui-laypage-skip]').val(pageSize);
        var pagesize = {
            btn: $('#' + id + ' .laypage-extend-pagesize .layui-laypage-btn'),
            callback: function (callback) {
                this.ok = callback;
            },
            ok: null
        };
        $(pagesize.btn).on('click', function () {
            pagesize.ok(pagesize.btn.siblings('input[class=layui-laypage-skip]').val());
        });
        return pagesize;
    }
    exports('pagesize', pagesize);
});