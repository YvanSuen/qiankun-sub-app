<template>
  <div>
      <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备台账管理
                </el-breadcrumb-item>
            </el-breadcrumb>
      </div>
      <div class="container">
          <div class="handle-box">
                <div class="sel">
                    <el-select v-model="query.WorkShop" placeholder="--所属车间--" class="handle-select mr10">
                        <el-option v-for="item in WorkShopOptions"
                            :label="item.AreaName"
                            :key="item.AreaCode"
                            :value="item.AreaCode">
                        </el-option>
                    </el-select>
                    <el-select v-model="query.Cell" placeholder="--所属产线--" class="handle-select mr10">
                        <el-option v-for="item in CellOptions"
                            :label="item.CellName"
                            :key="item.CellCode"
                            :value="item.CellCode">
                        </el-option>
                    </el-select>
                     <selectTreeCategory ref="selectTreeCategory" v-model="query.CategoryQuery"  width="130" :props="defaultProps" placeholder="--设备类型--"></selectTreeCategory>
                     <el-select v-model="query.DevStatus" placeholder="--设备状态--" class="handle-select mr10">
                        <el-option key="0" label="运行" value="0"></el-option>
                        <el-option key="1" label="调试" value="1"></el-option>
                        <el-option key="2" label="封存" value="2"></el-option>
                        <el-option key="3" label="借出" value="3"></el-option>
                        <el-option key="8" label="报废" value="8"></el-option>
                    </el-select>
                </div>
                <el-input v-model="query.DevCodeorName" placeholder="--编码|名称--" class="handle-input mr10"></el-input>
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
                <el-table-column prop="DevID" v-if=false label="DevID" width="55" align="center"></el-table-column>
                <el-table-column prop="ImageUrl" v-if=false label="人员照片"></el-table-column>
                <el-table-column prop="DeptID" v-if=false label="所属部门ID"></el-table-column>
                <el-table-column prop="DevCode" label="设备编码"></el-table-column>
                <el-table-column prop="DevName" label="设备名称" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a target="_blank" class="buttonText" @click="openParts(scope.row.DevID,'Check')" >{{scope.row.DevName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="DevModel" label="规格型号"></el-table-column>
                <el-table-column prop="CategoryName" label="设备类型"></el-table-column>
                <el-table-column prop="DevUom" label="单位"></el-table-column>
                <el-table-column prop="DevABC" label="关键设备"></el-table-column>
                <el-table-column prop="nPathName" label="安装位置" width="300"></el-table-column>
                <el-table-column prop="Remark" label="备注说明"></el-table-column>
                <el-table-column prop="DevStatus" label="设备状态">
                    <template scope="scope">
                        <span v-if="scope.row.DevStatus==0" style="color:#008000">运行</span>
                        <span v-else-if="scope.row.DevStatus==1" style="color:#999999">调试</span>
                        <span v-else-if="scope.row.DevStatus==2" style="color:#FF9900">封存</span>
                        <span v-else-if="scope.row.DevStatus==3" style="color:#54A0B8">借出</span>
                        <span v-else-if="scope.row.DevStatus==8" style="color:#FF0000">报废</span>
                        <span v-else></span>
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
import AddOrEdit from './DevEdit'
import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';

export default {
    components: {
       addOrEdit:AddOrEdit,
       selectTreeCategory:SelectTreeCategory
    },
    name: 'basetable',
    data() {
        return {
            query: {
                CategoryQuery:'',
                WorkShop: '',
                Cell:'',
                DevStatus:'',
                DevCodeorName: '',
                pageIndex: 1,
                pageSize: 10
            },
            WorkShopOptions:[],//所属车间
            CellOptions:[],//所属产线
            tableData: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            idx: -1,
            id: -1,
            addOrEditVisible:false,//编辑对话框
            selectedIndex: -1,// 用于存放被选中行的index
            selectedRow:{},// 用于存放被选中行
            obj:{},//设备信息
            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'number',          // 唯一标识
                label: 'label',       // 标签显示
                children: 'children', // 子级
            }
        };
    },
  created() {
    //所属车间
    this.getWorkShopList()
    //所属产线
    this.getCellList()
    //获取数据
    this.getData('1=1');
  },
  methods: {
    //所属车间
    getWorkShopList(){
        let params = new URLSearchParams();
        params.append("strWhere"," LayLevel=3")

        axios.post(BaseWebApiUrl+"/SysFactory/QueryFactoryCellDrowDownList",  params).then((res) => {  
            if(res.data.returnCode=="1"){
                this.WorkShopOptions = JSON.parse(res.data.returnData);
            }
            else  
            {
                this.$message.error(res.data.returnMsg);
            }
        });
    },
    //所属产线
    getCellList(){
        let params = new URLSearchParams();
        params.append("strWhere"," LayLevel=4")

        axios.post(BaseWebApiUrl+"/SysFactory/QueryFactoryCellDrowDownList",  params).then((res) => {  
            if(res.data.returnCode=="1"){
                this.CellOptions = JSON.parse(res.data.returnData);
            }
            else  
            {
                this.$message.error(res.data.returnMsg);
            }
        });
    },
    // 获取 easy-mock 的模拟数据
    getData(strWhere) {
        let params = new URLSearchParams();

        params.append("strWhere",strWhere)
        params.append("Rows",this.query.pageSize)
        params.append("CurrentPage",this.query.pageIndex)
        params.append("sidx",'Devname')
        params.append("sord",'desc')
             
        axios.post(EamWebApiUrl+"/EamDev/QueryDevList",  params).then((res) => {   
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
    //打开备件详情对话框
    openParts(DevID, type) {
        this.getDevInfo(DevID,type)
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

        if(this.query.WorkShop != '')
            strWhere = strWhere + " and A.AreaCode ='" + this.query.WorkShop + "'"

        if(this.query.Cell != '')
            strWhere = strWhere + " and A.CellCode ='" + this.query.Cell + "'"

        if(this.query.CategoryQuery != '')
            strWhere = strWhere + " and T.CategoryCode = N'" + this.query.CategoryQuery + "'"

        if(this.query.DevStatus != '')
           strWhere = strWhere + " and T.DevStatus = " + this.query.DevStatus

        if(this.query.DevCodeorName != '')
            strWhere = strWhere + " and concat(T.DevCode,T.DevName) Like N'%" + this.query.DevCodeorName + "%'"

        this.getData(strWhere);
    },
    //重置查询条件
    handleReset(){
        this.query.CategoryQuery = ''
        this.query.WorkShop =  ''
        this.query.Cell = ''
        this.query.DevStatus = '',
        this.query.DevCodeorName =  ''

        this.selectedIndex = -1

        this.$set(this.query, 'pageIndex', 1);
        this.getData('1=1');
    },
    // 分页导航
    handlePageChange(val) {
        this.$set(this.query, 'pageIndex', val);
        let strWhere = '1=1'

        if(this.query.WorkShop != '')
            strWhere = strWhere + " and A.AreaCode ='" + this.query.WorkShop + "'"

        if(this.query.Cell != '')
            strWhere = strWhere + " and A.CellCode ='" + this.query.Cell + "'"

        if(this.query.CategoryQuery != '')
            strWhere = strWhere + " and T.CategoryCode = N'" + this.query.CategoryQuery + "'"

        if(this.query.DevStatus != '')
           strWhere = strWhere + " and T.DevStatus = " + this.query.DevStatus

        if(this.query.DevCodeorName != '')
            strWhere = strWhere + " and concat(T.DevCode,T.DevName) Like N'%" + this.query.DevCodeorName + "%'"

        this.getData(strWhere);
    },
    // 添加操作
    handleAdd() {
        this.$refs.addOrEdit.addPerson({},"Add");
        this.addOrEditVisible = true
    },
    //编辑、查看操作
    handleEdit(){
        if(this.selectedIndex == -1)
            this.$message.warning('请选择要编辑的数据')
        else{
            this.getDevInfo(this.selectedRow.DevID,'Edit')
        }
    },
    //获取设备详细信息
    getDevInfo(DevID,type){
        let params = new URLSearchParams();
        params.append("strWhere","  DevID='" + DevID + "'")

        axios.post(EamWebApiUrl+"/EamDev/GetDataByID",  params).then((res) => {  
            if(res.data.returnCode=="1"){
                let model = res.data.returnData[0]
                this.obj.DevID = DevID
                this.obj.DevCode = model.DevCode
                this.obj.DevName = model.DevName
                this.obj.DevModel = model.DevModel
                this.obj.CategoryCode = model.CategoryCode
                this.obj.CategoryName = model.CategoryName
                this.obj.DevUom = model.DevUom
                this.obj.DevSize = model.DevSize
                this.obj.DevWeight = model.DevWeight
                this.obj.BarCode = model.BarCode
                this.obj.DevABC = model.DevABC
                this.obj.MadeCountry = model.MadeCountry
                this.obj.Manufacturer = model.Manufacturer
                this.obj.ProductionNo = model.ProductionNo
                this.obj.ProductionDate = model.ProductionDate === null ? '' : model.ProductionDate.substring(0, 10)
                this.obj.BuyDate = model.BuyDate === null ? '' : model.BuyDate.substring(0, 10)
                this.obj.BuyAmount = model.BuyAmount
                this.obj.WarrantyTime = model.WarrantyTime
                this.obj.AssetCode = model.AssetCode
                this.obj.DevStatus = "DevRunStatus:" + model.DevStatus
                this.obj.FactoryModelCode = model.FactoryModelCode
                this.obj.Remark = model.Remark
                this.obj.ImageUrl = model.ImageUrl

                this.$refs.addOrEdit.addPerson(this.obj,type)
                this.addOrEditVisible = true
            }
            else  
            {
                this.$message.error(res.data.returnMsg);
            }
        });       
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
                params.append('json',  "'" + this.selectedRow.DevID + "'");

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '设备台帐管理',
                    ObjectName: 'DeleteDev',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔删除〕设备台帐：' + this.selectedRow.DevCode + "-" + this.selectedRow.DevName
                });
                params.append('Logjson', json);
                    axios.post(EamWebApiUrl + '/EamDev/DeleteDev', params).then((res) => {
                        if (res.data.returnCode == '1') {
                           this.$message.success('删除成功');
                           this.handleReset()
                          
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

    .buttonText
    {
        color: #337ab7;
        text-decoration: none;
        cursor: pointer;  /*鼠标悬停变小手*/
    }
        
</style>
