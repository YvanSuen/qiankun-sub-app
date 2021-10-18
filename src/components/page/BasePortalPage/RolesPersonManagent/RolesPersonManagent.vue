<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 人员角色权限
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc; color:#ffffff;  font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>人员列表</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc;overflow-y:auto; "
                        >
                            <selectTreeDept
                                ref="selectTreeDept"
                                v-model="query.DeptQuery"
                                style="  margin-left: 10px;"
                                width="130"
                                :props="defaultProps"
                                placeholder="--所属部门--"
                            ></selectTreeDept>
                            <el-select
                                v-model="query.PersonState"
                                placeholder="--人员状态--"
                                class="handle-select mr10"
                                style="  margin-left: 10px;"
                            >
                                <el-option key="1" label="在用" value="False"></el-option>
                                <el-option key="2" label="停用" value="True"></el-option>
                            </el-select>

                            <el-input
                                v-model="query.PersonID"
                                placeholder="--人员编码--"
                                class="handle-input mr10"
                            ></el-input>
                            <el-input
                                v-model="query.PersonNames"
                                placeholder="--人员姓名--"
                                class="handle-input mr10"
                            ></el-input>
                            <el-button
                                type="primary"
                                icon="el-icon-thirdbtn-search"
                                @click="handleSearch"
                                style="  margin-top: 5px;  margin-bottom: 5px;"
                            >查询</el-button>
                            <el-button
                                type="primary"
                                icon="el-icon-thirdbtn-refresh"
                                @click="handleReset"
                                style="  margin-top: 5px; margin-bottom: 5px;"
                            >重置</el-button>
                            <el-table
                                :data="tableData"
                                border
                                class="table"
                                ref="multipleTable"
                                header-cell-class-name="table-header"
                                :row-class-name="tableRowClassName"
                                @row-click="onRowClick"
                                :height="490"
                            >
                                <el-table-column
                                    prop="PersonID"
                                    v-if="false"
                                    label="PersonID"
                                    width="55"
                                    align="center"
                                ></el-table-column>
                                <el-table-column prop="ImageUrl" v-if="false" label="人员照片"></el-table-column>
                                <el-table-column prop="DeptID" v-if="false" label="所属部门ID"></el-table-column>
                                <el-table-column prop="PersonCode" label="人员编码"></el-table-column>
                                <el-table-column prop="PersonName" label="用户名"></el-table-column>
                                <el-table-column prop="DeptName" label="所属部门"></el-table-column>
                                <el-table-column prop="PersonPhone" label="电话号码"></el-table-column>
                                <el-table-column prop="PersonEmail" label="电子邮箱" v-if="false"></el-table-column>
                                <el-table-column prop="PersonAdd" label="联系地址"></el-table-column>
                                <el-table-column prop="Remark" label="备注说明" width="300"></el-table-column>
                                <el-table-column label="人员状态" align="center">
                                    <template slot-scope="scope">
                                        <el-tag
                                            :type="scope.row.PersonStatus==='在用'?'success':(scope.row.PersonStatus==='停用'?'danger':'')"
                                        >{{scope.row.PersonStatus}}</el-tag>
                                        <!--<el-tag
                                :type="scope.row.PersonStatus=== 1 ?'success':(scope.row.PersonStatus=== 0 ?'danger':'')"
                                        ><span v-if="scope.row.PersonStatus == 1">在用</span><span v-else>停用</span></el-tag>-->
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="query.pageIndex"
                                    :page-size="query.pageSize"
                                    :total="pageTotal"
                                    @current-change="handlePageChange"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc;  color:#ffffff; font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>角色列表</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc; overflow-y:auto;"
                        >
                            <el-tree
                                ref="tree"
                                :data="data"
                                :default-expand-all="true"
                                :props="defaultPropsrole"
                                show-checkbox
                                @check-change="handleCheckChange"
                                @node-click="handleNodeClick"
                                node-key="id"
                                :default-checked-keys="defaultKey"
                                     :render-content="renderContent"
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

import SelectTreeDept from '../../publicAssembly/SelectTreeDept.vue';
import { showLoading, hideLoading } from '../../../../assets/js/loading';
export default {
    name: 'SysFactoryModelPerson',
    components: {
        selectTreeDept: SelectTreeDept
    },
    data() {
        return {
            query: {
                DeptQuery: '',
                PersonState: '',
                PersonID: '',
                PersonNames: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
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
            // 数据默认字段
            defaultProps: {
                parent: 'parentId', // 父级唯一标识
                value: 'id', // 唯一标识
                label: 'label', // 标签显示
                children: 'children' // 子级
            },
            defaultPropsrole: {
                children: 'children',
                label: 'label'
            }
        };
    },
    mounted: function () {},
    created() {
        this.getData('1=1');
        this.getTreeData();
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
        // 获取 easy-mock 的模拟数据
        getData(strWhere) {
            let params = new URLSearchParams();
            params.append('strWhere', strWhere);
            params.append('Rows', this.query.pageSize);
            params.append('CurrentPage', this.query.pageIndex);
            params.append('sidx', 'PersonCode');
            params.append('sord', 'desc');

            axios.post(BaseWebApiUrl + '/Person/QueryPersonList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let json = JSON.parse(res.data.returnData);
                    //console.log(JSON.parse(res.data.returnData));
                    this.tableData = json.rows;
                    this.pageTotal = json.records || this.query.pageSize;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            let strWhere = '1=1';

            if (this.query.DeptQuery != '') strWhere = strWhere + " and s.DeptID ='" + this.query.DeptQuery + "'";

            if (this.query.PersonState != '') strWhere = strWhere + " and T.PersonStatus ='" + this.query.PersonState + "'";

            if (this.query.PersonID != '') strWhere = strWhere + " and T.PersonCode Like N'%" + this.query.PersonID + "%'";

            if (this.query.PersonNames != '') strWhere = strWhere + " and T.personName Like N'%" + this.query.PersonNames + "%'";

            this.getData(strWhere);
        },
        //重置查询条件
        handleReset() {
            this.query.DeptQuery = '';
            this.query.PersonState = '';
            this.query.PersonID = '';
            this.query.PersonNames = '';

            this.$set(this.query, 'pageIndex', 1);
            this.getData('1=1');
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            let strWhere = '1=1';
            if (this.query.DeptQuery != '') strWhere = strWhere + " and  s.DeptID ='" + this.query.DeptQuery + "'";

            if (this.query.PersonState != '') strWhere = strWhere + " and T.PersonStatus ='" + this.query.PersonState + "'";

            if (this.query.PersonID != '') strWhere = strWhere + " and T.PersonCode Like N'%" + this.query.PersonID + "%'";

            if (this.query.PersonNames != '') strWhere = strWhere + " and T.personName Like N'%" + this.query.PersonNames + "%'";

            this.getData(strWhere);
        },
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
         handleNodeClick(data) {
            this.$set(this.query, 'pageIndex', 1);
             let strWhere = '1=1';
             strWhere = strWhere + " and T.PersonID in(SELECT PersonID FROM[dbo].[SysRolePerson] WHERE roleid = '" + data.id + "')";
             this.getData(strWhere);
        },
        clear() {
            this.setting.SettingNumber = '';
            this.setting.SettingValue = '';
            this.defaultValue = '0';
            this.setting.SettingSort = 1;
            this.setting.ReturnMessage = '';
        },
        Save() {
            if (this.selectedRow.PersonID == '' || this.selectedRow.PersonID == undefined) {
                this.$message.error('请选择要授权的人员');
                return;
            }
            //var dd=   this.$refs.data.getCheckedNodes(true);
            var Roleslist = this.$refs.tree.getCheckedNodes();

            let params = new URLSearchParams();

            var tableDataTemp = [];
            var Roleslistlog="";
            for (var i = 0; i < Roleslist.length; i++) {
             
                let jsonData = {
                    PersonID: this.selectedRow.PersonID,
                     RoleID: Roleslist[i].id,
                     CreateUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date()
                };
                Roleslistlog=Roleslistlog+Roleslist[i].name+"|";
                tableDataTemp.push(jsonData);
                
            }
            params.append('PersonID', this.selectedRow.PersonID);
            params.append('json', JSON.stringify(tableDataTemp));

            let json = JSON.stringify({
                IPAdd: localStorage.getItem('IPAdd'),
                HostName: localStorage.getItem('HostName'),
                MenuName: '角色菜单授权',
                ObjectName: 'SetPersonRole',
                CreateUser: localStorage.getItem('ms_username'),
                Operation: '〔授权〕人员：' + this.selectedRow.PersonCode + '-' + this.selectedRow.PersonName + ' - 角色权限'+Roleslistlog
            });
            params.append('Logjson', json);
                 showLoading();
            axios.post(BaseWebApiUrl + '/SysPersonRole/SetPersonRole', params).then((res) => {
                 hideLoading();
                if (res.data.returnCode == '1') {
                    this.$message.success('授权成功');
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },

        //选中一行
        onRowClick(row, event, column, cell) {
            this.selectedRow = row;
            this.selectedIndex = row.index;
            let params = new URLSearchParams();

            params.append('strWhere', " PersonID='" + this.selectedRow.PersonID + "'");
            axios.post(BaseWebApiUrl + '/SysPersonRole/GetSetPersonList', params).then((res) => {
                let newArr = [];
                if (res.data.returnCode == '1') {
                    let arrayItem = res.data.returnData.split('|');
                    if (arrayItem.length > 0) {
                        for (var i = 0; i < arrayItem.length; i++) {
                            if (arrayItem[i] + '' != '') newArr.push(arrayItem[i]);
                        }
                    }
                    this.$refs.tree.setCheckedKeys([]);

                    this.defaultKey = newArr;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
            // this.$refs.multipleTable.toggleRowSelection(row);
        },
        tableRowClassName({ row, rowIndex }) {
            //把每一行的索引放进row
            row.index = rowIndex;
            let color = 'myRowClassUn';
            if (this.selectedIndex == rowIndex) color = 'myRowClass';
            return color;
        },
        OnClose() {
            //this.NoticeForm = [];
            this.editVisible = false;
        },
        toTree(data) {
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
                 if(item.pId=="00000000-0000-0000-0000-000000000000")
                item.icon = 'el-icon-thirdwenjianjia';
                else
                 item.icon = 'el-icon-thirdwenjianjia1';
              
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
                    this.data = this.toTree(dataTree);
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
