<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 角色菜单授权
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc; color:#ffffff;  font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>角色列表</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc;overflow-y:auto; "
                        >
                            <el-tree
                                ref="tree"
                                :data="data"
                                :default-expand-all="true"
                                :props="defaultPropsrole"
                                @node-click="handleNodeClick"
                                node-key="id"
                                :render-content="renderContent"
                            ></el-tree>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc;  color:#ffffff; font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>菜单信息</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc; overflow-y:auto;"
                        >
                            <el-tree
                                ref="treeMenu"
                                :data="menuData"
                                :props="defaultPropsrole"
                                node-key="id"
                                show-checkbox
                                :default-expanded-keys="idArr"
                                :render-content="renderContent"
                                :default-checked-keys="defaultKey"
                            ></el-tree>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <div
                            style="width:100%;  height:60px;  color:#ffffff; font-size: 18px; line-height: 60px;"
                        >
                            <div class="handle-box" style="float:right;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdicon-test43"
                                    @click="Save"
                                >保存</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>



<script>
import axios from 'axios';
import { log } from 'util';
import { showLoading, hideLoading } from '../../../../assets/js/loading';
export default {
    name: 'RolesMenuManagent',

    data() {
        return {
            menuData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            addOrEditVisible: false, //编辑对话框
            selectedIndex: -1, // 用于存放被选中行的index
            selectedRow: {}, // 用于存放被选中行
            data: [],
            defaultKey: [],
            rolesTemp: '',
            rolesTempName: '',
            rolesTempNumber: '',
            idArr: [],
            // 数据默认字段
            defaultProps: {
                parent: 'parentId', // 父级唯一标识
                value: 'id', // 唯一标识
                label: 'label', // 标签显示
                children: 'children', // 子级
                icon: 'icon'
            },
            defaultPropsrole: {
                children: 'children',
                label: 'label',
                icon: 'icon'
            }
        };
    },
    mounted: function () {},
    created() {
        this.getTreeData();
        this.getTreeDataMenu();
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <i class={data.icon}></i>
                    <span> {node.label}</span>
                </span>
            );
        },
        handleNodeClick(data) {
            let params = new URLSearchParams();
            this.rolesTemp = data.id;
            this.rolesTempName = data.name;
            this.rolesTempNumber = data.number;
            params.append('strWhere', " RoleID='" + data.id + "'");
            axios.post(BaseWebApiUrl + '/SysRoleMenu/GetSetMenuList', params).then((res) => {
                let newArr = [];
                if (res.data.returnCode == '1') {
                    let arrayItem = res.data.returnData.split('|');
                    if (arrayItem.length > 0) {
                        for (var i = 0; i < arrayItem.length; i++) {
                            if (arrayItem[i] + '' != '') newArr.push(arrayItem[i]);
                        }
                    }
                    this.$refs.treeMenu.setCheckedKeys([]);

                    this.defaultKey = newArr;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        Save() {
            if (this.rolesTemp == '' || this.rolesTemp == undefined) {
                this.$message.error('请选择要授权的角色');
                return;
            }
            //var dd=   this.$refs.data.getCheckedNodes(true);
            var treeMenuList = this.$refs.treeMenu.getCheckedNodes();

            let params = new URLSearchParams();

            var tableDataTemp = [];
            var treeMenuListlog = '';
            for (var i = 0; i < treeMenuList.length; i++) {
                let jsonData = {
                    RoleId: this.rolesTemp,
                    MenuID: treeMenuList[i].id,
                    CreateUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date()
                };
                treeMenuListlog = treeMenuListlog + treeMenuList[i].name + '|';
                tableDataTemp.push(jsonData);
            }
            params.append('RoleId', this.rolesTemp);
            params.append('json', JSON.stringify(tableDataTemp));

            let json = JSON.stringify({
                IPAdd: localStorage.getItem('IPAdd'),
                HostName: localStorage.getItem('HostName'),
                MenuName: '角色菜单授权',
                ObjectName: 'SetRoleMenu',
                CreateUser: localStorage.getItem('ms_username'),
                Operation: '〔授权〕角色：' + this.rolesTempNumber + '-' + this.rolesTempName + ' - 菜单权限' + treeMenuListlog
            });
            params.append('Logjson', json);
            showLoading();
            axios.post(BaseWebApiUrl + '/SysRoleMenu/SetRoleMenu', params).then((res) => {
                 hideLoading();
                if (res.data.returnCode == '1') {
                    this.$message.success('授权成功');
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },

        toTree(data, ck) {
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });

            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            var map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });
            //console.log(map);
            var val = [];
            data.forEach(function (item) {
                // 以当前遍历项，的pid,去map对象中找到索引的id
                item.label = item.name;
                if (ck == 1) {
                    if (item.pId == '00000000-0000-0000-0000-000000000000') item.icon = 'el-icon-thirdwenjianjia';
                    else item.icon = 'el-icon-thirdwenjianjia1';
                } else {
                    if (item.isParent == 'true' || item.isParent) item.icon = 'el-icon-thirdwenjianjia';
                    else item.icon = 'el-icon-thirdwenjianjia1';
                }
                var parent = map[item.pId];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级

                    val.push(item);
                }
            });
            return val;
        },
        getTreeData() {
            let params = new URLSearchParams();
            params.append('strWhere', ' 1=1');
            axios.post(BaseWebApiUrl + '/SysRoles/QuerySysRolesTreeList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let dataTree = JSON.parse(res.data.returnData);
                    this.data = this.toTree(dataTree, 1);
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        getTreeDataMenu() {
            let params = new URLSearchParams();
            params.append('strWhere', ' Visible=1');
            axios.post(BaseWebApiUrl + '/Menu/GetMenuJson', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let dataTree = JSON.parse(res.data.returnData);

                    this.menuData = this.toTree(dataTree, 2);
                    this.menuData.forEach((m) => {
                        if (m.open == 'true') {
                            this.idArr.push(m.id);
                        }
                    });
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 140px;
}

.sel {
    float: left;
    margin-top: 2px;
}

.sel .el-input {
    margin-right: 10px;
}
</style>
