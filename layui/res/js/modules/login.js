layui.use(['layer', 'form'], function() {
	var layer = layui.layer,
		$ = layui.jquery,
		form = layui.form;
		
		
		//base.hello('Worldffftsfsdgfds!'); //����Hello World!
		//base.ajax();
		
	form.on('submit(login)',function(data){
		var msg= "userName="+$('#userName').val() + "&userPassword="+$('#userPassword').val() 
		
		var json = base.get($, JSConstant.getConstant('login_url'), msg);
		//var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),���Խ�json�ַ���ת����json���� 
		var bool = base.isSucess(json);
		if(bool){
			var jsonUser = json.data;
			localStorage.setItem("userId", jsonUser.userId);
			localStorage.setItem("roleId", jsonUser.roleId);
			localStorage.setItem("tokenId", jsonUser.tokenId);
			location.href='index.html';
		}
		
		return false;
	});
});


