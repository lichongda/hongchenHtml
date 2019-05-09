/*
@Author：Absolutely 
@Site：http://www.lyblogs.cn

*/

layui.define(['laypage', 'layer',  'form', 'pagesize'], function (exports) {
		var $ = layui.jquery,
		table = layui.table,
		laypage = layui.laypage,
        layer = layui.layer,
        form = layui.form();
		var laypageId = 'demo7';
        //laypage = layui.laypage;
		//var laypageId = 'pageNav';
   
	initData();
	function initData(){
		var permissionId = base.getURLParameter("permissionId");
		var name =$("#name").val();
		var ip =$("#serverIp").val();
		//需动态传角色ID
		var roleId = localStorage.getItem("roleId");		
		var parment = "roleId=" + roleId+"&name="+name+"&serverIp="+ip;;
		
		var json = base.get($, JSConstant.getConstant('query_adminPermissionButton_url'), parment);
		var bool = base.isSucess(json);
		if(bool){
			initButton(json);					
			$('#tableDta tbody').html('');//清空tbody
			
			var resultJson = base.get($, JSConstant.getConstant('query_remoteSshList_url'), parment);
			//alert(JSON.stringify(resultJson));
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
		var json = base.get($, JSConstant.getConstant('query_remoteSshList_url'), parment);
		alert(JSON.stringify(json));
		var bool = base.isSucess(json);
		if(bool){
			var resultJson = json;
			json = json.data;
			//initTableData(json);
			initPage(resultJson);
		}
	 }
	 
	 function searchList(){
		var name =$("#name").val();
		var ip =$("#serverIp").val();
		
		var parment = "name="+name+"&serverIp="+ip;
		 
		 //var parment = "current="+ curr +"&size=" + pageSize;
		 var json = base.get($, JSConstant.getConstant('query_remoteSshList_url'), parment);
		 //$('#dataContent').remove('#'+laypageId + ');
		 alert(JSON.stringify(json));
		 var bool = base.isSucess(json);
		 if(bool){
			var resultJson = json;
			json = json.data;
			 $('#tableDta tbody').html('');//清空tbody
			//initTableData(json);
			initPage(resultJson);
		}
		
		

                   
	
	 }
	 
	 
	 //初始化表格数据
	 function initTableData(jsonData){
		var reslult = getDate(jsonData);
		$('#tableDta tbody').html('');//清空tbody
		$('#tableDta').append(reslult);//往table添加tbody

		//$('#dataContent').remove("' + laypageId + '");
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
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.remoteSsh.addData(\'' + "" + '\')">添加定时器</button>';
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
			html += '<td><input type="checkbox" name="ids" lay-skin="primary" lay-filter="chekId" value="' + json.id + '" /></td>';
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.id + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.name+ "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.serverIp + "</td>";
			html += "<td>" + json.serverPort + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.command + "</td>";
			var isRun = false;
			if(json.connectionType == 0){
				html += "<td><font color='#AF0000'>密码</font></td>";
				isRun = true;
			}else{
				html += "<td><font color='#AF0000'>密钥</font></td>";
			}
			html += "<td>" + json.serverAccount + "</td>";
			html += "<td>" + json.keyName + "</td>";
			html += "<td>" + json.remarks + "</td>";
			html += "<td>" + json.createTime + "</td>";

			if(edit == "true"){//判断是否有修改按钮
				html += '<td><button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.user.editUser(\'' + json.id + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button></td>';
			}
			if(del == "true"){//判断是否有删按钮
				html += '<td><button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.user.deleteUser(\'' + json.id + '\')"><i class="layui-icon">&#xe640;</i></button></td>';
			}else{
				//html += "<td></td>";
			}
			
			html += '<td style="text-align:left;">';
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.remoteSsh.edit(\'' + json.id + '\')">修改</button>';
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.remoteSsh.delete(\'' + json.id + '\')">删除</button>';
			html += '</td>'
			
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
	}
	
    //输出接口，主要是两个函数，一个删除一个编辑
    var remoteSsh = {
        delete: function (id) {
			var param = "id=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
				var json = base.get($, JSConstant.getConstant('del_remoteSsh_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
			});
        },
		searchData:function(){
			//searchList();
			//initData();
			var name =$("#name").val();
			var ip =$("#serverIp").val();
			var parment = "name="+name+"&serverIp="+ip;
			 var json = base.get($, JSConstant.getConstant('query_remoteSshList_url'), parment);
		   
		 
            var bool = base.isSucess(json);
            if(bool){
                //initButton(json);
                $('#tableDta tbody').html('');//清空tbody

                    initPage(json);
            }
		
		},
        edit: function (id, roleId) {
			var parment = "id=" + id;
			var json = base.get($, JSConstant.getConstant('query_remoteSsh_url'), parment);
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
				json = json.data;
			}else{
				return;
			}
			var html = htmlUser(json, 2, roleId);
			layer.open({
				id: 'remoteSsh', //设定一个id，防止重复弹出
				type: 1,
				title: '修改机器IP',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '450px'],
				yes: function(index, layero) {
					bool = checkForm();
					if(!bool){
						return;
					}					

					var msg = base.post($, JSConstant.getConstant('edit_remoteSsh_url'), $("#form1").serialize());
					
					bool = base.isSucess(msg);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render();//刷新复选框
        },
        addData: function(){
			var json = base.get($, JSConstant.getConstant('query_remoteSsh_url'), "");
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
				json = json.data;
			}else{
				return;
			}
			var html = htmlUser(json, 1,"");
			layer.open({
				id: 'remoteSsh', //设定一个id，防止重复弹出
				type: 1,
				title: '添加机器IP',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '450px'],
				yes: function(index, layero) {
					var bool = checkForm();
					if(!bool){
						return;
					}
					var msg = base.post($, JSConstant.getConstant('add_remoteSsh_url'), $("#form1").serialize());
					var bool = base.isSucess(msg);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render();//刷新复选框
		},
        execute: function(id){
             var idsValue =[]; 
				$('input[name="ids"]:checked').each(function(){ 
					idsValue.push($(this).val()); 
				}); 
				if(idsValue.length==0){
					alert("你还没有选择任何内容");
					return;
				}
			   
				//alert(JSON.stringify(idsValue));
				var message;
				layer.confirm('确定要执行命令吗？', {
					btn: ['确定', '取消'] //按钮
				}, 
				function (index, layero) {
					
					var param = "ids=" + idsValue; 
					
					var json = base.get($, JSConstant.getConstant('execute_remoteSsh_url'), param);
					//alert(JSON.stringify(json));
					message = json.data;
					var bool = base.isSucess(json);
					 //弹出一个页面层

					if(true){
						layer.close(index);
						 window.layer.open({
						  type: 1,
						   fixed: true, //不固定
						   moveType: 1, //拖拽模式，0或者1
						  skin: 'layui-layer-rim', //加上边框
						  area: ['1000px', '500px'],
						  
						  shadeClose: true, //点击遮罩关闭
						  content: '\<\div style="padding:20px;">'+message+'\<\/div>'
						});
						//location.reload();
					}
            });
			
		}
      

    };
	
	 function checkForm(){
		var scheduleJobName = $("#scheduleJobName").val();
		var scheduleJobCronExpression = $("#scheduleJobCronExpression").val();
		var scheduleJobClass = $("#scheduleJobClass").val();
		var scheduleJobMethod = $("#scheduleJobMethod").val();

		var scheduleJobGroupId = $("#scheduleJobGroupId option:selected").val();
		
		if(scheduleJobName==""){
			alert("请输入定时器名称");
			$("#scheduleJobName").focus();
			return false;
		}
		if(scheduleJobCronExpression==""){
			alert("请输入表达式");
			$("#scheduleJobCronExpression").focus();
			return false;
		}
		if(scheduleJobClass==""){
			alert("请输入调用类");
			$("#scheduleJobClass").focus();
			return false;
		}
		
		if(scheduleJobMethod==""){
			alert("请输入调用方法");
			$("#scheduleJobMethod").focus();
			return false;
		}

		if(scheduleJobGroupId == "-1"){
			alert("请选择分组");
			return;
		}
		return true; 
	 }
	
	function htmlUser(jsonObj, type, roleIds){//type =1 新增 type =2 修改
		var html = '<form  id="form1" class="layui-form" action="">';
		html+= '<div class="layui-form-item">';
		html+= '<input type="hidden" id="addId" value="" name="addId"/>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">服务器名称：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="hidden" id="id" name="id" style="width:500px;" value="'+jsonObj.id+'"  class="layui-input">';
			html+= '<input type="text" id="name" name="name" style="width:500px; display: inline-block" value="'+jsonObj.name+'"  lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
		}else{
				html+= '<input type="text" id="name" name="name" style="width:500px; display: inline-block" lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">服务器IP：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="serverIp" name="serverIp" style="width:500px; display: inline-block" value="'+jsonObj.serverIp+'" lay-verify="title" required  autocomplete="off" placeholder="请输入服务器IP" class="layui-input">';
		}else{
			html+= '<input type="text" id="serverIp" name="serverIp" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入服务器IP" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">服务器端口：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="serverPort" name="serverPort" style="width:500px; display: inline-block" value="'+jsonObj.serverPort+'" lay-verify="title" required  autocomplete="off" placeholder="请输入服务器端口" class="layui-input">';
		}else{
			html+= '<input type="text" id="serverPort" name="serverPort" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入服务器端口" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">执行命令：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			 html+= '<textarea id="command" name="command" placeholder="请输入执行命令" style="width:500px; display: inline-block" class="layui-textarea">'+jsonObj.command+'</textarea>';
		}else{
			html+= '<textarea id="command" name="command" placeholder="请输入执行命令" style="width:500px; display: inline-block" class="layui-textarea"></textarea>';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';

        html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">服务器账号：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="serverAccount" name="serverAccount" style="width:500px; display: inline-block" value="'+jsonObj.serverAccount+'" lay-verify="title" required  autocomplete="off" placeholder="请输入服务器账号" class="layui-input">';
        }else{
            html+= '<input type="text" id="serverAccount" name="serverAccount" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off"  placeholder="请输入服务器账号" class="layui-input" />';
        }
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
        html+= '</div>';
        html+= '</div>';
		
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">连接类型:</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			if(jsonObj.connectionType ==0){
				 html+= '<input type="radio" lay-filter="radioTypeId" checked name="connectionType" value="0" title="密码" checked="">';
				html+= '<input type="radio"  lay-filter="radioTypeId" name="connectionType" value="1" title="密钥">';
			}else if(jsonObj.connectionType ==1){
				 html+= '<input type="radio" lay-filter="radioTypeId"  name="connectionType" value="0" title="密码" checked="">';
				html+= '<input type="radio"  lay-filter="radioTypeId" checked name="connectionType" value="1" title="密钥">';
			}
			 
		}else{
			 html+= '<input type="radio"  lay-filter="radioTypeId" name="connectionType" value="0" title="密码" checked="">';
			 html+= '<input type="radio" lay-filter="radioTypeId" name="connectionType" value="1" title="密钥">';
		}
		html+= '</div>';
		html+= '</div>';
			
        html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">密钥名称：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="keyName" name="keyName" style="width:500px; display: inline-block"  value="'+jsonObj.keyName+'" lay-verify="title" required  autocomplete="off"  class="layui-input">';
        }else{
            html+= '<input type="text" id="keyName" name="keyName" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off" class="layui-input">';
        }
        html+= '</div>';
        html+= '</div>';
		
		html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">密码：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="serverPassword" name="serverPassword" style="width:500px; display: inline-block"  value="'+jsonObj.serverPassword+'" lay-verify="title" required  autocomplete="off"  class="layui-input">';
        }else{
            html+= '<input type="text" id="serverPassword" name="serverPassword" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off" class="layui-input">';
        }
        html+= '</div>';
        html+= '</div>';
		
		html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">备注：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="remarks" name="remarks" style="width:500px; display: inline-block"  value="'+jsonObj.remarks+'" lay-verify="title" required  autocomplete="off"  class="layui-input">';
        }else{
            html+= '<input type="text" id="remarks" name="remarks" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off" class="layui-input">';
        }
        html+= '</div>';
        html+= '</div>';


		html+= '</form>';
		return html;
	}
	
 //全选
  form.on('checkbox(allChoose)', function(data){
    var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
    child.each(function(index, item){
      item.checked = data.elem.checked;
     });
    form.render('checkbox');
  });
  

    exports('remoteSsh', remoteSsh);
});