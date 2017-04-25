/*
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
			var	result = initButton(json);					
			$('#tableDta tbody').html('');//清空tbody
			$('#tableDta').append(result);//往table添加tbody
			
			var parment ="";
			var resultJson = base.get($, JSConstant.getConstant('query_quartzSchedulejobGroupList_url'), parment);
			var bool = base.isSucess(resultJson);
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
		var msg = base.get($, JSConstant.getConstant('query_quartzSchedulejobGroupList_url'), parment);
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
	
	function isSucess(data){
		var json = $.parseJSON( data );
		if(json.code == 0){
			layer.msg("操作成功");
			initilData();
		}else{
			layer.msg(json.error);
		}
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
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.quartzGroup.addData(\'' + "" + '\')">添加定时器</button>';
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
		var adminUserJson = jsonObj.list;
		$.each(adminUserJson, function(index, json){
			var userRoleName = "";
			var roleId = "";
			$.each(json.roleList, function(index, role){
				roleId = role.roleId;
				userRoleName += role.roleName;
			});
			html += '<tbody>';
			html += "<tr>";
			
			html += "<td>" + json.scheduleJobGroupId + "</td>";
			html += "<td>" + json.scheduleJobGroupName + "</td>";
			html += "<td>" + json.scheduleJobGroupDescription+ "</td>";

			if(json.status == 0){
				html += "<td><font color='#AF0000'>运行中</font></td>";
			}else{
				html += "<td><font color='#AF0000'>停止</font></td>";
			}
			

			
			html += "<td>" + json.createTime + "</td>";
			if(edit == "true"){//判断是否有修改按钮
				html += '<td><button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.user.editUser(\'' + json.userId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button></td>';
			}else{
				//html += "<td></td>";
			}
			if(del == "true"){//判断是否有删按钮
				html += '<td><button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.user.deleteUser(\'' + json.userId + '\')"><i class="layui-icon">&#xe640;</i></button></td>';
			}else{
				//html += "<td></td>";
			}
			
			html += '<td>'
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartzGroup.edit(\'' + json.scheduleJobGroupId + '\')">修改</button>';
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartzGroup.delete(\'' + json.scheduleJobGroupId + '\')">删除</button>';
			if(json.status == 0){
				html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartzGroup.stop(\'' + json.scheduleJobGroupId + '\')">停止</button>';
			}else{
				html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartzGroup.start(\'' + json.scheduleJobGroupId + '\')">运行</button>';
			}

			html += '</td>'			
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
	}
	
    //输出接口，主要是两个函数，一个删除一个编辑
    var quartzGroup = {
        delete: function (id) {
			var param = "scheduleJobGroupId=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
				var json = base.get($, JSConstant.getConstant('del_quartzSchedulejobGroup_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
        },
        edit: function (id, roleId) {
			var parment = "scheduleJobGroupId=" + id;
			var json = base.get($, JSConstant.getConstant('query_quartzSchedulejobGroup_url'), parment);
			var bool = base.isSucess(json);
			if(bool){
				json = json.data;	
			}else{
				return;
			}
			var html = htmlUser(json, 2, roleId);
			layer.open({
				id: 'user', //设定一个id，防止重复弹出
				type: 1,
				title: '修改用户',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '550px'],
				yes: function(index, layero) {
					bool = checkForm();
					if(!bool){
						return;
					}
					json = base.post($, JSConstant.getConstant('edit_quartzSchedulejobGroup_url'), $("#form1").serialize());
					bool = base.isSucess(json);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render('radio');//刷新复选框
        },
        addData: function(){
			var html = htmlUser("", 1,"");
			layer.open({
				id: 'user', //设定一个id，防止重复弹出
				type: 1,
				title: '添加用户',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '550px'],
				yes: function(index, layero) {
					var bool = checkForm();
					if(!bool){
						return;
					}
					var json = base.post($, JSConstant.getConstant('add_quartzSchedulejobGroup_url'), $("#form1").serialize());
					var bool = base.isSucess(json);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render('radio');
			form.render('checkbox');//刷新复选框
		},
        start: function(id){
            var param = "scheduleJobGroupId=" + id;
            layer.confirm('确定要启动任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('start_quartzSchedulejobGroup_url'), param);
                var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
		},
		stop: function(id){
            var param = "scheduleJobGroupId=" + id;
            layer.confirm('确定要停止任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('stop_quartzSchedulejobGroup_url'), param);
                var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
		}
     

    };
	
	 function checkForm(){
		var scheduleJobGroupName = $("#scheduleJobGroupName").val();
		var scheduleJobGroupDescription = $("#scheduleJobGroupDescription").val();
		
		if(scheduleJobGroupName==""){
			alert("请输入分组名称");
			$("#scheduleJobGroupName").focus();
			return false;
		}
		if(scheduleJobGroupDescription==""){
			alert("请输入分组说明");
			$("#scheduleJobGroupDescription").focus();
			return false;
		}
		
		return true; 
	 }
	
	function htmlUser(jsonObj, type, roleIds){//type =1 新增 type =2 修改
		var html = '<form  id="form1" class="layui-form" action="">';
		html+= '<div class="layui-form-item">';
		html+= '<input type="hidden" id="addId" value="" name="addId"/>';
		html+= '</div>';
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">分组名称：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="hidden" id="scheduleJobGroupId" value="'+jsonObj.scheduleJobGroupId+'" name="scheduleJobGroupId"/>';
			html+= '<input type="hidden" id="originalScheduleJobGroupName" value="'+jsonObj.scheduleJobGroupName+'" name="originalScheduleJobGroupName"/>';
			html+= '<input type="text" id="scheduleJobGroupName" name="scheduleJobGroupName" style="width:500px; display: inline-block" value="'+jsonObj.scheduleJobGroupName+'"  lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
		}else{
			html+= '<input type="text" id="scheduleJobGroupName" name="scheduleJobGroupName" style="width:500px; display: inline-block"  lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">分组说明：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="scheduleJobGroupDescription" name="scheduleJobGroupDescription" style="width:500px; display: inline-block" value="'+jsonObj.scheduleJobGroupDescription+'" lay-verify="title" required  autocomplete="off" placeholder="请输任务表达式" class="layui-input">';
		}else{
			html+= '<input type="text" id="scheduleJobGroupDescription" name="scheduleJobGroupDescription" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输任务表达式" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		if(type == 2){
		}else{
			html+= '<div class="layui-form-item">';
			html+= '<label class="layui-form-label">状态：</label>';
			html+= '<div class="layui-input-block">';
			html+= '<input type="radio" lay-filter="radioTypeId" name="status" value="0" title="启动" checked="">';
			html+= '<input type="radio" checked lay-filter="radioTypeId" name="status" value="1" title="禁止">';
		
			html+= '</div>';
			html+= '</div>';
		}
		html+= '</form>';
		return html;
	}

    exports('quartzGroup', quartzGroup);
});