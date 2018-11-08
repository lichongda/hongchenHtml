/**
 * Mr sheng.z
 * 18654141915@163.com
 */



layui.define(['laypage', 'layer', 'form', 'pagesize','table',], function (exports) {
    var $ = layui.jquery,
      table = layui.table,
      layer = layui.layer,
      laypage = layui.laypage;

    //分页参数设置
    var limitAllAppoint = 5;//每页显示数据条数
    var currentPageAllAppoint = 0;//当前页数

    initilData();
    function initilData() {
        var permissionId = base.getURLParameter("permissionId");
        var roleId = localStorage.getItem("roleId");
        var parment = "permissionId=" + permissionId + "&roleId=" + roleId;
        var json = base.get($, JSConstant.getConstant('query_adminPermissionButton_url'), parment);
        var bool = base.isSucess(json);
        if (bool) {
            //初始化按钮权限
            initButton(json);
            //初始化用户列表
            getList();
        }
    }

   function getList() {
        var   userName =$("#userName").val();
        var parment1="current="+currentPageAllAppoint+"&size="+limitAllAppoint+"&userName="+userName;
        //初始化用户列表
        var resultJson = base.get($, JSConstant.getConstant('query_adminUserList_url'), parment1);
        bool = base.isSucess(resultJson);
        if (bool) {
            //渲染表格
            initTable(resultJson);
            //渲染分页
             toPage('page',resultJson.data.page.total);
        }
    }


    /**
     * 公共分页方法
     * @param pageId
     * @param dataLength
     */
    function  toPage(pageId, dataLength) {
        laypage.render({
            elem: pageId
            , count: dataLength
            , curr: currentPageAllAppoint
            , limit: limitAllAppoint
            , limits: [5, 10, 15, 20, 25]
            , layout: ['prev', 'page', 'next', 'skip', 'count', 'limit']
            , jump: function (obj, first) {
                if (!first) {
                    currentPageAllAppoint = obj.curr;
                    limitAllAppoint = obj.limit;
                    if (!first) {
                        layui.use('user', function (user) {
                           getList();//一定要把翻页的ajax请求放到这里，不然会请求两次。
                        })


                    }
                }
            }
        })
    }


    /**
     * 初始化table数据
     * @param resultJson
     */
    function initTable(resultJson) {
        console.log(resultJson.data.list);
        console.log(resultJson.data.page.total);
        table.render({
            elem: '#userTable',
            data: resultJson.data.list,  //表格数据
            page: false,
            limit:resultJson.data.page.total,  //要显示的数量
            cols: [[ //标题栏
                {type: 'radio'} //默认全选
                , {type: 'numbers', title: '序号'}
                , {field: 'userId', title: '用户ID'}
                , {field: 'userName', title: '用户名'}
                , {field: 'nickName', title: '昵称'}
                , {field: 'userStatus', title: '用户状态'}
                , {field: 'rolesName', title: '角色'}
                , {field: 'createTime', title: '创建时间'}
            ]]

        })
    }

    /**
     * 控制按钮权限
     * @param jsonObj
     */
    function initButton(jsonObj) {
        var roleButton = jsonObj.data;
        $.each(roleButton, function (index, buttons) {
            buttons.permissionUrl + "=" + true;
            if (buttons.permissionUrl == "del") {
                $("#addUser").css("display", "inline-block");
            }

            if (buttons.permissionUrl == "edit") {
                $("#updateUser").css("display", "inline-block");
            }

            if (buttons.permissionUrl == "add") {
                $("#deleteUser").css("display", "inline-block");
            }

        });

    }


    //输出接口
    var user = {
        deleteUser: function (id) {
            var param = "usersId=" + id;
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function (index, layero) {
                var json = base.get($, JSConstant.getConstant('del_adminUser_url'), param);
                var bool = base.isSucess(json);
                if (bool) {
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
            if (bool) {
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
                yes: function (index, layero) {
                    var msg = base.post($, JSConstant.getConstant('update_adminUser_url'), $("#form1").serialize());
                    var bool = base.isSucess(msg);
                    if (bool) {
                        alert("操作成功");
                        layer.close(index);
                        location.reload();
                    }

                },
                shade: false,
                maxmin: true
            });
            form.render('checkbox');//刷新复选框
        },
        addUser: function () {
            var json = base.get($, JSConstant.getConstant('query_roleAll_url'), "");
            //var json = $.parseJSON( msg ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象
            var bool = base.isSucess(json);
            var result = '';
            if (bool) {
                json = json.data;
            } else {
                return;
            }
            var html = htmlUser(json, 1, "");
            layer.open({
                id: 'user', //设定一个id，防止重复弹出
                type: 1,
                title: '添加用户',
                content: html,
                btn: ['确定', '取消'],
                area: ['750px', '550px'],
                yes: function (index, layero) {
                    var msg = base.post($, JSConstant.getConstant('add_adminUser_url'), $("#form1").serialize());
                    bool = base.isSucess(msg);
                    if (bool) {
                        layer.close(index);
                        location.reload();
                    }
                },
                shade: false,
                maxmin: true
            });
            form.render('checkbox');//刷新复选框
        },
        searchUser: function () {
           getList();
        }
    };

    function htmlUser(jsonObj, type, roleIds) {//type =1 新增 type =2 修改
        var jsonUser;
        if (type == 2) {
            jsonUser = jsonObj.adminUser;
            jsonObj = jsonObj.adminRoleList;
        }

        var html = '<form  id="form1" class="layui-form" action="">';
        html += '<div class="layui-form-item">';
        html += '<input type="hidden" id="addId" value="" name="addId"/>';
        html += '</div>';
        html += '<div class="layui-form-item">';
        html += '<label class="layui-form-label">用户名：</label>';
        html += '<div class="layui-input-block">';
        if (type == 2) {
            html += '<input type="hidden" id="originalRoleId" value="' + roleIds + '" name="originalRoleId"/>';
            html += '<input type="hidden" id="originalUserName" value="' + jsonUser.userName + '" name="originalUserName"/>';
            html += '<input type="hidden" id="usersId" name="usersId" style="width:500px; display: inline-block" value="' + jsonUser.userId + '"  class="layui-input">';
            html += '<input type="text" id="userName" name="userName" style="width:500px; display: inline-block" value="' + jsonUser.userName + '" readonly="readonly" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
        } else {
            html += '<input type="text" id="userName" name="userName" style="width:500px; display: inline-block"  lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
        }
        html += '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item">';
        html += '<label class="layui-form-label">昵称：</label>';
        html += '<div class="layui-input-block">';
        if (type == 2) {
            html += '<input type="text" id="nickName" name="nickName" style="width:500px; display: inline-block" value="' + jsonUser.nickName + '" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
        } else {
            html += '<input type="text" id="nickName" name="nickName" style="width:500px; display: inline-block"  lay-verify="title" autocomplete="off" placeholder="请输入昵称" class="layui-input">';
        }
        html += '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
        html += '</div>';
        html += '</div>';

        html += '<div class="layui-form-item">';
        html += '<label class="layui-form-label">密码：</label>';
        html += '<div class="layui-input-block">';
        if (type == 2) {
            html += '<input type="text" id="userPassword" name="userPassword" style="width:500px; display: inline-block" value="' + jsonUser.userPassword + '" lay-verify="title" required  autocomplete="off" placeholder="请输入用户名称" class="layui-input">';
        } else {
            html += '<input type="password" id="userPassword" name="userPassword" style="width:500px; display: inline-block"  lay-verify="pass" autocomplete="off" placeholder="请输入密码" class="layui-input">';
        }
        html += '<font color="#AF0000">&nbsp;&nbsp;&nbsp;&nbsp;(必填*)</font>';
        html += '</div>';

        html += '</div>';

        html += '<div class="layui-form-item">';
        html += '<label class="layui-form-label">角色：</label>';
        html += '<div id="div_table" class="layui-form">';

        html += '<div class="layui-input-block">';
        $.each(jsonObj, function (index, role) {
            if (type == 2) {
                if (role.roleId == roleIds) {
                    html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu" checked=""  value="' + role.roleId + '" title="' + role.roleName + '"/>';
                } else {
                    html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu"  value="' + role.roleId + '" title="' + role.roleName + '"/>';
                }
            } else {
                html += '<input type="checkbox" name="roleId" lay-skin="primary" lay-filter="roleMenu"  value="' + role.roleId + '" title="' + role.roleName + '"/>';
            }

        });

        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</form>';
        return html;
    }




    exports('user', user);
});