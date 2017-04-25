/*

@Name：红尘
*/
 var $ = '';
layui.define(['laypage', 'layer', 'form', 'pagesize'], function (exports) {
        $ = layui.jquery,
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
			var result = '';
			result = initButton(json);						
			$('#tableDta tbody').html('');//清空tbody
			$('#tableDta').append(result);//往table添加tbody
			
			var parment ="";
			var resultJson = base.get($, JSConstant.getConstant('query_adminPermissionList_url'), parment);
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
		var json = base.get($, JSConstant.getConstant('query_adminPermissionList_url'), parment);
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
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.menu.add(\'' + "" + '\')">添加菜单</button>';
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
			html += '<tr id="tr'+json.permissionId+'">';
			html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + json.permissionId + '" /></td>';
			html += "<td>" + json.permissionId  + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.permissionName + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.permissionUrl+ "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.permissionResource + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.permissionDescription + "</td>";
			html += "<td>模块</td>";
			html += "<td>" + json.permissionParentId + "</td>";
			html += "<td>" + json.createTime + "</td>";
			// html += '<td><a href="###" onclick="layui.menu.openClose(\'' + json.permissionId   +  ', \''+ "123"    +  ', \'' +index+  '\')"> 展开</a></td>';
			
			html += '<td><a href="###" onclick="layui.menu.openClose(\''+json.permissionId+'\',this, \''+index+'\')">展开</a> </td>';
			html += "<td>";
			if(edit){//判断是否有修改按钮
				html += '<button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.menu.edit(\'' + json.permissionId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button>';
			}
			if(del){//判断是否有删按钮
				html += '<button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.menu.delete(\'' + json.permissionId + '\')"><i class="layui-icon">&#xe640;</i></button>';
			}
			html += "</td>";
			
			html += "</tr>";
			html += '</tbody>';
		}); 
		return html;
	}
	
	 
    //输出接口，主要是两个函数，一个删除一个编辑
    var menu = {
        delete: function (id) {
			var param = "permissionId=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
				var json = base.get($, JSConstant.getConstant('del_adminPermission_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}

            });
        },
        edit: function (id, roleId) {
			var parment = "permissionId=" + id;
			var json = base.get($, JSConstant.getConstant('query_permission_info_url'), parment);
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
				json = json.data;
			}else{
				return;
			}
			
			var html = htmlData(json, 2);
			layer.open({
				id: 'user', //设定一个id，防止重复弹出
				type: 1,
				title: '修改用户',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '550px'],
				yes: function(index, layero) {
					var bool = checkForm();
					if(!bool){
						return;
					}
					var msg = base.post($, JSConstant.getConstant('edit_adminPermission_url'), $("#form1").serialize());
					bool = base.isSucess(msg);
					if(bool){
						layer.close(index);
						location.reload();
					}
					
				},
				shade :false,
				maxmin :true
			});
			form.render(); //更新全部
        },
		add: function(){
			var json = base.get($, JSConstant.getConstant('query_parentPermission_url'), "");
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
				json = json.data;
			}else{
				return;
			}
			var html = htmlData(json, 1);
			layer.open({
				id: 'user', //设定一个id，防止重复弹出
				type: 1,
				title: '添加菜单',
				content: html,
				btn: ['确定', '取消'],
				area: ['750px', '550px'],
				yes: function(index, layero) {
					bool = checkForm();
					if(!bool){
						return;
					}
				
					var roleId = localStorage.getItem("roleId");		
					var parment = $("#form1").serialize();
					parment= parment+"&roleId="+roleId;
					var msg = base.post($, JSConstant.getConstant('add_adminPermission_url'), parment);
					bool = base.isSucess(msg);
					if(bool){
						layer.close(index);
						location.reload();
					}
				},
				shade :false,
				maxmin :true
			});
			form.render(); //更新全部
		},
		openClose:function (menuId,curObj,trIndex){
			var txt = $(curObj).text();
			var del =  $("#delButton").val(); //是否有删除按钮
			var edit =  $("#editButton").val();//是否有修改按钮

			if(txt=="展开"){
				$(curObj).text("折叠");
				$("#tr"+menuId).after("<tr class='main_info' id='tempTr"+menuId+"'><td colspan='4'>数据载入中</td></tr>");
				if(trIndex%2==0){
					$("#tempTr"+menuId).addClass("main_table_even");
				}

				//需动态传角色ID
				var roleId = localStorage.getItem("roleId");		
				var parment = "permissionId="+ menuId +"&roleId=" + roleId;
				var json = base.get($, JSConstant.getConstant('query_subPermission_url'), parment);
				var bool = base.isSucess(json);
				if(bool){
					var result = '';
					var jsonobj = json.data;
					var html = "";
					$.each(jsonobj, function(index, json){
						html += "<tr name='subTr"+menuId+"'>";
						html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + json.permissionId + '" /></td>';
						html += "<td>" + json.permissionId  + "</td>";
						html += "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + json.permissionName + "</td>";
						html += "<td>" + json.permissionUrl+ "</td>";
						html += "<td>" + json.permissionResource + "</td>";
						html += "<td>" + json.permissionDescription + "</td>";
						html += "<td>功能</td>";
						html += "<td>" + json.permissionParentId + "</td>";
						html += "<td>" + json.createTime + "</td>";
						html += '<td><a href="###" onclick="layui.menu.showHidden(\''+json.permissionId+'\',this, \''+index+'\')">折叠</a> </td>';
						html += "<td>";
						if(edit == "true"){//判断是否有修改按钮
							html += '<button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.menu.edit(\'' + json.permissionId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button>';
						}
						if(del == "true"){//判断是否有删按钮
							html += '<button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.menu.delete(\'' + json.permissionId + '\')"><i class="layui-icon">&#xe640;</i></button>';
						}
						
						html += "</td>";
									
						html += "</tr>";
						var subHtml = "";
						var buttons = json.subAdminPermission;
						$.each(buttons, function(index, butt){	
							html += "<tr name='subTr"+menuId+"' class='subTr"+ json.permissionId +"'>";
							html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + butt.permissionId + '" /></td>';
							html += "<td>" + butt.permissionId  + "</td>";
							html += "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + butt.permissionName + "</td>";
							html += "<td style='word-wrap:break-word;word-break:break-all;'>" + butt.permissionUrl+ "</td>";
							html += "<td style='word-wrap:break-word;word-break:break-all;'>" + butt.permissionResource + "</td>";
							html += "<td style='word-wrap:break-word;word-break:break-all;'>" + butt.permissionDescription + "</td>";
							html += "<td>按钮</td>";
							html += "<td>" + butt.permissionParentId + "</td>";
							html += "<td>" + butt.createTime + "</td>";
							html += '<td></td>';
							html += '<td>';
							if(edit == "true"){//判断是否有修改按钮
								html += '<button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.menu.edit(\'' + butt.permissionId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button>';
							}
							if(del =="true"){//判断是否有删按钮
								html += '<button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.menu.delete(\'' + butt.permissionId + '\')"><i class="layui-icon">&#xe640;</i></button>';
							}
							html += '</td>';
							html += "</tr>";		
						});

					});
					$("#tempTr"+menuId).before(html);
					form.render('checkbox');//刷新复选框
					if(jsonobj.length<1){
						$(curObj).text("展开");
					
						alert("没有相关数据");
					}
					
					$("#tempTr"+menuId).remove();
					if(trIndex%2==0){
						$("tr[name='subTr"+menuId+"']").addClass("main_table_even");
					}
				}
			}else{
				$("#tempTr"+menuId).remove();
				$("tr[name='subTr"+menuId+"']").remove();
				$(curObj).text("展开");
			}
		},
		showHidden(menuId, curObj, trIndex){
			var txt = $(curObj).text();
			if(txt=="折叠"){
				$(curObj).text("展开");
				$(".subTr"+ menuId).hide();
			}else{
				$(curObj).text("折叠");
				$(".subTr"+ menuId).show();
			}
		}
	
	
    };
	
	function htmlData(jsonObj, type){//type =1 新增 type =2 修改
		var jsonPermission;
		var subPermissionList;
		if(type == 2){
			jsonPermission = jsonObj.adminPermission;
			subPermissionList = jsonObj.subPermissionList;
			jsonObj = jsonObj.parentPermissionList;
			
		}
		var html = '<form  id="form1" class="layui-form" action="">';
		html+= '<div class="layui-form-item">';
		html+= '<input type="hidden" id="addId" value="" name="addId"/>';
		html+= '</div>';
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">资源名称：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="hidden" id="permissionId" value="'+jsonPermission.permissionId+'" name="permissionId"/>';
			html+= '<input type="hidden" id="originalPermissionName" value="'+jsonPermission.permissionName+'" name="originalPermissionName"/>';
			html+= '<input type="hidden" id="originalPermissionUrl" value="'+jsonPermission.permissionUrl+'"  class="layui-input">';
			html+= '<input type="text" id="permissionName" name="permissionName" style="width:500px; display: inline-block" value="'+jsonPermission.permissionName+'"  lay-verify="title" required  autocomplete="off" placeholder="请输入菜单名称" class="layui-input">';
		}else{
			html+= '<input type="text" id="permissionName" name="permissionName" style="width:500px; display: inline-block"  lay-verify="title" required  autocomplete="off" placeholder="请输入菜单名称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">父菜单：</label>';
		html+= '<div class="layui-input-inline">';
		html+= ' <select id="permissionParentId" name="permissionParentId" lay-filter="selectParentId">';
		html+= ' <option value="1">顶级菜单</option>';
		$.each(jsonObj, function(index, menu){
			if(type == 2 && jsonPermission.permissionParentId != 1){
				if(jsonPermission.permissionTypeId == 1 && (jsonPermission.permissionId == menu.permissionId || jsonPermission.permissionParentId == menu.permissionId)){
					html+= '<option selected value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
				}else if(jsonPermission.permissionTypeId == 2 &&subPermissionList[0].permissionParentId ==menu.permissionId){
					html+= '<option selected value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
				}else{
					html+= '<option  value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
				}
				
				
				
			}else{
				html+= '<option value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
			}
		});
		html+= ' </select>';
		html+= '</div>';
		
		html+= '<label class="layui-form-label">子菜单：</label>';
		html+= '<div class="layui-input-inline">';
		html+= ' <select id="permissionSubId" name="permissionSubId" lay-filter="selectSubId">';
		if(type == 2){
			if(jsonPermission.permissionParentId != 1 && jsonPermission.permissionTypeId !=1){
				html+= '<option value="-1">请选择</option>';
				$.each(subPermissionList, function(index, menu){
					if((jsonPermission.permissionTypeId ==1 &&jsonPermission.permissionId == menu.permissionId )|| jsonPermission.permissionParentId == menu.permissionId){
						html+= '<option selected value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
					}else {
						html+= '<option  value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
					}
				});
				
			}else{
				html+= ' <option value="-1">无</option>';
				$.each(subPermissionList, function(index, menu){
					if(!(jsonPermission.permissionId == menu.permissionId)){
						html+= '<option  value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
					}
				});
				
			}
			
		}else{
			html+= ' <option value="-1">无</option>';
		}			
		
		html+= ' </select>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">资源URL：</label>';
		html+= '<div id="divPermissionUrl" class="layui-input-block">';
		if(type == 2){
			if(jsonPermission.permissionTypeId ==1){
				html+= '<input type="text" id="permissionUrl" name="permissionUrl" style="width:500px; display: inline-block" value="'+jsonPermission.permissionUrl+'" lay-verify="title" required  autocomplete="off"  class="layui-input">';
			}else{
				if(jsonPermission.permissionUrl =="add" ){
					html+= '<input type="radio" checked name="permissionUrl" value="add" title="新增" checked="">';
					html+= '<input type="radio"  name="permissionUrl" value="del" title="删除">';
					html+= '<input type="radio" name="permissionUrl" value="edit" title="修改">';
				}else if(jsonPermission.permissionUrl =="del" ){
					html+= '<input type="radio"  name="permissionUrl" value="add" title="新增" checked="">';
					html+= '<input type="radio"  checked name="permissionUrl" value="del" title="删除">';
					html+= '<input type="radio" name="permissionUrl" value="edit" title="修改">';
				}else if(jsonPermission.permissionUrl =="edit" ){
					html+= '<input type="radio"   name="permissionUrl" value="add" title="新增" checked="">';
					html+= '<input type="radio"   name="permissionUrl" value="del" title="删除">';
					html+= '<input type="radio"  checked name="permissionUrl" value="edit" title="修改">';
				}
			}
		
		}else{
			html+= '<input type="text" id="permissionUrl" name="permissionUrl" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" class="layui-input">';
		}
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">资源类型：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			if(jsonPermission.permissionTypeId ==1){
				 html+= '<input type="radio" lay-filter="radioTypeId" checked name="permissionTypeId" value="1" title="功能" checked="">';
				html+= '<input type="radio"  lay-filter="radioTypeId" name="permissionTypeId" value="2" title="按钮">';
			}else if(jsonPermission.permissionTypeId ==2){
				 html+= '<input type="radio" lay-filter="radioTypeId"  name="permissionTypeId" value="1" title="功能" checked="">';
				html+= '<input type="radio"  lay-filter="radioTypeId" checked name="permissionTypeId" value="2" title="按钮">';
			}
			 
		}else{
			 html+= '<input type="radio"  lay-filter="radioTypeId" name="permissionTypeId" value="1" title="功能" checked="">';
			 html+= '<input type="radio" lay-filter="radioTypeId" name="permissionTypeId" value="2" title="按钮">';
		}
		html+= '</div>';
		html+= '</div>';
		
		
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">权限控制：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="permissionResource" name="permissionResource" style="width:500px; display: inline-block" value="'+jsonPermission.permissionResource+'" lay-verify="title" required  autocomplete="off" placeholder="请输权限" class="layui-input">';
		}else{
			html+= '<input type="text" id="permissionResource" name="permissionResource" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输权限" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label">资源说明：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="permissionDescription" name="permissionDescription" style="width:500px; display: inline-block" value="'+jsonPermission.permissionDescription+'" lay-verify="title" required  autocomplete="off" placeholder="请输权限" class="layui-input">';
		}else{
			html+= '<input type="text" id="permissionDescription" name="permissionDescription" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off"  class="layui-input">';
		}
		html+= '</div>';
		html+= '</div>';
		
		

		html+= '</form>';
		return html;
	}
	
	 function checkForm(){
		var parentId = $("#permissionParentId option:selected").val();//父菜单：
		var subId = $("#permissionSubId option:selected").val();//子菜单
		var permissionTypeId =$('input:radio[name="permissionTypeId"]:checked').val();
		if(permissionTypeId == "2" && permissionTypeId=="-1"){
			alert('请选择子菜单');
			return false;
		}
		
		return true; 
	 }
	
 //单选框事件
 form.on('radio(radioTypeId)', function(data){
  //alert(data.elem.checked);//是否选中
    var parentId = $("#permissionSubId option:selected").val();  
	if(data.elem.value == 2){//按钮
		if(parentId == "-1"){
			alert("请选择子菜单");
			$("#radioTypeId")
			data.elem.checked = false;
			var radio = $("input[name='permissionTypeId']");
			radio[0].checked =true;
			
		}else{
			$("#divPermissionUrl").empty();
			var html = '';
			 html+= '<input type="radio"  name="permissionUrl" value="add" title="新增" checked="">';
			 html+= '<input type="radio"  name="permissionUrl" value="del" title="删除">';
			 html+= '<input type="radio" name="permissionUrl" value="edit" title="修改">';
			$("#divPermissionUrl").html(html);
		}
		form.render();
	}
	
	if(data.elem.value == 1){//功能
		if(parentId != "-1"){
			var html= '<input type="text" id="permissionUrl" name="permissionUrl" style="width:600px;"  lay-verify="title" autocomplete="off" class="layui-input">';
			$("#divPermissionUrl").html(html);

			  //$("#permissionSubId").find("option[value='-1']").attr("selected",true);
			$("#permissionSubId").val("请选择");
			form.render();
		}	
	}

  });
  
 //下拉事件1
 form.on('select(selectParentId)', function(data){
    //alert(data.elem.checked);//是否选中
	var parment = "permissionId="+ data.elem.value;
	var json = base.get($, JSConstant.getConstant('query_parentPermission_url'), parment);
	var bool = base.isSucess(json);
    if(bool){
		json = json.data;
		var html = '';
		html+= '<option value="-1">请选择</option>';
		$.each(json, function(index, menu){
			html+= '<option value="'+menu.permissionId+'">'+menu.permissionName+'</option>';
		});
		if(json.length<1){
			html = '';
			html+= ' <option value="-1">无</option>';
		}
		$('#permissionSubId').html(html);
		
		var radio = $("input[name='permissionTypeId']");
		radio[0].checked =true;
		var html2= '<input type="text" id="permissionUrl" name="permissionUrl" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" class="layui-input">';
		$("#divPermissionUrl").html(html2);
		form.render();
	}

	
	form.render();
   
  });
  
  //下拉事件2
 form.on('select(selectSubId)', function(data){
    //alert(data.elem.checked);//是否选中
	var radio = $("input[name='permissionTypeId']");
	if(data.elem.value=="-1"){
		var html= '<input type="text" id="permissionUrl" name="permissionUrl" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" class="layui-input">';
		radio[0].checked =true;
		$("#divPermissionUrl").html(html);
	}else{
		radio[1].checked =true;
		$("#divPermissionUrl").empty();
		var html = '';
		 html+= '<input type="radio"  name="permissionUrl" value="add" title="新增" checked="">';
		 html+= '<input type="radio"  name="permissionUrl" value="del" title="删除">';
		 html+= '<input type="radio" name="permissionUrl" value="edit" title="修改">';
		 $("#divPermissionUrl").html(html);
	}
	form.render();
  });
  exports('menu', menu);
});
