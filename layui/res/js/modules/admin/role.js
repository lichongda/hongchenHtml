/*

@Name：红尘
*/

layui.define(['laypage', 'layer', 'form', 'pagesize'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
		laypage = layui.laypage,
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
			var result = initButton(json);				
			$('#dataContent tbody').html('');//清空tbody
			$('#dataContent').append(result);//往table添加tbody
			//form.render('checkbox');//刷新复选框
			var parment ="";
			var resultJson = base.get($, JSConstant.getConstant('query_role_url'), parment);
			bool = base.isSucess(resultJson);
			if(bool){
				initPage(resultJson);
			}else{
				//无权限操作
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
		var json = base.get($, JSConstant.getConstant('query_role_url'), parment);
		var bool = base.isSucess(json);
		if(bool){
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
				buttons += '<button class="layui-btn layui-btn-normal" onclick="layui.role.addRole(\'' + "" + '\')">添加用户</button>';
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
		var adminRole = jsonObj.list;
		
		$.each(adminRole, function(index, json){
			var userList = "";
			$.each(json.userListserList, function(index, user){
				if(userList == ""){
					userList += user.nickName;
				}else{
					userList +=  ","+ user.nickName;
				}
				
			});
			html += '<tbody>';
			html += "<tr>";
			html += '<td><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" value="' + json.roleId + '" /></td>';
			html += "<td>" + json.roleId  + "</td>";
			html += "<td>" + json.roleName + "</td>";
			html += "<td>" + userList+ "</td>";
			html += "<td>" + json.roleDescription + "</td>";
			html += "<td>" + json.createTime + "</td>";
			if(edit){//判断是否有修改按钮
				html += '<td><button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.role.editData(\'' + json.roleId + '\', \'' + json.roleName + '\', \'' + json.roleDescription + '\')"><i class="layui-icon">&#xe642;</i></button></td>';
			}else{
				html += "<td></td>";
			}
			if(del){//判断是否有删按钮
				html += '<td><button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.role.deleteData(\'' + json.roleId + '\')"><i class="layui-icon">&#xe640;</i></button></td>';
			}else{
				html += "<td></td>";
			}
			
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
 }
	 
    //输出接口，主要是两个函数，一个删除一个编辑
    var role = {
        deleteData: function (id) {
			var param = "roleId=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function(index, layero) {
               
				var json = base.get($, JSConstant.getConstant('del_role_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
        },
        editData: function (roleId, roleName, roleDescription) {
			//$("#test").attr("disabled",  "disabled");  
			//$("#editButton").attr("disabled",true);//将按钮禁止掉
			var html = '<form  id="form1" class="layui-form" action="">';
				html+= '<div class="layui-form-item">';
				html+= '<input type="hidden" id="delId" value="" name="delId"/>';
				html+= '<input type="hidden" id="addId" value="" name="addId"/>';
				html+= '<input type="hidden" id="originalRoleName" value="'+roleName+'" name="originalRoleName"/>';
				
				html+= '<input type="hidden" id="roleId" value="'+roleId+'" name="roleId"/>';
				html+= '</div>';
				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">角色名称：</label>';
				html+= '<div class="layui-input-block">';
				html+= '<input type="text" id="roleName" name="roleName" value="'+roleName+'" style="width:500px; display: inline-block" lay-verify="title" required  autocomplete="off" placeholder="请输入角色名称" class="layui-input">';
				html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
				html+= '</div>';
				html+= '</div>';
				
				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">备注：</label>';
				html+= '<div class="layui-input-block">';
				html+= '<input type="text"  id="roleDescription" name="roleDescription" value="'+roleDescription+'" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入角色说明" class="layui-input">';
				html+= '</div>';
				html+= '</div>';

				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">权限：</label>';
				html+= '<div id="div_table" class="layui-form">';
				html+= '<table id="prvilegeTable" class="layui-table" lay-skin="line" style="width:500px; display: inline-block">';
				html += '<colgroup>';
				html += '<col width="160">';
				html += '<col>';
				html += '</colgroup>';
				html+= '</table>';
				
				html+= '</div>';
				html+= '</div>';
			    html+= '</form>';
				layer.open({
					type: 1,
					id: 'prvilege', //设定一个id，防止重复弹出
					title: '角色修改',
					content: html,
					btn: ['确定', '取消'],
					area: ['750px', '550px'],
					yes: function(index, layero) {
						var json = base.post($, JSConstant.getConstant('update_role_url'), $("#form1").serialize());
						bool = base.isSucess(json);
						if(bool){
							layer.close(index);
							location.reload();
						}
					},
				
				
					shade :false,
					maxmin :true
				});
			var param = "roleId=" +roleId;
			getPrvilege(false, param);
        },
		addRole: function(){
			var html = '<form  id="form1" class="layui-form" action="">';
				html+= '<div class="layui-form-item">';
				html+= '<input type="hidden" id="delId" value="" name="delId"/>';
				html+= '<input type="hidden" id="addId" value="" name="addId"/>';
				html+= '</div>';
				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">角色名称：</label>';
				html+= '<div class="layui-input-block">';
				html+= '<input type="text" id="roleName" name="roleName" style="width:500px; display: inline-block"  lay-verify="title" required  autocomplete="off" placeholder="请输入角色名称" class="layui-input">';
				html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
				html+= '</div>';
				html+= '</div>';
				
				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">备注：</label>';
				html+= '<div class="layui-input-block">';
				html+= '<input type="text" id="roleDescription" name="roleDescription"style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入角色说明" class="layui-input">';
				html+= '</div>';
				html+= '</div>';

				html+= '<div class="layui-form-item">';
				html+= '<label class="layui-form-label">权限：</label>';
				html+= '<div id="div_table" class="layui-form">';
				html+= '<table id="prvilegeTable" class="layui-table" lay-skin="line" style="width:500px; display: inline-block">';
				html += '<colgroup>';
				html += '<col width="150">';
				html += '<col width="350">';
				html += '</colgroup>';
				html+= '</table>';
				
				html+= '</div>';
				html+= '</div>';
			    html+= '</form>';
				layer.open({
					id: 'prvilege', //设定一个id，防止重复弹出
					type: 1,
					title: '添加角色',
					content: html,
					btn: ['确定', '取消'],
					area: ['750px', '550px'],
					yes: function(index, layero) {
						$("#form1").attr("action", JSConstant.getConstant('hosturl')+ JSConstant.getConstant('add_role_url'));
						var json = base.post($, JSConstant.getConstant('add_role_url'), $("#form1").serialize());
						var bool = base.isSucess(json);
						if(bool){
							layer.close(index);
							location.reload();
						}
						
					},
					
					shade :false,
					maxmin :true
				});
			    getPrvilege(true, null);
				initilData();	
		}
    };
	
	function getPrvilege(isAdd, param){

		var json = base.get($, JSConstant.getConstant('query_menuAll_url'), param);
		var ss = JSON.stringify(json);

		var bool = base.isSucess(json);		
		if(bool){
			var result = '';
			json = json.data;
			if(isAdd){
				userJson = null;
			}else{
				userJson = json.userList;
				;
			}
			json = json.allList;
			result = getMenus(json,  userJson,result);//获取所有的父菜单
			$('#prvilegeTable thead').html('');//blockquote
			$('#prvilegeTable tbody').html('');//blockquote
			$('#prvilegeTable').append(result);//往table添加tbody
			form.render('checkbox');//刷新复选框
		}
	 }
	//获取父菜单名称
	function getMenus(allJson,  userJson, result){
		$.each(allJson, function(index, menu){ 
			// result += '<table class="layui-table" lay-skin="line" style="width:600px;">';
			// result += '<colgroup>';
			// result += '<col width="160">';
			// result += '<col>';
			// result += '</colgroup>';
			result += '<thead >'; 
			result += '<tr">'; 
			result += '<th colspan="2" style="text-align:left;">';
			var isBool = false;
			$.each(userJson, function(index, userMenu){
				if(menu.permissionId == userMenu.permissionId){
					isBool = true;
					return false;
				}
			});
			if(isBool){
				result += '<input type="checkbox" name="" lay-skin="primary" lay-filter="parentMenu" checked="" value="'+menu.permissionId+'" title="'+menu.permissionName+'"/>';
			}else{
				result += '<input type="checkbox" name="" lay-skin="primary" lay-filter="parentMenu" value="'+menu.permissionId+'" title="'+menu.permissionName+'"/>';
			}
			result += '</th>'; 
		 
			result += '</tr> '; 
			result += '</thead>'; 	
			//var subMenu = menu.subAdminPermission;
			var subMenu = menu.subAdminPermission;
			result = getSubMenu(subMenu, userJson, result, menu.permissionId);
		});
		return result;
 }
 
	//获取子菜单名称
	function getSubMenu(subMenu, userJson, result, parentId){
		$.each( subMenu, function(index, sub){
			result += '<tbody>';
			result += "<tr>";
			var bool = isBool(sub.permissionId, userJson, 2);
			if(bool){
				result += '<td style="text-align:left;"><input type="checkbox" name="subMenu_'+parentId+'" lay-skin="primary" checked="" value="'+sub.permissionId+'" lay-filter="subMenu" title="'+sub.permissionName+'" ></td>';
			}else{
				result += '<td style="text-align:left;"><input type="checkbox" name="subMenu_'+parentId+'" lay-skin="primary"  value="'+sub.permissionId+'" lay-filter="subMenu" title="'+sub.permissionName+'" ></td>';
			}
			
			var buttons = sub.subAdminPermission;
			result += '<td style="text-align:left;width:350px;">'
			$.each(buttons, function(index, butt){	
				var isButton = isBool(butt.permissionId, userJson, 3);
				if(isButton){
					result += '<input type="checkbox" name="buttonMenu_'+parentId+'_'+sub.permissionId+'" lay-skin="primary" checked="" value="'+butt.permissionId+'" lay-filter="buttonMenu" title="'+butt.permissionName+'" >';
				}else{
					result += '<input type="checkbox" name="buttonMenu_'+parentId+'_'+sub.permissionId+'" lay-skin="primary"  value="'+butt.permissionId+'" lay-filter="buttonMenu" title="'+butt.permissionName+'" >';
				}
				
			});
			result += '</td>'
			result += "</tr>";
			result += '</tbody>';
		});
		return result;
	 }

	/*
	@permissionId:  需要比对的ID
	@userJson: 用户拥有的ID 
	@type 需要比对的节点，1父节点，2子节点，3按钮
	*/
	 function isBool(permissionId, userJson, type){
		var bool = false;
		if(type ==1 ){
			$.each(userJson, function(index, userMenu){
				if(menu.permissionId == userMenu.permissionId){
					bool = true;
					return false;
				}
			});	
		}else if(type ==2){
			var sub = false;
			$.each(userJson, function(index, userMenu){
				var userSubMenu = userMenu.subAdminPermission;
				if(sub){
					return false;
				}
				$.each(userSubMenu, function(index, userSubMenu){
					if(permissionId == userSubMenu.permissionId){
						bool = true;
						var sub = true;
						return false;
					}
				});
			});
		}else{
			var sub = false;
			var button = false;
			$.each(userJson, function(index, userMenu){
				var userSubMenu = userMenu.subAdminPermission;
				if(sub){
					return false;
				}
				$.each(userSubMenu, function(index, userSubMenu){
					if(button){
						sub = true;
						return false;
					}
					var userButtons = userSubMenu.subAdminPermission;
					$.each(userButtons, function(index, userButton){
						if(permissionId == userButton.permissionId){
							bool = true;
							button = true;
							return false;
						}
					});
				});
			});
		}
		
		return bool;
	 }
	function saveAddDel(bool, value){
	   var delId = [];//需删除
	   var addId = [];//需添加
	   if($("#delId").val().length >0){
		delId = $("#delId").val().split(",");
	   }
	   if($("#addId").val().length >0){
			addId = $("#addId").val().split(",");
	   }
	   
	  if(bool){//如果为选中，代表初始化是没有值，需要添加
		if(value.contains(delId)){//先判断删除里面是否存在，如果存在为删除
			delId.remove(value);
		}else{
			addId.push(value); 
		}
	}else{
		if(value.contains(addId)){//如果包含代表为添加则需移除
			addId.remove(value);
		}else{//为删除
			delId.push(value); 
		}
	}
	$("#delId").val(delId.join(","))
	$("#addId").val(addId.join(","))

	//alert("删除的Id" + del);
	//alert("新增的Id " + add);
   }
   
     //父菜单事件全选
  form.on('checkbox(parentMenu)', function(data){
	//获取索引
	var td = $(data.elem).parents('tr').find('td'); 
	var index = $(data.elem).parents('tr').parent().index();
	saveAddDel(data.elem.checked, data.elem.value);
	//全选
	// var row = parseInt(index/2);
	// var child = $(data.elem).parents('table').find('tbody:eq('+row+')  tr input[type="checkbox"]');
	// child.each(function(index, item){
		// item.checked = data.elem.checked;
    // });	
    //form.render('checkbox');
	
	var parentId = data.elem.value;
	var subMenus = document.getElementsByName("subMenu_"+parentId);
	for(var i=0;i<subMenus.length;i++){//子菜单
		if(!subMenus[i].checked && data.elem.checked){
			saveAddDel(true, subMenus[i].value);
		}
		if(subMenus[i].checked && !data.elem.checked){
			saveAddDel(false, subMenus[i].value);
		}
		subMenus[i].checked = data.elem.checked;

		var buttonMenus = document.getElementsByName("buttonMenu_"+parentId+"_"+subMenus[i].value);
		for(var j=0;j<buttonMenus.length;j++){//按钮
			if(!buttonMenus[j].checked && data.elem.checked){
				saveAddDel(true, buttonMenus[j].value);
			}
			if(buttonMenus[j].checked && !data.elem.checked){
				saveAddDel(false, buttonMenus[j].value);
			}
			buttonMenus[j].checked = data.elem.checked;
		}
	}
	form.render('checkbox');
  });
  
   //子菜单事件全选
 form.on('checkbox(subMenu)', function(data){
	saveAddDel(data.elem.checked, data.elem.value);
    var child = $(data.elem).parents('tr').find('td input[type="checkbox"]');
     child.each(function(index, item){
		 	if(!item.checked && data.elem.checked){
				saveAddDel(true, item.value);
			}

			if(item.checked && !data.elem.checked){
				saveAddDel(false, item.value);
			}
		item.checked = data.elem.checked;
     });
    

	 
	//获取索引
	var td = $(data.elem).parents('tr').find('td'); 
	var index = $(data.elem).parents('tr').parent().index();
	//选中父菜单
	 var menu = $(data.elem).parents('table').find('thead input[type="checkbox"]');
	 var row = parseInt(index/2)   -1;
	 if(!menu[row].checked){
		saveAddDel(true, menu[row].value);
		 menu[row].checked = "true";
	}
	
	form.render('checkbox');
  });
  
 //按钮事件
 form.on('checkbox(buttonMenu)', function(data){
  //alert(data.elem.checked);//是否选中
  //alert(data.elem.value);//获取值
    saveAddDel(data.elem.checked, data.elem.value);
	// if(data.elem.checked){
		// //选中子菜单
		// var child = $(data.elem).parents('tr').find('td input[type="checkbox"]');  
		// if(!child[0].checked){
			// child[0].checked = data.elem.checked;
			// saveAddDel(child[0].checked, child[0].value);
		// }
	 // }
	 
	 
	//选中子菜单
	var child = $(data.elem).parents('tr').find('td input[type="checkbox"]');  
	if(!child[0].checked){
		saveAddDel(true, child[0].value);
	}
	 child[0].checked = "true";
	 
	 //获取索引
	 var td = $(data.elem).parents('tr').find('td'); 
	 var index = $(data.elem).parents('tr').parent().index();	
	 //选中父菜单
	 var menu = $(data.elem).parents('table').find('thead input[type="checkbox"]');
	 var row = parseInt(index/2)   -1;
	
	 
	if(!menu[row].checked){
		saveAddDel(true, menu[row].value);
	}
	 menu[row].checked = "true";
	 form.render('checkbox');
	// var delId = $("#delId").val();
	// var addId = $("#addId").val();
	

	 // alert("需删除的"+ delId);
	 // alert("需新增的"+ addId);
  });

    exports('role', role);
});