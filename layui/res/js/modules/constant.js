localStorage.userId;//用户ID
localStorage.roleId;//角色ID
localStorage.tokenId;//tokenId
var JSConstant = (function() {
var  hosturl3="http://localhost:8080/";//定义了一个常量
  
  
var constants = {//定义了两个常量
	//hosturl: "http://lichongda.tunnel.2bdata.com/", 		//主机名
	hosturl: "http://localhost:8080/",				 //主机名
	login_url: "login",              						  //登陆URL
	index_url: "index", 	             					  //首页数据

	query_log_url: "operatorLog/query",                   //查询log数据
	del_log_url: "operatorLog/del",                       //删除log数据

	query_roleAll_url:"role/query/adminRoleAll",          //查询所有的 角色
	query_role_url: "role/query/adminRole",               //查询角色列表数据
	add_role_url: "role/add/adminRole",                  //新增角色
	update_role_url: "role/update/adminRole",             //修改角色
	del_role_url: "role/del/adminRole",					//删除角色

	query_menuAll_url: "adminPermission/queryAdminPermission" ,   //查询所有的菜单资源数据
	add_adminUser_url:"admin/add/adminUser",                        //添加用户
	del_adminUser_url:"admin/del/adminUser",							   //修改用户信息
	update_adminUser_url:"admin/update/adminUser",							   //修改用户信息
	query_adminUserList_url:"admin/query/adminUser",                 //查询用户列表
	query_adminUseId_url:"admin/query/adminUserId" ,                   //查询用户数据
	
	query_adminPermissionList_url:"adminPermission/query/adminPermissionList",//查询菜单列表数据
	query_adminPermissionButton_url:"adminPermission/query/adminPermissionButton",      //查询按钮                                     //查询按钮
	query_parentPermission_url:"adminPermission/query/parentPermission",  //查询父菜单数据
    query_subPermission_url:"adminPermission/query/subPermission",        //查询子菜单数据
	query_permission_info_url:"adminPermission/query/queryPermissionInfo",  //查询子菜单详情
	add_adminPermission_url:"adminPermission/add/adminPermission",        //添加菜单
	edit_adminPermission_url:"adminPermission/edit/adminPermission",      //修改菜单
	del_adminPermission_url:"adminPermission/del/adminPermission"  ,         //删除菜单
	
	
	query_quartzSchedulejobList_url:"quartz/query/quartz/schedulejobList",  //查询定时任务列表
	query_quartzSchedulejob_url:"quartz/query/quartz/schedulejob",           //查询定时任务详情
    add_quartzSchedulejob_url:"quartz/add/quartz/schedulejob",              //新增定时任务
    edit_quartzSchedulejob_url:"quartz/edit/quartz/schedulejob",              //修改定时任务
    del_quartzSchedulejob_url:"quartz/del/quartz/schedulejob",              //删除定时任务
    start_quartzSchedulejob_url:"quartz/start/quartz/schedulejob",              //启动定时任务
    stop_quartzSchedulejob_url:"quartz/stop/quartz/schedulejob",              //停止定时任务
    reboot_quartzSchedulejob_url:"quartz/reboot/quartz/schedulejob",              //重启定时任务
    async_quartzSchedulejob_url:"quartz/async/quartz/schedulejob"  ,             //同步定时任务
	
	
	query_quartzSchedulejobGroupAll_url:"quartz/query/quartz/scheduleJobGroupAll",    //查询所有的定时分组列表
	query_quartzSchedulejobGroupList_url:"quartz/query/quartz/scheduleJobGroupList",     //查询定时任务分组列表
	query_quartzSchedulejobGroup_url:"quartz/query/quartz/scheduleJobGroup",            //查询定时任务分组详情
	add_quartzSchedulejobGroup_url:"quartz/add/quartz/schedulejobGroup",               //新增定时任务分组
	edit_quartzSchedulejobGroup_url:"quartz/edit/quartz/scheduleJobGroup",            //修改定时任务分组
	del_quartzSchedulejobGroup_url:"quartz/del/quartz/schedulejobGroup",                   //删除定时任务分组
	stop_quartzSchedulejobGroup_url:"quartz/stop/quartz/schedulejobGroup",                 //停止定时任务分组
	start_quartzSchedulejobGroup_url:"quartz/start/quartz/schedulejobGroup"                //启动定时任务分组	
   }
  
   var constant={};
  // 定义了一个静态方法 获取常量的方法
  constant.getHosturl=function() {
    return hosturl;
  }
  

  
   // 定义了一个静态方法 获取多个常量的方法
  constant.getConstant=function(name){//获取常量的方法
	
    return constants[name];
  }
  return constant;
})();// 后面的()表示：代码一载入就立即执行这个函数  




 
  