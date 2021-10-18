<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 系统日志查询
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
         
             <el-date-picker
               is-range
              v-model="query.timeData"
              range-separator="-"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
               value-format="yyyy-MM-dd"   
              :default-time="['00:00:00', '23:59:59']"
              placeholder="选择时间范围"
              class="mr10"
              >
            </el-date-picker> 
      
                <el-select v-model="query.yesOrNo"  class="handle-select mr10" >
                     <el-option  key=""	 label="是否成功"   value=""  > </el-option>
                     <el-option  key="1"	 label="是"   value="1"  > </el-option>
                      <el-option  key="0"	 label="否"   value="0"  > </el-option>
                </el-select>
            
                 <el-input v-model="query.menu" placeholder="--操作菜单--" class="handle-input mr10"></el-input>
                 <el-input v-model="query.user" placeholder="--操作用户--" class="handle-input mr10"></el-input>
                 <el-input v-model="query.describe" placeholder="--动作描述--" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
    
          
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                @row-click = "onRowClick"
                header-cell-class-name="table-header"
                :row-class-name="tableRowClassName"
                 >
            
                <el-table-column prop="LogType" label="日志类型"></el-table-column>
                <el-table-column prop="LogLevel" label="日志等级"></el-table-column>
                <el-table-column prop="CreateDate"  label="操作时间" min-width="120" :formatter="formatDate"></el-table-column>
                <el-table-column prop="MenuName" label="操作菜单" ></el-table-column>
                <el-table-column prop="ObjectName" label="操作用户"  ></el-table-column>
                <el-table-column prop="HostName" label="机器名"  ></el-table-column>
                <el-table-column prop="IPAdd" label="IP地址"  ></el-table-column>
                <el-table-column prop="HostType" label="客户端类型"  ></el-table-column>
                <el-table-column label="是否成功"  >  
                <template slot-scope="scope">
                <p v-html='scope.row.IsSuccess'></p>
                  </template>
                  </el-table-column>
                 <el-table-column prop="Operation" width="350" label="动作描述"  ></el-table-column>
                
                 <el-table-column prop="LogRank" label="Rank" v-if=false> </el-table-column> 
            
               <el-table-column label="操作">
               <template scope="scope">
                   
          <el-button
             size="small" 
             @click="handleView(scope.$index, scope.row)">查看</el-button>
            </template>
            </el-table-column>
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



<el-dialog
        :visible.sync="editVisible"
        width="740px"
        @close="OnClose()"
        :close-on-click-modal="false"
    >
        <h2 class="headerlog">
            <i class="el-icon-lx-apps"></i>
            <span>详细信息查看</span>
        </h2>

        <div style="height:340px;  margin-top: 30px;">
            <el-form ref="domainValidateForm" status-icon>
                <el-row :gutter="20">
                 <el-col :span="10"><el-form-item label="对象名称:"  >
                    <el-input v-model="logForm.ObjectName" class="handle-input-edit" :disabled="true" ></el-input>
                </el-form-item></el-col>
                  <el-col :span="10">  <el-form-item label="是否成功:"  >
                    <el-input v-model="logForm.IsSuccess" class="handle-input-edit"  :disabled="true" ></el-input>
                </el-form-item></el-col>
               </el-row>
                <el-row :gutter="20">
                 <el-col :span="20"><el-form-item label="SQLText:"  >
                   <el-input
                        type="textarea"
                        :rows="4"
                        v-model="logForm.SQLText"
                        style="  width: 500px;"
                    ></el-input>
                </el-form-item></el-col>
                   
               </el-row>
                  <el-row :gutter="20">
                 <el-col :span="20"><el-form-item label="SQLParm:"  >
                   <el-input
                        type="textarea"
                        :rows="4"
                        v-model="logForm.SQLParm"
                        style="width: 500px;"
                    ></el-input>
                </el-form-item></el-col>
                   
               </el-row>
                  <el-row :gutter="20">
                 <el-col :span="20"><el-form-item label="异常信息:"  >
                   <el-input
                        type="textarea"
                        :rows="4"
                        v-model="logForm.ReturnMessage"
                        style="  width: 500px;"
                    ></el-input>
                </el-form-item></el-col>
                   
               </el-row>
             
            </el-form>
        </div>
        <div slot="footer" class="bottom">
            <el-button @click="close">关闭</el-button>
         
        </div>
    </el-dialog>


 
     </div>
   
     
  
     
</template>



<script>
 
import axios from 'axios';
 
export default {
    name: 'syslog',
 
    data() {
        return {
            query: {
                yesOrNo: '',
                menu: '',
                title:'',
                user:'',
               describe:'',
                pageIndex: 1,
                pageSize: 10,
                timeData:[],
           },
           logForm:[],
            tableData: [],
            multipleSelection: [],
            editVisible: false,
            pageTotal:0,
            form: {},
            idx: -1,
            id: -1,
            SettingDrowDown:{},//公告类型下拉
            selectedIndex: -1,// 用于存放被选中行的index
            selectedRow:{}// 用于存放被选中行
            
        };
    },mounted: function () {
      
    },
     created() {
        this.getPassYearFormatDate();
    
        this.getData();
        
    },
    methods: {
         getPassYearFormatDate () {
          var nowDate = new Date()
          var date = new Date(nowDate)
          date.setDate(date.getDate() - 30)
          var seperator1 = '-'
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var strDate = date.getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
          }
          var formatDate = year + seperator1 + month + seperator1 + strDate
          this.getNowFormatDate(formatDate)
        },
        /* 获取现在时间，并接受过去时间的值 */
        getNowFormatDate (formatDate) {
          var date = new Date()
          var seperator1 = '-'
          var year = date.getFullYear()
          var month = date.getMonth() + 1
          var strDate = date.getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
          }
          var nowData = year + seperator1 + month + seperator1 + strDate
          this.query.timeData= [formatDate, nowData]  // 默认赋值一年时间
      },
        

        // 获取 easy-mock 的模拟数据
        getData() {
          let params = new URLSearchParams();
  
          if(this.query.timeData==null ){
           this.$message.error("时间条件必须输入");
            return;
          }
          let where ="1=1";
          where =where +"  AND T.CreateDate >= '"+this.query.timeData[0]+" 00:00:00' AND  T.CreateDate <= '"+this.query.timeData[1]+" 23:59:59'"
          if(this.query.yesOrNo!="")
          {
                  where =where +" AND T.IsSuccess='"+this.query.yesOrNo+"'";
          }
           if(this.query.menu!="")
          {
                  where =where +" AND T.MenuName Like N'%"+this.query.menu+"%'";
          }
           if(this.query.user!="")
          {
                  where =where +" AND T.PersonName Like N'%"+this.query.user+"%'";
          }
           if(this.query.describe!="")
          {
                  where =where +" AND T.Operation Like N'%"+this.query.describe+"%'";
          }
            params.append('strWhere',  where);
            params.append('Rows', this.query.pageSize);
            params.append('CurrentPage',  this.query.pageIndex);
            params.append('sidx',  " t.CreateDate");
            params.append('sord',  "desc");
            axios.post(BaseWebApiUrl + '/Syslog/QuerySystemList', params).then((res) => {
              
                if (res.data.returnCode == '1') {
                     let  data = JSON.parse(res.data.returnData);
                     this.tableData =data.rows;    
                     this.pageTotal = data.records;
                     
                 } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
     },
        formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property]
                if(data == null) {
                    return null
                }
                let dt = new Date(data)
                 return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()  +' '+dt.getHours() +':' +dt.getMinutes()+':' + dt.getSeconds();
            },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        
        handleView(index, row) {

            let params = new URLSearchParams();
  
            params.append('strWhere',   "LogRank =" + row.Rank);
         
            axios.post(BaseWebApiUrl + '/Syslog/GetSystemLogModel', params).then((res) => {
              
                if (res.data.returnCode == '1') {
                    this.logForm.ObjectName=row.ObjectName;
                    this.logForm.IsSuccess=this.delHtmlTag(row.IsSuccess);
                    let  data =  res.data.returnData;
                     this.logForm.ReturnMessage=data.ReturnMessage;
                     this.logForm.SQLText=data.SQLText;
                     this.logForm.SQLParm=data.SQLParm;
                     this.editVisible = true;
                     
                 } else {
                    this.$message.error(res.data.returnData.ReturnMessage);
                }
            });


            
          
        },
         delHtmlTag(str) {
                return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
            },
         
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        } ,
         //选中一行
        onRowClick(row, event, column,cell) {
            this.selectedRow = row
            this.selectedIndex = row.index

           // this.$refs.multipleTable.toggleRowSelection(row);
        },
        tableRowClassName ({row, rowIndex}) {
            //把每一行的索引放进row
            row.index = rowIndex;
             let color = "myRowClassUn";

             if(this.selectedIndex == rowIndex)
                color = "myRowClass";
            return color;
        },
        close(){

            this.editVisible=false;
        }
        ,  OnClose() {
            //this.NoticeForm = [];
               this.editVisible=false;
        },
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
.headerlog {
    height: 40px;
    margin-bottom: 5px;
    border-bottom: 1px solid #d5e3ef;
    font-size: 16px;
    color: #44bbbb;
}
</style>
