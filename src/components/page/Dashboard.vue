<template>
    <div>
          <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" style="height: 252px">
                    <div slot="header" class="clearfix">
                        <span>语言详情</span>
                    </div>
                    Vue <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS <el-progress :percentage="13.7"></el-progress>HTML
                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card shadow="hover" style="height: 252px">
                    <div slot="header" class="clearfix">
                        <span>待办提醒</span>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="height: 160px; width: 100%; overflow-y: auto">
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">{{ scope.row.title }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
          </el-card>
        <el-card class="box-card" style="margin-top:20px;padding:10px;height:130;padding:10px">
        <el-row :gutter="20">
            <el-col :span="4" :offset="1"><router-link  to="/AssemblyExecution"><div class="grid-content"><div><img src="../../assets/img/zpgd.png" />装配工单执行</div></div></router-link></el-col>
            <el-col :span="4" :offset="2"><router-link  to="/InspectionExecution"><div class="grid-content"><div><img src="../../assets/img/jcgd.png" />检测工单执行</div></div></router-link></el-col>
            <el-col :span="4" :offset="2"><div class="grid-content" @click="push('CheckBenchmark','key')"><div><img src="../../assets/img/bzgd.png" />包装工单执行</div></div></el-col>
            <el-col :span="4" :offset="2"><router-link  to="/IQCInspectionExecution"><div class="grid-content"><div><img src="../../assets/img/zljy.png" />IQC检验执行</div></div></router-link></el-col>
        </el-row>
        </el-card>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import router from '../../router';

export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            todoList: [
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: false
                },
                {
                    title: '今天要修复100个bug',
                    status: false
                }
            ],

            options: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {},
    methods: {
       push:function(name,e){
        //    this.$router.push({path: '/test', query: {id: e}})
          this.$router.push({name:name, params: {id: e}})
           
        },
    }
};
</script>


<style scoped>
.grid-content {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    color: white;
    background: #24999C;
    width:200px;
    height:90px;
    border-radius:10px ;
    box-shadow:2px 2px 5px #24999C;
   
  }
  .grid-content div{
      padding-top:20px;
      margin-left: 20px;
  }
.grid-content img{
vertical-align:middle;
height: 50px;
}



.el-row {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
