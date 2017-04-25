/*

@Name：红尘

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
		var roleId = localStorage.getItem("roleId");
		var parment = "permissionId="+ permissionId+"&roleId="+ roleId;
		var json = base.get($, JSConstant.getConstant('query_adminPermissionButton_url'), parment);
		var bool = base.isSucess(json);
		if(bool){
			initButton(json);					
			$('#tableDta tbody').html('');//清空tbody
			var parment ="";
			var resultJson = base.get($, JSConstant.getConstant('query_adminUserList_url'), parment);
			bool = base.isSucess(resultJson);
			if(bool){
				initPage(resultJson);
			}
			
		}
		
	 }
	 //初始化分页标签
	 function initPage(resultJson){
		//var parment ="";
		//var resultJson = asyn.get($, JSConstant.getConstant('query_adminUserList_url'), parment);
		//resultJson = $.parseJSON( resultJson ); 
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
		var json = base.get($, JSConstant.getConstant('query_adminUserList_url'), parment);
		//var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象 
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
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.user.addUser(\'' + "" + '\')">添加用户</button>';
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
			html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + json.userId + '" /></td>';
			html += "<td>" + json.userId  + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.userName + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.nickName+ "</td>";
			html += "<td>" + json.userStatus + "</td>";
			html += "<td>" + userRoleName + "</td>";
			html += "<td>" + json.createTime + "</td>";
			html+="<td>";
			if(edit == "true"){//判断是否有修改按钮
				html += '<button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.user.editUser(\'' + json.userId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button>';
			}
			if(del == "true"){//判断是否有删按钮
				html += '<button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.user.deleteUser(\'' + json.userId + '\')"><i class="layui-icon">&#xe640;</i></button>';
			
			}
			html += "</td>";
			
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
	}
	
    //输出接口，主要是两个函数，一个删除一个编辑
    var user = {
        deleteUser: function (id) {
			var param = "usersId=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
				var json = base.get($, JSConstant.getConstant('del_adminUser_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
				
            });
        },
        editUser: function (userId, roleId) {
			var parment = "usersId=" + userId;
			var json = base.get($, JSConstant.getConstant('query_adminUseId_url'), parment);
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
				json = json.data;
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
					var msg = base.post($, JSConstant.getConstant('update_adminUser_url'), $("#form1").serialize());
					var bool = base.isSucess(msg);
					if(bool){
						alert("操作成功");
						layer.close(index);
						location.reload();
					}
					
				},
				shade :false,
				maxmin :true
			});
			form.render('checkbox');//刷新复选框
        },
		addUser: function(){
			var json = base.get($, JSConstant.getConstant('query_roleAll_url'), "");
			//var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象
			var bool = base.isSucess(json);
			var result = '';
			if(bool){
				json = json.data;
			}else{
				return;
			}						
			var html = htmlUser(json, 1,"");
			layer.open({
				id: 'user', //设定一个id，防止重复弹出
				type: 1,
				title: '添加用户',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '550px'],
				yes: function(index, layero) {
					var msg = base.post($, JSConstant.getConstant('add_adminUser_url'), $("#form1").serialize());
					bool = base.isSucess(msg);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render('checkbox');//刷新复选框
		}
    };
	
	function htmlUser(jsonObj, type, roleIds){//type =1 新增 type =2 修改
		var jsonUser;
		if(type == 2){
			jsonUser = jsonObj.adminUser;
			jsonObj = jsonObj.adminRoleList;
		}
		
		var html = '<form  id="form1" class="layui-form" action="">';
		html+= '<div class="layui-form-item">';
		html+= '<input type="hidden" id="addId" value="" name="addId"/>';
		html+= '</div>';
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">用户名：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="hidden" id="originalRoleId" value="'+roleIds+'" name="originalRoleId"/>';
			html+= '<input type="hidden" id="originalUserName" value="'+jsonUser.userName+'" name="originalUserName"/>';
			html+= '<input type="hidden" id="usersId" name="usersId" style="width:500px; display: inline-block" value="'+jsonUser.userId+'"  class="layui-input">';
			html+= '<input type="text" id="userName" name="userName" style="width:500px; display: inline-block" value="'+jsonUser.userName+'" readonly="readonly" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
	}else{
			html+= '<input type="text" id="userName" name="userName" style="width:500px; display: inline-block"  lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">昵称：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="nickName" name="nickName" style="width:500px; display: inline-block" value="'+jsonUser.nickName+'" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
		}else{
			html+= '<input type="text" id="nickName" name="nickName" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入昵称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">密码：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="userPassword" name="userPassword" style="width:500px; display: inline-block" value="'+jsonUser.userPassword+'" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
		}else{
			html+= '<input type="password" id="userPassword" name="userPassword" style="width:500px; display: inline-block"  lay-verify="pass" autocomplete="off" placeholder="请输入密码" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">角色：</label>';
		html+= '<div id="div_table" class="layui-form">';
		
		html+= '<div class="layui-input-block">';
		$.each(jsonObj, function(index, role){
			if(type == 2){
				if(role.roleId == roleIds){
					html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu" checked=""  value="'+role.roleId+'" title="'+role.roleName+'"/>';
				}else{
					html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu"  value="'+role.roleId+'" title="'+role.roleName+'"/>';	
				}
			}else{
				html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu"  value="'+role.roleId+'" title="'+role.roleName+'"/>';
			}
			
		});
		
		html+= '</div>';
		html+= '</div>';
		html+= '</div>';
		html+= '</form>';
		return html;
	}
	


 //按钮事件
 form.on('checkbox(roleMenu)', function(data){
  //alert(data.elem.checked);//是否选中
  //alert(data.elem.value);//获取值
   var bool = false;
   if(data.elem.checked){
		bool = true;
   }
	
	//选中子菜单
	var child = $(data.elem).parents('div').find('input[type="checkbox"]');  
	 child.each(function(index, item){
		item.checked = false;
	});
	
	 data.elem.checked = bool;
	 form.render('checkbox');
	 
   
  });
  
   //自定义验证规则  
  form.verify({  
    title: function(value){  
      if(value.length < 5){  
        return '标题至少得5个字符啊';  
      }  
    }  
    ,pass: [/(.+){6,12}$/, '密码必须6到12位']  
  });


    exports('user', user);
});