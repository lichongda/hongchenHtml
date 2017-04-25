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
   
	initData();
	function initData(){
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
			var resultJson = base.get($, JSConstant.getConstant('query_quartzSchedulejobList_url'), parment);
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
		var json = base.get($, JSConstant.getConstant('query_quartzSchedulejobList_url'), parment);
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
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.scheduleJobName + "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.scheduleJobCronExpression+ "</td>";
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.scheduleJobClass + "</td>";
			html += "<td>" + json.scheduleJobMethod + "</td>";
			
			var isRun = false;
			if(json.quartzSchedulejobGroup!= null){
				html += "<td>" + json.quartzSchedulejobGroup.scheduleJobGroupName + "</td>";
				if(json.quartzSchedulejobGroup.status == 0 && json.status == 0){
					html += "<td><font color='#AF0000'>运行中</font></td>";
					isRun = true;
				}else{
					html += "<td><font color='#AF0000'>停止</font></td>";
				}
			}else{
				html += "<td>无</td>";
				if(json.status == 0){
					isRun = true;
					html += "<td><font color='#AF0000'>运行中</font></td>";
				}else{
					html += "<td><font color='#AF0000'>停止</font></td>";
				}
			}
			
		
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.scheduleJobDescription + "</td>";
			
			html += "<td style='word-wrap:break-word;word-break:break-all;'>" + json.createTime + "</td>";
			if(edit == "true"){//判断是否有修改按钮
				html += '<td><button id="editButton" class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.user.editUser(\'' + json.scheduleJobId + '\', \'' +roleId+  '\')"><i class="layui-icon">&#xe642;</i></button></td>';
			}else{
				//html += "<td></td>";
			}
			if(del == "true"){//判断是否有删按钮
				html += '<td><button id="delButton" class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.user.deleteUser(\'' + json.scheduleJobId + '\')"><i class="layui-icon">&#xe640;</i></button></td>';
			}else{
				//html += "<td></td>";
			}
			
			
			
			html += '<td style="text-align:left;">'
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartz.edit(\'' + json.scheduleJobId + '\')">修改</button>';
			html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartz.delete(\'' + json.scheduleJobId + '\')">删除</button>';
			
			if(isRun){
				html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartz.strop(\'' + json.scheduleJobId + '\')">停止</button>';
				
				html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartz.reboot(\'' + json.scheduleJobId + '\')">重启</button>';
			}else{
				html+='<button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.quartz.start(\'' + json.scheduleJobId + '\')">运行</button>';
			}
			
			html += '</td>'
			
			html += "</tr>";
			html += '</tbody>';
		});
            
		return html;
	}
	
    //输出接口，主要是两个函数，一个删除一个编辑
    var quartz = {
        delete: function (id) {
			var param = "scheduleJobId=" + id; 
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
				var json = base.get($, JSConstant.getConstant('del_quartzSchedulejob_url'), param);
				var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
			});
        },
        edit: function (scheduleJobId, roleId) {
			var parment = "scheduleJobId=" + scheduleJobId;
			var json = base.get($, JSConstant.getConstant('query_quartzSchedulejob_url'), parment);
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
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

					var msg = base.post($, JSConstant.getConstant('edit_quartzSchedulejob_url'), $("#form1").serialize());
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
			var json = base.get($, JSConstant.getConstant('query_quartzSchedulejobGroupAll_url'), "");
			var bool = base.isSucess(json);
			if(bool){
				var result = '';
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
					var bool = checkForm();
					if(!bool){
						return;
					}
					var msg = base.post($, JSConstant.getConstant('add_quartzSchedulejob_url'), $("#form1").serialize());
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
        start: function(id){
            var param = "scheduleJobId=" + id;
            layer.confirm('确定要启动任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('start_quartzSchedulejob_url'), param);
                var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
		},
		strop: function(id){
            var param = "scheduleJobId=" + id;
            layer.confirm('确定要停止任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('stop_quartzSchedulejob_url'), param);
                var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
		},
        reboot: function(id){
            var param = "scheduleJobId=" + id;
            layer.confirm('确定要重置任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('reboot_quartzSchedulejob_url'), param);
                 var bool = base.isSucess(json);
				if(bool){
					alert("操作成功");
					layer.close(index);
					location.reload();
				}
            });
        },
        async: function(){
            var param = "";
            layer.confirm('确定要同步任务？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('async_quartzSchedulejob_url'), param);
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
		var jobInfo;
		if(type == 2){
			jobInfo = jsonObj.jobInfo;
			jsonObj = jsonObj.jobGroup;
			
		}
		var html = '<form  id="form1" class="layui-form" action="">';
		html+= '<div class="layui-form-item">';
		html+= '<input type="hidden" id="addId" value="" name="addId"/>';
		html+= '</div>';
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">定时器名称：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="hidden" id="originalUserName" value="'+jobInfo.scheduleJobName+'" name="originalUserName"/>';
			html+= '<input type="hidden" id="scheduleJobId" name="scheduleJobId" style="width:500px;" value="'+jobInfo.scheduleJobId+'"  class="layui-input">';
			html+= '<input type="text" id="scheduleJobName" name="scheduleJobName" style="width:500px; display: inline-block" value="'+jobInfo.scheduleJobName+'"  lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
	}else{
			html+= '<input type="text" id="scheduleJobName" name="scheduleJobName" style="width:500px; display: inline-block" lay-verify="title" required  autocomplete="off" placeholder="请输入名称" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">表达式：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="scheduleJobCronExpression" name="scheduleJobCronExpression" style="width:500px; display: inline-block" value="'+jobInfo.scheduleJobCronExpression+'" lay-verify="title" required  autocomplete="off" placeholder="请输任务表达式" class="layui-input">';
		}else{
			html+= '<input type="text" id="scheduleJobCronExpression" name="scheduleJobCronExpression" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输任务表达式" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">调用类：</label>';
		html+= '<div class="layui-input-block">';
		if(type == 2){
			html+= '<input type="text" id="scheduleJobClass" name="scheduleJobClass" style="width:500px; display: inline-block" value="'+jobInfo.scheduleJobClass+'" lay-verify="title" required  autocomplete="off" placeholder="请输入调用类" class="layui-input">';
		}else{
			html+= '<input type="text" id="scheduleJobClass" name="scheduleJobClass" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入调用类" class="layui-input">';
		}
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
		html+= '</div>';
		html+= '</div>';

        html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">执行方法：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="scheduleJobMethod" name="scheduleJobMethod" style="width:500px; display: inline-block" value="'+jobInfo.scheduleJobMethod+'" lay-verify="title" required  autocomplete="off" placeholder="请输入执行方法" class="layui-input">';
        }else{
            html+= '<input type="text" id="scheduleJobMethod" name="scheduleJobMethod" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off"  placeholder="请输入执行方法" class="layui-input">';
        }
		html+= '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
        html+= '</div>';
        html+= '</div>';
		
		
		html+= '<div class="layui-form-item">';
		html+= '<label class="layui-form-label" style="width:100px;">分组类型：</label>';
		html+= '<div class="layui-input-inline">';
		html+= ' <select id="scheduleJobGroupId" name="scheduleJobGroupId" lay-filter="selectParentId"  lay-verify="title">';
		html+= '<option value="-1">请选择</option>';
		$.each(jsonObj, function(index, json){
			if(type == 2 && jobInfo.scheduleJobGroupId == json.scheduleJobGroupId){
				html+= '<option selected  checked="" value="'+json.scheduleJobGroupId+'">'+json.scheduleJobGroupName+'</option>';
			}else{
				html+= '<option value="'+json.scheduleJobGroupId+'">'+json.scheduleJobGroupName+'</option>';
			}
		});
		html+= ' </select>';
		html+= '<font color="#AF0000">(必选*)</font>';
		html+= '</div>';
		html+= '</div>';
	
		
		

        html+= '<div class="layui-form-item">';
        html+= '<label class="layui-form-label" style="width:100px;">定时器描述：</label>';
        html+= '<div class="layui-input-block">';
        if(type == 2){
            html+= '<input type="text" id="scheduleJobDescription" name="scheduleJobDescription" style="width:500px; display: inline-block"  value="'+jobInfo.scheduleJobDescription+'" lay-verify="title" required  autocomplete="off"  class="layui-input">';
        }else{
            html+= '<input type="text" id="scheduleJobDescription" name="scheduleJobDescription" style="width:500px; display: inline-block" lay-verify="title" autocomplete="off" class="layui-input">';
        }
        html+= '</div>';
        html+= '</div>';


		html+= '</form>';
		return html;
	}

    exports('quartz', quartz);
});