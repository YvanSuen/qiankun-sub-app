<template>
  <div>
      <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 子级设备管理
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
                    <el-switch 
                        v-model="query.ParentStatus" 
                        active-text="Y" 
                        inactive-text="N" 
                        inactive-color="#BFBFBF" 
                        active-value="1" 
                        inactive-value="0"></el-switch>
                     <span style="font-size:14px;">已定义子级</span>
                </div>
                 
                <el-input v-model="query.DevCodeorName" placeholder="--编码|名称--" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-thirdbtn-search" @click="handleSearch">查询</el-button>
                <el-button type="primary" icon="el-icon-thirdbtn-refresh" @click="handleReset">重置</el-button>
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
                <el-table-column prop="CellCode" v-if=false label="所在产线"></el-table-column>
                <el-table-column prop="ImageUrl" v-if=false label="人员照片"></el-table-column>
                <el-table-column prop="DeptID" v-if=false label="所属部门ID"></el-table-column>
                <el-table-column prop="DevCode" label="设备编码"></el-table-column>
                <el-table-column prop="DevName" label="设备名称" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a target="_blank" class="buttonText" @click="openParts(scope.row.DevID,'Check')">{{scope.row.DevName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="DevModel" label="规格型号"></el-table-column>
                <el-table-column prop="CategoryName" label="设备类型"></el-table-column>
                <el-table-column prop="DevUom" label="单位"></el-table-column>
                <el-table-column prop="DevABC" label="关键设备"></el-table-column>
                <el-table-column prop="nPathName" label="安装位置" width="300"></el-table-column>
                <el-table-column prop="Remark" label="备注说明"></el-table-column>
                <el-table-column label="子级数量" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ChildSum == ''">0</span>
                        <span v-else>{{ scope.row.ChildSum }}</span>
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

            <!------------------------------------子grid------------------------------------------->
            <div class="handle-box" style="float:right;">
                <el-button type="primary" icon="el-icon-thirdiconfontunie042" @click="handleAdd">添加</el-button>
                <el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDelete">删除</el-button>
            </div>
            <el-table
                :data="tableDataChild"
                border
                class="table Child"
                ref="multipleTableChild"
                header-cell-class-name="table-header"
                :row-class-name="tableRowClassNameChild"
                @row-click = "onRowClickChild"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" prop="DevID" label="DevID" width="55" align="center"></el-table-column>
                <el-table-column prop="ImageUrl" v-if=false label="人员照片"></el-table-column>
                <el-table-column prop="DeptID" v-if=false label="所属部门ID"></el-table-column>
                <el-table-column prop="DevCode" label="设备编码"></el-table-column>
                <el-table-column prop="DevName" label="设备名称" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a target="_blank" class="buttonText" @click="openParts(scope.row.DevID,'Check')">{{scope.row.DevName}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="DevModel" label="规格型号"></el-table-column>
                <el-table-column prop="CategoryName" label="设备类型"></el-table-column>
                <el-table-column prop="DevUom" label="单位"></el-table-column>
                <el-table-column prop="DevABC" label="关键设备"></el-table-column>
                <el-table-column prop="nPathName" label="安装位置" width="300"></el-table-column>
                <el-table-column prop="Remark" label="备注说明"></el-table-column>
                <el-table-column label="子级数量" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ChildSum == ''">0</span>
                        <span v-else>{{ scope.row.ChildSum }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndexChild"
                    :page-size="query.pageSize"
                    :total="pageTotalChild"
                    @current-change="handlePageChangeChild"
                ></el-pagination>
            </div>
            
      </div>
      
      <!-- 查看弹出框 -->
      <ShowInfo  ref="showInfo" :show.sync="InfoVisible"> </ShowInfo>

      <!-- 编辑弹出框 -->
      <addOrEdit  ref="addOrEdit" :show.sync="addOrEditVisible"  @addNewDomain="createNewDomain" ></addOrEdit>

  </div>
</template>

<script>
import axios from 'axios';
import { log } from 'util';
import ShowInfo from '../Dev/DevEdit'
import AddOrEdit from './DevChildEdit'
import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';

export default {
    components: {
       ShowInfo:ShowInfo,
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
                ParentStatus:'',
                DevCodeorName: '',
                pageIndex: 1,
                pageSize: 5,
                pageIndexChild: 1
            },
            WorkShopOptions:[],//所属车间
            CellOptions:[],//所属产线
            tableData: [],
            tableDataChild: [],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            pageTotalChild: 0,
            idx: -1,
            id: -1,
            InfoVisible:false,//查看对话框
            addOrEditVisible:false,//编辑对话框
            selectedIndex: -1,// 用于存放被选中行的index
            selectedRow:{},// 用于存放被选中行
            selectedRowChild:{},// 用于存放被选中行
            obj:{},//设备信息
            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'number',      // 唯一标识
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
        params.append("sidx",'t.DevCode')
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
    getDataChild(strWhere){
        let params = new URLSearchParams();

        params.append("strWhere",strWhere)
        params.append("Rows",this.query.pageSize)
        params.append("CurrentPage",this.query.pageIndexChild)
        params.append("sidx",'t.DevCode')
        params.append("sord",'desc')
             
        axios.post(EamWebApiUrl+"/EamDev/QueryDevList",  params).then((res) => {   
            if(res.data.returnCode=="1"){
                let json = JSON.parse(res.data.returnData);
                //console.log(JSON.parse(res.data.returnData));
                this.tableDataChild = json.rows;
                this.pageTotalChild = json.records || this.query.pageSize
            }
            else  
            {
                this.$message.error(res.data.returnMsg);
            }
        });
    },
    //打开备件详情对话框
    openParts(DevID, type) {
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

                this.$refs.showInfo.addPerson(this.obj,type)
                this.InfoVisible = true
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

        this.$refs.multipleTable.toggleRowSelection(row)

        let strWhere = " T.ParentID ='" + row.DevID + "'"

        this.getDataChild(strWhere)
    },
    //选中子gird
    onRowClickChild(row, event, column,cell) {
        this.selectedRowChild = row
        this.$refs.multipleTableChild.toggleRowSelection(row)
    },
    tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
        let color = "myRowClassUn";

        if(this.selectedIndex == rowIndex)
            color = "myRowClass";

        return color;
    },
    tableRowClassNameChild ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
        let color = "myRowClassUn";

        this.multipleSelection.forEach(item =>{
            if(item.index == rowIndex)
                color = "myRowClass";
        });

        return color;
    },
    // 多选操作
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    // 触发搜索按钮
    handleSearch() {
        //IDModel
        // alert(this.$refs.selectTreeCategory._data.threeModel)
        // alert(this.$refs.selectTreeCategory._data.valueModel)
        // alert(this.$refs.selectTreeCategory._data.labelModel)

        this.$set(this.query, 'pageIndex', 1);
        let strWhere = '1=1'

        if(this.query.WorkShop != '')
            strWhere = strWhere + " and A.AreaCode ='" + this.query.WorkShop + "'"

        if(this.query.Cell != '')
            strWhere = strWhere + " and A.CellCode ='" + this.query.Cell + "'"

        if(this.query.CategoryQuery != '')
            strWhere = strWhere + " and T.CategoryCode = N'" + this.query.CategoryQuery + "'"

        if(this.query.ParentStatus != '')
           strWhere = strWhere + " and T.ParentStatus = " + this.query.ParentStatus

        if(this.query.DevCodeorName != '')
            strWhere = strWhere + " and concat(T.DevCode,T.DevName) Like N'%" + this.query.DevCodeorName + "%'"

        this.getData(strWhere);
    },
    //重置查询条件
    handleReset(){
        this.query.CategoryQuery = ''
        this.query.WorkShop =  ''
        this.query.Cell = ''
        this.query.ParentStatus = '0',
        this.query.DevCodeorName =  ''

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

        if(this.query.ParentStatus != '')
           strWhere = strWhere + " and T.ParentStatus = " + this.query.ParentStatus

        if(this.query.DevCodeorName != '')
            strWhere = strWhere + " and concat(T.DevCode,T.DevName) Like N'%" + this.query.DevCodeorName + "%'"

        this.getData(strWhere);
    },
    // 分页导航
    handlePageChangeChild(val) {
        this.$set(this.query, 'pageIndexChild', val);

        let strWhere = " T.ParentID ='" + this.selectedRow.DevID + "'"

        this.getDataChild(strWhere)
    },
    // 添加操作
    handleAdd() {
        if(this.selectedRow.DevID == undefined){
            this.$message.warning('请选择要添加子级设备的数据');
            return false;
        }

        this.addOrEditVisible = true
        this.$refs.addOrEdit.addPerson(this.selectedRow)
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

                let ids = new Array()
                let names = new Array()
                let Codes = new Array()
                let index = 0

                this.multipleSelection.forEach(item =>{
                    ids[index] = "'" + item.DevID + "'"
                    names[index] = "'" + item.DevName + "'"
                    Codes[index] = "'" + item.DevCode + "'"
                    index++
                });

                let DevChildID = ids.join()// 设备编码
                let nameStr = names.join()
                let CodeStr = Codes.join()

                let strWhere = " DevID in (" + DevChildID + ")";

                params.append('json', strWhere);
                params.append('DevID', this.selectedRow.DevID);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '子级设备管理',
                    ObjectName: 'DeleteDevChild',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔删除〕父级设备管理：【' + this.selectedRow.DevCode + '-' + this.selectedRow.DevName + '】；子级设备管理：【' + CodeStr + ' - ' + nameStr + '】'
                });

                params.append('Logjson', json);
                    axios.post(EamWebApiUrl + '/EamDev/DeleteDevChild', params).then((res) => {
                        if (res.data.returnCode == '1') {
                            this.$message.success('删除成功');
                           
                            let strWhere = " T.ParentID ='" + this.selectedRow.DevID + "'"
                            this.getDataChild(strWhere)
                          
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
            .catch(() => {}
        );
    },
    createNewDomain() {
        this.loading = true
        this.addOrEditVisible = false
        this.selectedRowChild = {}

        let strWhere = " T.ParentID ='" + this.selectedRow.DevID + "'"

        this.getDataChild(strWhere)
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
        margin-right: 10px;
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

    .Child
    {
        height: 241px;
    }
        
</style>
