<template>
  <div>
      <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 人员账号管理
                </el-breadcrumb-item>
            </el-breadcrumb>
      </div>
      <div class="container">
          <div class="handle-box">
                <div class="sel">
                    <selectTreeDept ref="selectTreeDept" v-model="query.DeptQuery"  width="130" :props="defaultProps" placeholder="--所属部门--"></selectTreeDept>
                    <el-select v-model="query.PersonState" placeholder="--人员状态--" class="handle-select mr10">
                        <el-option key="1" label="在用" value="False"></el-option>
                        <el-option key="2" label="停用" value="True"></el-option>
                    </el-select>
                </div>
                <el-input v-model="query.PersonID" placeholder="--人员编码--" class="handle-input mr10"></el-input>
                <el-input v-model="query.PersonNames" placeholder="--人员姓名--" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-thirdbtn-search" @click="handleSearch">查询</el-button>
                <el-button type="primary" icon="el-icon-thirdbtn-refresh" @click="handleReset">重置</el-button>
            </div>
            <div class="handle-box" style="float:right;">
                <el-button type="primary" icon="el-icon-thirdiconfontunie042" @click="handleAdd">添加</el-button>
                <el-button type="primary" icon="el-icon-thirdbtnEdit" @click="handleEdit">编辑</el-button>
                <el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDelete">删除</el-button>
                <!--<el-button type="primary" icon="el-icon-lx-delete" @click="handleDelete">删除</el-button>-->
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                :row-class-name="tableRowClassName"
                @row-click = "onRowClick"
            >
                <el-table-column prop="PersonID" v-if=false label="PersonID" width="55" align="center"></el-table-column>
                <el-table-column prop="ImageUrl" v-if=false label="人员照片"></el-table-column>
                <el-table-column prop="DeptID" v-if=false label="所属部门ID"></el-table-column>
                <el-table-column prop="PersonCode" label="人员编码"></el-table-column>
                <el-table-column prop="PersonName" label="用户名"></el-table-column>
                <el-table-column prop="DeptName" label="所属部门"></el-table-column>
                <el-table-column prop="PersonPhone" label="电话号码"></el-table-column>
                <el-table-column prop="PersonEmail" label="电子邮箱"></el-table-column>
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
                <el-table-column label="允许登录" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.LoginTrueValue==='允许'?'success':(scope.row.LoginTrueValue==='禁止'?'danger':'')"
                            >{{scope.row.LoginTrueValue}}</el-tag>
                        <!--<el-tag
                                :type="scope.row.LoginTrueValue=== 1 ?'success':(scope.row.LoginTrueValue=== 0 ?'danger':'')"
                            ><span v-if="scope.row.LoginTrueValue == 1">允许</span><span v-else>禁止</span></el-tag>-->
                    </template>
                </el-table-column>
                <el-table-column label="移动端权限" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.MobileLogin==='允许'?'success':(scope.row.MobileLogin==='禁止'?'danger':'')"
                            >{{scope.row.MobileLogin}}</el-tag>
                        <!--<el-tag
                                :type="scope.row.MobileLogin=== 1 ?'success':(scope.row.MobileLogin=== 0 ?'danger':'')"
                            ><span v-if="scope.row.MobileLogin == 1">允许</span><span v-else>禁止</span></el-tag>-->
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

      <!-- 编辑弹出框 -->
      <addOrEdit  ref="addOrEdit" :show.sync="addOrEditVisible"  @addNewDomain="createNewDomain" > </addOrEdit>
      

  </div>
</template>

<script>
import axios from 'axios';
import { log } from 'util';
import AddOrEdit from './PersonAccountManageEdit'
import SelectTreeDept from '../../publicAssembly/SelectTreeDept.vue';

export default {
    components: {
       addOrEdit:AddOrEdit,
       selectTreeDept:SelectTreeDept
    },
    name: 'basetable',
    data() {
        return {
            query: {
                DeptQuery:'',
                PersonState: '',
                PersonID:'',
                PersonNames: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            form: {
                PersonStatus:'在用',
                LoginTrueValue:'允许',
                MobileLogin:'允许'
            },
            idx: -1,
            id: -1,
            addOrEditVisible:false,//编辑对话框
            selectedIndex: -1,// 用于存放被选中行的index
            selectedRow:{},// 用于存放被选中行

            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'id',          // 唯一标识
                label: 'label',       // 标签显示
                children: 'children', // 子级
            }
        };
    },
  created() {
    this.getData('1=1');
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData(strWhere) {
        let params = new URLSearchParams();

        params.append("strWhere",strWhere)
        params.append("Rows",this.query.pageSize)
        params.append("CurrentPage",this.query.pageIndex)
        params.append("sidx",'PersonCode')
        params.append("sord",'desc')
             
        axios.post(BaseWebApiUrl+"/Person/QueryPersonList",  params).then((res) => {   
            if(res.data.returnCode=="1"){
                let json = JSON.parse(res.data.returnData);
                //console.log(JSON.parse(res.data.returnData));
                this.tableData = json.rows;
                this.pageTotal = json.records || this.query.pageSize
            }
            else  
            {
                this.$message.error(res.data.returnMsg);
            }
        });
    },

    //选中一行
    onRowClick(row, event, column,cell) {
        this.selectedRow = row
        this.selectedIndex = row.index

        this.$refs.multipleTable.toggleRowSelection(row);
    },
    tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
        let color = "myRowClassUn";

        if(this.selectedIndex == rowIndex)
            color = "myRowClass";

        return color;
    },
    // 触发搜索按钮
    handleSearch() {
        this.$set(this.query, 'pageIndex', 1);
        let strWhere = '1=1'

        if(this.query.DeptQuery != '')
            strWhere = strWhere + " and s.DeptID ='" + this.query.DeptQuery + "'"

        if(this.query.PersonState != '')
            strWhere = strWhere + " and T.PersonStatus ='" + this.query.PersonState + "'"

        if(this.query.PersonID != '')
           strWhere = strWhere + " and T.PersonCode Like N'%" + this.query.PersonID + "%'"

        if(this.query.PersonNames != '')
            strWhere = strWhere + " and T.personName Like N'%" + this.query.PersonNames + "%'"

        this.getData(strWhere);
    },
    //重置查询条件
    handleReset(){
        this.query.DeptQuery = ''
        this.query.PersonState = '';
        this.query.PersonID = '';
        this.query.PersonNames = '';

        this.$set(this.query, 'pageIndex', 1);
        this.getData('1=1');
    },
    // 分页导航
    handlePageChange(val) {
        this.$set(this.query, 'pageIndex', val);
        let strWhere = '1=1'
        if(this.query.DeptQuery != '')
        strWhere = strWhere + " and  s.DeptID ='" + this.query.DeptQuery + "'"

        if(this.query.PersonState != '')
            strWhere = strWhere + " and T.PersonStatus ='" + this.query.PersonState + "'"

        if(this.query.PersonID != '')
            strWhere = strWhere + " and T.PersonCode Like N'%" + this.query.PersonID + "%'"

        if(this.query.PersonNames != '')
            strWhere = strWhere + " and T.personName Like N'%" + this.query.PersonNames + "%'"

        this.getData(strWhere);
    },
    // 添加操作
    handleAdd() {
        this.addOrEditVisible = true
        this.form.PersonStatus = '在用'
        this.form.LoginTrueValue = '允许'
        this.form.MobileLogin = '允许'
        this.$refs.addOrEdit.addPerson(this.form);
    },
    //编辑操作
    handleEdit(){
        if(this.selectedIndex == -1)
            this.$message.warning('请选择要编辑的数据')
        else{
            this.addOrEditVisible = true
            this.$refs.addOrEdit.addPerson(this.selectedRow)
        }
    },
    //删除操作
    handleDelete()
    {
        if(this.selectedIndex==-1 ){
            this.$message.warning('请选择要删除的数据');
            return false;
         }


        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
            type: 'warning'
        })
            .then(() => {
                let params = new URLSearchParams();
                var strWhere = " PersonID in ('" + this.selectedRow.PersonID + "')";
                params.append('strDel', strWhere);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '人员账号管理',
                    ObjectName: 'DeletePerson',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔删除〕人员账号：' + this.selectedRow.PersonCode + "-" + this.selectedRow.PersonName
                });
                params.append('Logjson', json);
                    axios.post(BaseWebApiUrl + '/Person/DeletePerson', params).then((res) => {
                        if (res.data.returnCode == '1') {
                           this.$message.success('删除成功');
                           this.handleSearch()
                          
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
            .catch(() => {}
        );
    },
    createNewDomain(domainForm) {
        this.loading = true
        this.addOrEditVisible = false
        this.selectedIndex = -1
        this.selectedRow = {}
        if(domainForm.CreateDate == undefined)
            this.handleReset()
    },
    goBack(){
        this.$router.go(-1);
        }
  }
}
</script>

<style>
    .sel{
        float: left;
        margin-top: 2px;
    }

    .sel .el-input{
        margin-right: 10px;
    }
</style>
