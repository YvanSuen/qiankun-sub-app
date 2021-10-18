<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 系统参数配置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div
                            style="width:100%; background-color: #307ecc;height:60px; border:1px solid #307ecc; color:#ffffff;  font-size: 18px; line-height: 60px;"
                        >
                            &nbsp;
                            <b>参数列表</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc;overflow-y:auto; "
                        >
                            <el-tree
                                :data="data"
                                :default-expand-all="true"
                                :props="defaultProps"
                                @node-click="handleNodeClick"
                            ></el-tree>
                        </div>
                    </el-col>
                    <el-col :span="13">
                        <div
                            style="width:100%; background-color: #307ecc;height:60px; border:1px solid #307ecc;  color:#ffffff; font-size: 18px; line-height: 60px;"
                        >
                            &nbsp;
                            <b>参数信息</b>
                        </div>
                        <div style="width:100%;height:600px;border:1px solid #307ecc;">
                            <el-table
                                :data="tableData"
                                border
                                class="table"
                                ref="multipleTable"
                                @row-click="onRowClick"
                                header-cell-class-name="table-header"
                                :row-class-name="tableRowClassName"
                                :height="530"
                            >
                                <el-table-column
                                    prop="SettingNumber"
                                    label="参数编号"
                                    width="80"
                                    align="center"
                                ></el-table-column>

                                <el-table-column prop="SettingValue" label="参数名称"></el-table-column>
                                <el-table-column prop="SettingDefault" label="默认值"></el-table-column>
                                <el-table-column prop="SettingSort" label="排序号"></el-table-column>
                                <el-table-column prop="Remark" label="备注"></el-table-column>
                                <el-table-column prop="SettingRank" label="PK" v-if="false"></el-table-column>
                            </el-table>
                            <div class="pagination">
                                <el-pagination
                                    background
                                    layout="total, prev, pager, next"
                                    :current-page="query.pageIndex"
                                    :page-size="query.pageSize"
                                    :page-sizes="[1, 2, 5, 7]"
                                    :total="pageTotal"
                                    @current-change="handlePageChange"
                                ></el-pagination>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="23">
                        <div
                            style="width:100%;  height:60px;  color:#ffffff; font-size: 18px; line-height: 60px;"
                        >
                            <div class="handle-box" style="float:right; margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdbtnrestore"
                                    @click="delSetting"
                                >删除</el-button>
                            </div>
                            <div class="handle-box" style="float:right; margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdbtnEdit"
                                    @click="updateSetting"
                                >修改</el-button>
                            </div>
                            <div class="handle-box" style="float:right;margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdiconfontunie042"
                                    @click="addSetting"
                                >新增</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <el-dialog
            :visible.sync="editVisible"
            width="620px"
            @close="OnClose()"
            :close-on-click-modal="false"
        >
            <h2 class="headert">
                <i class="el-icon-lx-apps"></i>
                <span>添加/编辑参数信息</span>
            </h2>

            <div style="height:280px;  margin-top: 30px; margin-left: 50px;">
                <el-form ref="domainValidateForm" status-icon>
                    <el-form-item label="参数编号:" class="blue">
                        <el-input v-model="setting.SettingNumber" class="handle-input"></el-input>
                    </el-form-item>

                    <el-form-item label="参数名称:" class="blue">
                        <el-input v-model="setting.SettingValue" class="handle-input"></el-input>
                    </el-form-item>

                    <el-form-item label="是否默认:">
                        <el-switch
                            v-model="defaultValue"
                            active-text="Y"
                            inactive-text="N"
                            inactive-color="#BFBFBF"
                            active-value="1"
                            inactive-value="0"
                            class="switch"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item label="排序:" class="blue">
                        <label slot="label">排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序:</label>
                        <el-input-number
                            v-model="setting.SettingSort"
                            :min="1"
                            :max="10"
                            label="描述文字"
                        ></el-input-number>
                    </el-form-item>

                    <el-form-item label="备注说明:">
                        <el-input
                            type="textarea"
                            :rows="4"
                            v-model="setting.ReturnMessage"
                            style="width: 400px;"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="bottom">
                <el-button @click="OnClose">关闭</el-button>
                <el-button type="primary" @click="Save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>



<script>
import axios from 'axios';
import { showLoading, hideLoading } from '../../../../assets/js/loading';
export default {
    name: 'basetable',

    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                timeData: []
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,

            selectedIndex: -1, // 用于存放被选中行的index
            selectedRow: {}, // 用于存放被选中行
            data: [],
            setting: { SettingSort: 1, SettingNumber: '', SettingValue: '', SettingSort: '', Remark: '' },
            dataTemp: [],
            defaultValue:"0", //默认不是默认值
            editFlag: 1,//1 表示新增
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    mounted: function () {},
    created() {
        this.getTreeData();
    },
    methods: {
        handleNodeClick(data) {
            this.dataTemp = data;
            this.getData(data.SettingKey);
        },
        getTreeData() {
            let params = new URLSearchParams();
            params.append('strWhere', 'Visible=1');
            axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingTreeList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let dataTree = JSON.parse(res.data.returnData);
                    this.data = this.toTree(dataTree);
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
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
        // 获取 easy-mock 的模拟数据
        getData(keyValue) {
            let params = new URLSearchParams();

            if (this.query.timeData == null) {
                this.$message.info('时间条件必须输入');
                return;
            }

            params.append('SettingKey', keyValue);
            params.append('Rows', this.query.pageSize);
            params.append('CurrentPage', this.query.pageIndex);
            params.append('sidx', 'SettingNumber');
            params.append('sord', 'asc');
            axios.post(BaseWebApiUrl + '/SysSetting/GetSettingItemInfo', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.tableData = data.rows;
                    this.pageTotal = data.records;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        // 删除操作
        delSetting() {
            if (this.selectedIndex == -1) {
                this.$message.info('请选择要删除的数据');
                return false;
            }

            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = new URLSearchParams();

                    params.append('SettingRank', this.selectedRow.SettingRank);

                    let json = JSON.stringify({
                        IPAdd: localStorage.getItem('IPAdd'),
                        HostName: localStorage.getItem('HostName'),
                        MenuName: '系统参数配置',
                        ObjectName: 'DeleteSysSetting',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation:
                            '〔删除〕参数：' +
                            this.dataTemp.SettingName +
                            '-' +
                            this.selectedRow.SettingNumber +
                            '-' +
                            this.selectedRow.SettingValue
                    });
                    params.append('Logjson', json);
                    showLoading();
                    axios.post(BaseWebApiUrl + '/SysSetting/DeleteSysSetting', params).then((res) => {
                        hideLoading();
                        if (res.data.returnCode == '1') {
                            this.$message.success('删除成功');
                            this.getData(this.dataTemp.SettingKey);
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
                .catch(() => {});
        },
        updateSetting() {

             if (this.selectedIndex == -1) {
                this.$message.info('请选择要修改的数据');
                return false;
            }
               this.clear();
            this.setting.SettingNumber=  this.selectedRow.SettingNumber;
            this.setting.SettingValue=  this.selectedRow.SettingValue;
            this.defaultValue=  this.selectedRow.SettingDefault=='否' ? "0":"1";
            this.setting.SettingSort=  this.selectedRow.SettingSort;
            this.setting.ReturnMessage=this.selectedRow.Remark;
            this.editVisible = true;
            this.editFlag=0;
        },
        addSetting() {
            
            if (this.dataTemp.SettingKey == '' || this.dataTemp.SettingKey == undefined) {
                this.$message.error('选择要新增的节点');
                return;
            }
            this.clear();
            this.editVisible = true;
            this.editFlag=1;
        },
        clear(){
             this.setting.SettingNumber= '';
            this.setting.SettingValue= '';
            this.defaultValue=  "0";
            this.setting.SettingSort=  1;
            this.setting.ReturnMessage="";
        },
        Save() {
            if (this.setting.SettingNumber == '' || this.setting.SettingNumber == undefined) {
                this.$message.error('请输入参数编号');
                return;
            }
            if (this.setting.SettingValue == '' || this.setting.SettingValue == undefined) {
                this.$message.error('请输入参数名称');
                return;
            }
            if (this.editFlag == 1) {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    SettingKey: this.dataTemp.SettingKey,
                    SettingNumber: this.setting.SettingNumber,
                    SettingValue: this.setting.SettingValue,
                    SettingDefault: this.defaultValue == 1 ? true : false,
                    SettingSort: this.setting.SettingSort,
                    Remark: this.setting.Remark,
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date()
                });
                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: localStorage.getItem('IPAdd'),
                    HostName: localStorage.getItem('HostName'),
                    MenuName: '系统参数配置',
                    ObjectName: 'CreatSysNotice',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation:
                        '〔添加〕参数：' + this.dataTemp.SettingName + '-' + this.setting.SettingNumber + '-' + this.setting.SettingValue
                });
                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/SysSetting/SaveSysSettingItem', params).then((res) => {
                    hideLoading();
                    if (res.data.returnCode == '1') {
                        this.$message.success('保存成功');
                        this.getData(this.dataTemp.SettingKey);
                        this.editVisible = false;
                    } else {
                        this.$message.error(res.data.returnMsg);
                    }
                });
            }
            else{

                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    SettingKey: this.dataTemp.SettingKey,
                    SettingNumber: this.setting.SettingNumber,
                    SettingValue: this.setting.SettingValue,
                    SettingDefault: this.defaultValue == "1" ? true : false,
                    SettingSort: this.setting.SettingSort,
                    Remark: this.setting.Remark,
                    SettingRank:this.selectedRow.SettingRank,
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date()
                });
                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: localStorage.getItem('IPAdd'),
                    HostName: localStorage.getItem('HostName'),
                    MenuName: '系统参数配置',
                    ObjectName: 'CreatSysNotice',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation:
                        '〔编辑〕参数：' + this.dataTemp.SettingName + '-' + this.setting.SettingNumber + '-' + this.setting.SettingValue
                });
                params.append('Logjson', json);

                axios.post(BaseWebApiUrl + '/SysSetting/UPdateSysSettingItem', params).then((res) => {
                    if (res.data.returnCode == '1') {
                        this.$message.success('保存成功');
                        this.getData(this.dataTemp.SettingKey);
                        this.editVisible = false;
                    } else {
                        this.$message.error(res.data.returnMsg);
                    }
                });


            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        //选中一行
        onRowClick(row, event, column, cell) {
            this.selectedRow = row;
            this.selectedIndex = row.index;

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

.handle-input {
    width: 140px;
    display: inline-block;
    text-align: center;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.headert {
    height: 40px;
    margin-bottom: 5px;
    border-bottom: 1px solid #d5e3ef;
    font-size: 16px;
    color: #44bbbb;
}
.handle-input {
    width: 300px;
}
</style>
