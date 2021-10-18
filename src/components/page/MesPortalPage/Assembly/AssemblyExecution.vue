<template>
    <div>
        <div>
            <div>
                <i class="el-icon-arrow-right header">装配工单执行</i><i class="el-icon-arrow-right header">生产工单</i>
                <el-row :gutter="40"  style="padding: 0px; margin: 0px; height: 540px; overflow-y: auto">
                    <el-col :span="6" v-for="(item, i) in todoList" :key="i">
                        <el-card :body-style="{ padding: '20px' }" style="margin-top: 10px">
                            <div style="border-bottom: solid 1px #dcdcdc; padding-bottom: 5px">
                                <span v-bind:class="item.color">{{ item.state }}</span> {{ item.fid }}
                            </div>

                            <div style="margin-top: 10px">
                                <div class="text item">产品编号：{{ item.code }}</div>
                                <div class="text item">产品名称：宝马电控柜</div>
                                <div class="text item">规格型号：LC01-FB</div>
                                <div class="text item">生产订单：80900001</div>
                                <div class="text item">计划开始：2021-7-1</div>
                                <div class="text item">计划结束：2021-7-2</div>
                                <div class="text-right">
                                    <el-button class="btn-phoenix" type="primary" @click="AssemblyExecutioning_form_show(item.code)">执行</el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-row>
                    <el-col :span="12">
                        <i class="el-icon-arrow-right header">装配工单执行</i><i class="el-icon-arrow-right header">安灯信息</i>
                        <!-- 假分页用此方法 adData.slice((currentPage-1)*pagesize,currentPage*pagesize)-->
                        <el-table
                            ref="adTable"
                            :data="adData.slice((currentPage - 1) * pagesize, currentPage * pagesize)"
                            border
                            height="190px"
                            style="width: 100%"
                            :default-sort="{ prop: 'errcode', order: 'descending' }"
                        >
                            <el-table-column prop="errcode" label="异常代码" sortable> </el-table-column>
                            <el-table-column prop="date" label="开始" sortable> </el-table-column>
                            <el-table-column prop="min" label="持续（分钟）" width="140px" sortable> </el-table-column>
                            <el-table-column prop="state" label="状态" sortable>
                                <template slot-scope="scope">
                                    <div :class="scope.row.state == '已处理' ? 'red' : ''">{{ scope.row.state }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination layout="prev, pager, next" :total="total" :page-size="pagesize" @current-change="current_change">
                        </el-pagination>
                    </el-col>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="11">
                        <i class="el-icon-arrow-right header">装配工单执行</i><i class="el-icon-arrow-right header">前序信息</i>
                        <el-table
                            :data="zpData"
                            border
                            height="200px"
                            :header-cell-style="{ textAlign: 'center' }"
                            :default-sort="{ prop: 'errcode', order: 'descending' }"
                        >
                            <el-table-column prop="WorkingProcedure" label="工序" sortable> </el-table-column>
                            <el-table-column prop="FID" label="FID" sortable> </el-table-column>
                            <el-table-column prop="num" label="数量" width="80px" sortable> </el-table-column>
                            <el-table-column prop="state" label="生产状态" sortable> </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 弹出框 -->
        <el-dialog
            title
            :visible.sync="AssemblyExecutioning_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
        >
          <prop_form :FID="FID" @AssemblyExecutioning_form_close="AssemblyExecutioning_form_close"></prop_form>
        </el-dialog>
    </div>
</template>
<script>
import prop_form from '@/components/page/MesPortalPage/Assembly/AssemblyExecutioning.vue';
import Vue from 'vue';

export default {
    data() {
        return {
            AssemblyExecutioning_form_openOff: false,
            todoList: [
                {
                    fid: 'FID89010001',
                    code: '89145001',
                    state: '已启动',
                    color: 'state Green'
                },
                {
                    fid: 'FID89010002',
                    code: '89145002',
                    state: '未开始',
                    color: 'state Red'
                },
                {
                    fid: 'FID89010003',
                    code: '89145003',
                    state: '已暂停',
                    color: 'state Silver'
                },
                {
                    fid: 'FID89010004',
                    code: '89145004',
                    state: '已启动',
                    color: 'state Green'
                },
                {
                    fid: 'FID89010004',
                    code: '89145004',
                    state: '已启动',
                    color: 'state Green'
                },
                {
                    fid: 'FID89010004',
                    code: '89145004',
                    state: '已启动',
                    color: 'state Green'
                }
            ],
            total: 60, //默认数据总数
            pagesize: 3, //每页的数据条数
            currentPage: 1, //默认开始页面
            istag: true,
            adData: [
                {
                    errcode: '图纸错误',
                    date: '13:17',
                    min: '30',
                    state: '未处理'
                },
                {
                    errcode: '生产异常',
                    date: '13:04',
                    min: '31',
                    state: '未处理'
                },
                {
                    errcode: '物料异常',
                    date: '13:06',
                    min: '32',
                    state: '已处理'
                },
                {
                    errcode: '图纸错误',
                    date: '13:17',
                    min: '33',
                    state: '未处理'
                },
                {
                    errcode: '生产异常',
                    date: '13:04',
                    min: '34',
                    state: '未处理'
                },
                {
                    errcode: '物料异常',
                    date: '13:06',
                    min: '35',
                    state: '已处理'
                }
            ],
            zpData: [
                {
                    WorkingProcedure: '设备装配01',
                    FID: 'USED0101001',
                    num: '30',
                    state: '已启动'
                },
                {
                    WorkingProcedure: '设备装配02',
                    FID: 'USED0101002',
                    num: '20',
                    state: '未开始'
                },
                {
                    WorkingProcedure: '设备装配03',
                    FID: 'USED0101003',
                    num: '35',
                    state: '已启动'
                },
                {
                    WorkingProcedure: '设备装配03',
                    FID: 'USED0101004',
                    num: '35',
                    state: '已启动'
                }
            ],
             FID: ''
        };
    },
    computed: {},
    methods: {
        current_change: function (currentPage) {
            this.currentPage = currentPage;
            // alert(currentPage);
        },
        created: function () {
            this.total = this.tableData.length;
        },
        AssemblyExecutioning_form_show(key) {
            this.FID = key
            this.AssemblyExecutioning_form_openOff = true; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        AssemblyExecutioning_form_close() {
            this.AssemblyExecutioning_form_openOff = false; //默认页面不显示为false,点击按钮将这个属性变成true
        }
    },
    mounted:function(){
        //页面加载后时执行
       // bb();
    },
    components: {
        //注册
        prop_form
    }
};

 export function bb() {
            let aa=localStorage.getItem('ms_username');
        }

</script>
<style>
.text-right {
    text-align: right;
    margin-top: -30px;
}
</style>