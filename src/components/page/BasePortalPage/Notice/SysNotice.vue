<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 通知公告
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
              
                <el-select v-model="query.NoticeType"  class="handle-select mr10" >
                     <el-option  key="0"	 label="公告类型"   value="0"  > </el-option>
                     <el-option  v-for="item in SettingDrowDown
"                    :key="item.SettingNumber"		 
                     :label="item.SettingValue"	 
                     :value="item.SettingNumber"> </el-option>
                 
                    </el-select>
                    
                <el-input v-model="query.title" placeholder="--公告标题--" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                     <el-button type="primary" icon="el-icon-search" @click="handleMq">MQ测试</el-button>
            </div>
        
            <div class="handle-box" style="float:right; margin-right: 5px;"> <el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDelete">删除</el-button></div>
           <div class="handle-box" style="float:right; margin-right: 5px;"> <el-button type="primary" icon="el-icon-thirdbtnEdit" @click="openDialogEdit">修改</el-button></div>
           <div class="handle-box" style="float:right;margin-right: 5px;"> <el-button type="primary" icon="el-icon-thirdiconfontunie042" @click="openDialog">新增</el-button></div>
          
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                @row-click = "onRowClick"
                header-cell-class-name="table-header"
                :row-class-name="tableRowClassName"
                 >
                <el-table-column prop="Row" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="SettingValue" label="公告类型"></el-table-column>
                <el-table-column prop="Title" label="公告标题"></el-table-column>
                <el-table-column prop="Describe" width="600" label="公告内容"></el-table-column>
                <el-table-column prop="StartDate" label="发布日期" :formatter="formatDate"></el-table-column>
                <el-table-column prop="ExpireDate" label="结束日期" :formatter="formatDate"></el-table-column>
                <el-table-column prop="PersonName" label="发布人"></el-table-column> 
                <el-table-column prop="NoticeType" label="公告类型编码" v-if=false> </el-table-column> 
            
               <el-table-column label="操作">
               <template scope="scope">
                   
          <el-button
             size="small" v-if="scope.row.AttUrl!=''"
             @click="handleDownFile(scope.$index, scope.row)">文件下载</el-button>
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
	  <child  ref="mychild"   :show.sync="editVisible"  @addNewDomain="createNewDomain" > </child>
     </div>
   
     
  
     
</template>



<script>
 
import axios from 'axios';
import Child from './SysNoticeEdit';

export default {
    name: 'basetable',
   components: {    child: Child },
    data() {
        return {
            query: {
                NoticeType: '0',
                name: '',
                title:'',
                pageIndex: 1,
                pageSize: 10,
                timeData:[],
           },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal:0,
            form: {},
            idx: -1,
            id: -1,
            SettingDrowDown:{},//公告类型下拉
           info: '我是父页的信息,我存在data()中',
            selectedIndex: -1,// 用于存放被选中行的index
            selectedRow:{}// 用于存放被选中行
            
        };
    },mounted: function () {
      
    },
     created() {
        this.getPassYearFormatDate();
        this.initDrowlist();
        this.getData();
        
    },
    methods: {
       openDialog() {
           this.$refs.mychild.addNotice();
           this.editVisible=true;
       },
       openDialogEdit() {
         if(this.selectedIndex==-1 ){
               this.$message.info('请选择要编辑的数据');
                return false;
         }
            this.$refs.mychild.editNotice( this.selectedRow);
           this.editVisible=true;
       },
       createNewDomain(domainForm) {
       this.loading = true
       this.getData();
       this.editVisible = false
    },
       
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
       initDrowlist(){
            let params = new URLSearchParams();
            params.append('strWhere',  "SettingKey='NoticeType'");
            axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingDrowDownList', params).then((res) => {
              
                if (res.data.returnCode == '1') {
                     let  data = JSON.parse(res.data.returnData);
                     this.SettingDrowDown=data;
                 } else {
                    this.$message.error(res.data.returnMsg);
                }
            });

       },


       handleMq(){
             let params = new URLSearchParams();

                    let jsonData = JSON.stringify({
                      
                    });
                    params.append('json', jsonData);

                    let json = JSON.stringify({
                       
                      });
                    params.append('Logjson', json);
            
                    axios.post(BaseWebApiUrl + '/SysNotice/CreatSysNoticeMq', params).then((res) => {
                    
                        if (res.data.returnCode == '1') {
                            this.$message.success("保存成功");
                    
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
       },

        // 获取 easy-mock 的模拟数据
        getData() {
          let params = new URLSearchParams();
  
          if(this.query.timeData==null ){
           this.$message.error("时间条件必须输入");
            return;
          }
          let where ="1=1";
          where =where +"  AND T.ExpireDate >= '"+this.query.timeData[0]+" 00:00:00' AND  T.StartDate <= '"+this.query.timeData[1]+"  23:59:59'"
          if(this.query.NoticeType!="0")
          {
                  where =where +" AND T.NoticeType='"+this.query.NoticeType+"'";
          }
           if(this.query.title!="")
          {
                  where =where +" AND T.Title Like N'%"+this.query.title+"%'";
          }
            params.append('strWhere',  where);
            params.append('Rows', this.query.pageSize);
            params.append('CurrentPage',  this.query.pageIndex);
            params.append('sidx',  "StartDate");
            params.append('sord',  "desc");
            axios.post(BaseWebApiUrl + '/SysNotice/QueryNoticeList', params).then((res) => {
              
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
                 return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()  
            },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete() {

         if(this.selectedIndex==-1 ){
               this.$message.error('请选择要删除的数据');
                return false;
         }


            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                
                   let params = new URLSearchParams();
                   var strWhere = " Rank in (" + this.selectedRow.Rank + ")";
                     params.append('strDel', strWhere);

                    let json = JSON.stringify({
                         IPAdd:  localStorage.getItem('IPAdd'),
                        HostName:  localStorage.getItem('HostName'),
                        MenuName: '通知公告管理',
                        ObjectName: 'DeleteSysNotice',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation: '〔删除〕通知公告：' + this.selectedRow.Rank
                    });
                    params.append('Logjson', json);
                         axios.post(BaseWebApiUrl + '/SysNotice/DeleteSysNotice', params).then((res) => {
                        if (res.data.returnCode == '1') {
                           this.$message.success('删除成功');
                            this.getData();
                          
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                 
                  
                })
                .catch(() => {});
        },
        handleDownFile(index, row){
           window.open(
            row.AttUrl,
            "_blank"
          );
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
   .sel{
        float: left;
        margin-top: 2px;
    }

</style>
