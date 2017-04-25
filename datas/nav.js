 var navs=[];
 //获取子菜单名称
 var getSubMenu = function($, subMenu, result){
	var j = 1;
	$.each( subMenu, function(index, sub){
		var buttons = sub.subAdminPermission;
		var button ="";
		var b = 1;
		
		$.each(buttons, function(index, butt){
			if(b>1){
				button = button+"&"+ butt.permissionUrl+"="+true;
			}else{
				button = button+ butt.permissionUrl+"="+true;
			}
			b++;
		});
		if (button.length > 1) { 
			button = "?"+ button+"&permissionId="+ sub.permissionId;
		}else{
			button ="?permissionId="+ sub.permissionId
		}
	
		if(j >1){
			result = result + ',{'+
				'title:' +'"'+ sub.permissionName  +'"'+  
				',icon:' +'"'+"&#xe641;" +'"'+  
				',href:' +'"'+sub.permissionUrl +button  +'"'+ 
				'}';
		}else{
			result = result + '{'+
				'title:' +'"'+ sub.permissionName  +'"'+  
				',icon:' +'"'+"&#xe641;" +'"'+  
				',href:' +'"'+ sub.permissionUrl +button +'"'+  
		
				'}';
		}
		j++;
	});
	return result;
 }
 //获取父菜单名称
  var getMenus = function($, json,  result){
	var i = 1;
	var childEnd = ']';
	$.each(json, function(index, menu){ 
		if(i>1){
			result = result + ',{"title":' +'"'+ menu.permissionName +'"'+ 
			',"icon":' +'"' + "fa-cubes" +'"'+     
			',"spread":'+ false +',"children":'+ '[';
			var subMenu = menu.subAdminPermission;
			
			result = getSubMenu($, subMenu, result);
			result = result + childEnd +"}";
		}else{
			result = result + '{"title":' +'"'+ menu.permissionName +'"'+ 
			',"icon":' +'"' + "fa-cubes" +'"'+     
			',"spread":'+ true +',"children":'+ '[';
			var subMenu = menu.subAdminPermission;
			result = getSubMenu($, subMenu,  result);
			result = result + childEnd +"}";
		}
		i++;
	});
	return result;
 }
 
layui.use(['layer'], function(){
	$ = layui.jquery;	
	var roleId = localStorage.getItem("roleId");
	var parment = "roleId=" + roleId;	
	
	var json = base.get($, JSConstant.getConstant('index_url'), parment);
	var bool = base.isSucess(json);
	//var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象 
	if(bool){
		 var result = '';
		 json = json.data;
		 result = getMenus($, json,  result);
		 result = '[' + result + ']';
		 navs = eval('(' + result + ')'); 
	}
	
	 

});

