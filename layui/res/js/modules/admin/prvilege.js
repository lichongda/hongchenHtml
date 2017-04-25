/*

@Name：卷土红尘
@Author：Absolutely 
@Site：http://www.lyblogs.cn
*/
layui.define(['laypage', 'layer', 'form', 'pagesize'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form();
        //laypage = layui.laypage;
		//var laypageId = 'pageNav';
   
	init();
	function init(){
		var msg = asyn.get($, JSConstant.getConstant('query_menuAll_url'), msg);
		var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象 
		var userJson;
		if(json.code == 0){
			var result = '';
			//location.href='index.html';
			json = json.data;
			userJson = json.userList;
			json = json.allList;
			//$('tbody').html('');//清空tbody
			//$('table').append(result);//往table添加tbody
			
			result = getMenus(json,  userJson,result);//获取所有的父菜单
			$('thead').html('');//blockquote
			$('tbody').html('');//blockquote
			$('table').append(result);//往table添加tbody
			//$('tbody').html('');//blockquote
			//$('thead').html('');//blockquote
			form.render('checkbox');//刷新复选框
			
		
		}else{
			alert(json.error);
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
			result += '<thead>'; 
			result += '<tr>'; 
			result += '<th>';
			var bool = false;
			$.each(userJson, function(index, userMenu){
				if(menu.permissionId == userMenu.permissionId){
					bool = true;
					return false;
				}
			});
			if(bool){
				result += '<input type="checkbox" name="" lay-skin="primary" lay-filter="parentMenu" checked="" value="'+menu.permissionId+'" title="'+menu.permissionName+'"/>';
			}else{
				result += '<input type="checkbox" name="" lay-skin="primary" lay-filter="parentMenu" value="'+menu.permissionId+'" title="'+menu.permissionName+'"/>';
			}
			result += '</th>'; 
			result += '<th></th>'; 
			result += '</tr> '; 
			result += '</thead>'; 	
			var subMenu = menu.subAdminPermission;
			result = getSubMenu(subMenu, userJson, result);
		});
		return result;
 }
 
//获取子菜单名称
function getSubMenu(subMenu, userJson, result){
	$.each( subMenu, function(index, sub){
		result += '<tbody>';
		result += "<tr>";
		var bool = isBool(sub.permissionId, userJson, 2);
		if(bool){
			result += '<td><input type="checkbox" name="like1[write]" lay-skin="primary" checked="" value="'+sub.permissionId+'" lay-filter="subMenu" title="'+sub.permissionName+'" ></td>';
		}else{
			result += '<td><input type="checkbox" name="like1[write]" lay-skin="primary"  value="'+sub.permissionId+'" lay-filter="subMenu" title="'+sub.permissionName+'" ></td>';
		}
		
		var buttons = sub.subAdminPermission;
		result += '<td>'
		$.each(buttons, function(index, butt){	
			var isButton = isBool(butt.permissionId, userJson, 3);
			if(isButton){
				result += '<input type="checkbox" name="like1[write]" lay-skin="primary"  checked="" value="'+butt.permissionId+'" lay-filter="buttonMenu" title="'+butt.permissionName+'" >';
			}else{
				result += '<input type="checkbox" name="like1[write]" lay-skin="primary"  value="'+butt.permissionId+'" lay-filter="buttonMenu" title="'+butt.permissionName+'" >';
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
	 
	
	 
    //输出接口，主要是两个函数，一个删除一个编辑
    var prvilege = {
        deleteData: function (id) {
			var param = "id=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                layer.msg('删除Id为【' + id + '】的数据111');
				var json = asyn.get($, JSConstant.getConstant('del_log_url'), param);
				isSucess(json);
            }, function () {
				layer.msg('删除Id为【' + id + '】的数据2222');
            });
        },
        editData: function (id) {
            layer.msg('编辑Id为【' + id + '】的数据');
        },
		addPrvilege: function(){
			
			alert(12345);
			
		}
    };
	
	
   //父菜单事件全选
  form.on('checkbox(parentMenu)', function(data){
	//获取索引
	var td = $(data.elem).parents('tr').find('td'); 
	var index = $(data.elem).parents('tr').parent().index();
	
	//全选
	// var row = parseInt(index/2);
	// var child = $(data.elem).parents('table').find('tbody:eq('+row+')  tr input[type="checkbox"]');
	// child.each(function(index, item){
		// item.checked = data.elem.checked;
    // });	
	
	
    form.render('checkbox');
  });
  
   //子菜单事件全选
  form.on('checkbox(subMenu)', function(data){
    // var child = $(data.elem).parents('tr').find('td input[type="checkbox"]');
    // child.each(function(index, item){
      // item.checked = data.elem.checked;
    // });
    // form.render('checkbox');
	

  });
  
   //按钮事件
  form.on('checkbox(buttonMenu)', function(data){
  //alert(data.elem.checked);//是否选中
  //alert(data.elem.value);//获取值
    saveAddDel(data.elem.checked, data.elem.value);
	if(data.elem.checked){
		//选中子菜单
		var child = $(data.elem).parents('tr').find('td input[type="checkbox"]');  
		
		if(!child[0].checked){
			child[0].checked = data.elem.checked;
			saveAddDel(child[0].checked, child[0].value);
		}
		
		//获取索引
		var td = $(data.elem).parents('tr').find('td'); 
		var index = $(data.elem).parents('tr').parent().index();	
		//选中父菜单
		// var menu = $(data.elem).parents('table').find('thead input[type="checkbox"]');
		// var row = index/2 -1;
		// menu[row].checked = data.elem.checked;
		form.render('checkbox');
	 }
   
  });

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

    exports('prvilege', prvilege);
});