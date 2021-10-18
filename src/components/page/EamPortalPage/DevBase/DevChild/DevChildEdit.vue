<template>
  <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="1300px" @close="OnClose()">
     <h2 class="headerNotice">
        <i class="el-icon-thirdkucun"></i>
        <span>设备台账管理</span>
    </h2>
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
        <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            :row-class-name="tableRowClassName"
            @row-click = "onRowClick"
            @selection-change="handleSelectionChange"
        >
            <el-table-column prop="DevID" type="selection" label="DevID" width="55" align="center"></el-table-column>
            <el-table-column prop="ImageUrl" v-if=false label="人员照片"></el-table-column>
            <el-table-column prop="DeptID" v-if=false label="所属部门ID"></el-table-column>
            <el-table-column prop="DevCode" label="设备编码"></el-table-column>
            <el-table-column prop="DevName" label="设备名称" width="80" show-overflow-tooltip>
                <template scope="scope">
                    <div style="cursor:pointer;">
                        {{ scope.row.DevName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="DevModel" label="规格型号" width="80" show-overflow-tooltip>
                <template scope="scope">
                    <div style="cursor:pointer;">
                        {{ scope.row.DevModel}}
                    </div>
                </template>
            </el-table-column>
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
         <div slot="footer" class="bottom">
            <el-button @click="OnClose">取 消</el-button>
            <el-button type="primary" @click="OnSubmit()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import { log } from 'util';
import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';
import { showLoading, hideLoading } from '../../../../../assets/js/loading';

export default {
    components: {
       selectTreeCategory:SelectTreeCategory
    },
    props: {
        show: { type: Boolean, default: false } // 弹框可见标志
    },
    name: 'basetable',
    data() {
        return {
            // 默认选中值
            selected: '',
            // 弹框可见否标记
            visible: this.show,
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
            addOrEditVisible:false,//编辑对话框
            selectedRow:{},// 用于存放被选中行
            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'number',          // 唯一标识
                label: 'label',       // 标签显示
                children: 'children', // 子级
            },
            fatherObj:{}//父级
        };
    },
    watch: {
        // 监听show,visible 随着show变化而变化
        show: {
            immediate: true,
            handler(show) {
                this.visible = show
            }
        }
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
        //获取父级ID
        addPerson(obj){
            this.fatherObj = obj
        },
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
        //选中一行
        onRowClick(row, event, column,cell) {
            this.selectedRow = row
            this.$refs.multipleTable.toggleRowSelection(row);
        },
        tableRowClassName ({row, rowIndex}) {
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
        //提交方法
        OnSubmit(){
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

            //this.DevID
            let params = new URLSearchParams();

                params.append('json', strWhere);
                params.append('DevID', this.fatherObj.DevID);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '子级设备管理',
                    ObjectName: 'CreateDevChild',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔添加〕父级设备管理：【' + this.fatherObj.DevCode + '-' + this.fatherObj.DevName + '】；子级设备管理：【' + CodeStr + ' - ' + nameStr + '】'
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(EamWebApiUrl + '/EamDev/CreateDevChild', params).then((res) => {
                    hideLoading();
                    if (res.data.returnCode == '1') {
                        this.$message.success("保存成功");
                    } else {
                        this.$message.error(res.data.returnMsg);
                    }
                });    

        },       
        // 关闭弹框
        OnClose() {
            this.$emit('addNewDomain');
            this.$set(this.query, 'pageIndex', 1);
            this.multipleSelection = new Array()
            this.getData('1=1');
            this.$refs.multipleTable.clearSelection()
            this.$emit('update:show', false); // 子组件更新弹框隐藏
        },
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

    .table{
        margin-top: 20px;
    }
        
</style>


