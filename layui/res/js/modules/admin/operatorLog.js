/*

@Name：不落阁后台模板源码 
@Author：Absolutely 
@Site：http://www.lyblogs.cn

*/

layui.define(['laypage', 'layer', 'form', 'pagesize'], function (exports) {
    var $ = layui.jquery,
		laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form();
		var laypageId = 'demo7';
        //laypage = layui.laypage;
		//var laypageId = 'pageNav';
   
	initilData();
	function initilData(){
		var permissionId = base.getURLParameter("permissionId");
		//需动态传角色ID
		var roleId = localStorage.getItem("roleId");		
		var parment = "permissionId="+ permissionId +"&roleId=" + roleId;
		var json = base.get($, JSConstant.getConstant('query_adminPermissionButton_url'), parment);
		var bool = base.isSucess(json);
		if(bool){
			initButton(json);	
			$('#tableDta tbody').html('');//清空tbody
			var parment ="";
			var resultJson = base.get($, JSConstant.getConstant('query_log_url'), parment);
			
			bool = base.isSucess(resultJson);
			if(bool){
				initPage(resultJson);
			}
			
		}
	 }
	 
	 	 //初始化分页标签
	 function initPage(resultJson){
		var page = resultJson.data.page;
		initTableData(resultJson.data);
		//调用分页
		laypage({
			 cont: 'demo7',//容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
			 pages: page.pages,//总页数
			 skip: false, //是否开启跳页
			 curr:page.current,
			 //groups:5,
			 skin: '#AF0000',
			 jump: function (obj, first) {//触发分页后的回调
				var curr = obj.curr;
				//alert(pageSize);
				if (!first) {//点击跳页触发函数自身，并传递当前页：obj.curr	 
					pageList(curr, page.size);
				}
			 }
		});
		
		//该模块是我定义的拓展laypage，增加设置页容量功能
		//laypageId:laypage对象的id同laypage({})里面的cont属性
		//pagesize当前页容量，用于显示当前页容量
		//callback用于设置pagesize确定按钮点击时的回掉函数，返回新的页容量
		layui.pagesize("demo7", page.size, page.total).callback(function (newPageSize) {
			//这里不能传当前页，因为改变页容量后，当前页很可能没有数据
			pageList(1, newPageSize);
		});
	   
		form.render('checkbox');//刷新复选框
	 }
	 
	 //分页数据查询
	 function pageList(curr, pageSize){		 
		var parment = "current="+ curr +"&size=" + pageSize;
		var json = base.get($, JSConstant.getConstant('query_log_url'), parment);
		var bool = base.isSucess(json);
		if(bool){
			var resultJson = json;
			json = json.data;
			initTableData(json);
			initPage(resultJson);
		}
	 }
	 
	 //初始化表格数据
	 function initTableData(jsonData){
		var reslult = getDate(jsonData);
		$('#tableDta tbody').html('');//清空tbody
		$('#tableDta').append(reslult);//往table添加tbody
		var html = '<div id="' + laypageId + '"></div>';
		$('#dataContent').append(html);//往table添加div	
		form.render('checkbox');//刷新复选框
	 }
	 
	function initButton(jsonObj){
		var del =  false; //是否有删除按钮
		var edit = false;//是否有修改按钮
		var addButton = false;//是否有新增按钮
		var roleId="";
		var roleButton = jsonObj.data;
		$.each(roleButton, function(index, buttons){
			buttons.permissionUrl+"="+true;
			if(buttons.permissionUrl=="del"){
				del = true;
			}
			
			if(buttons.permissionUrl=="edit"){
				edit = true;
			}
			
			if(buttons.permissionUrl=="add"){
				addButton = true;
			}
			
			var buttons = '';
			$('blockquote').html('');//blockquote
			if(addButton){
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.quartz.addData(\'' + "" + '\')">添加定时器</button>';
			}
			buttons+= '<input type="hidden" id="delButton" value="'+del+'" name="delButton"/>';
			buttons+= '<input type="hidden" id="editButton" value="'+edit+'" name="editButton"/>';
			$('blockquote').append(buttons);//添加按钮
		});	
	
	}
	
	
    function getDate(jsonObj){
		var del =  $("#delButton").val(); //是否有删除按钮
		var edit =  $("#editButton").val();//是否有修改按钮
		var index = layer.load(1);
		var html = '';  //由于静态页面，所以只能作字符串拼接，实际使用一般是ajax请求服务器数据
		//模拟数据加载
		layer.close(index);
		//模拟数据分页（实际上获取的数据已经经过分页）
		var operatorLogJson = jsonObj.list;
		$.each(operatorLogJson, function(index, json){ 
			html += '<tbody>';
			html += "<tr>";
			html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + json.id + '" /></td>';
			html += "<td>" + json.userId  + "</td>";
			html += "<td>" + json.userName + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.story + "</td>";
			html += "<td style='text-align:left;word-wrap:break-word;word-break:break-all;'>" + json.afterContent + "</td>";
			html += "<td>" + json.createTime + "</td>";
			html += "<td>";
			if(del  == "true"){//判断是否有删按钮
				html += '<button class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.operatorLog.deleteData(\'' + json.id + '\')"><i class="layui-icon">&#xe640;</i></button>';
			}
			if(edit  == "true"){//判断是否有修改按钮
				html += '<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.operatorLog.editData(\'' + json.id + '\')"><i class="layui-icon">&#xe642;</i></button>';
			}
			html += "</td>";
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
 }
	 
    //输出接口，主要是两个函数，一个删除一个编辑
    var operatorLog = {
        deleteData: function (id) {
			var param = "id=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
               
				var json = base.get($, JSConstant.getConstant('del_log_url'), param);
				bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
				
            });
        }
    };
	
	
	//全选
  form.on('checkbox(allChoose)', function(data){
    var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
    child.each(function(index, item){
      item.checked = data.elem.checked;
    });
    form.render('checkbox');
  });


    exports('operatorLog', operatorLog);
});