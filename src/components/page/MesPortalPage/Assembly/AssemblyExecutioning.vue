<template>
    <div>
        <div class="headbar">
            <span @click="closeMySelf"><i class="el-icon-arrow-left"></i>返回</span
            ><i class="el-icon-arrow-up pull-right" :class="show ? 'l-icon-arrow-up' : 'el-icon-arrow-down'" @click="handleOpen" ></i>
        </div>
        <div class="body">
        <div v-show="show">
            <el-row>
                <el-col :span="7">
                    <el-input class="textLarge" placeholder="请扫描料箱条码及指令码" style="width:100%" suffix-icon="iconfontNew iconNew-Recode red" v-model="QRcode" >
                    </el-input>
                    <el-row style="margin-top: 10px">
                        <el-col :span="2">&nbsp;</el-col>
                        <el-col :span="6"
                            ><div class="ball Red"></div>
                            未装配</el-col
                        >
                        <el-col :span="8"
                            ><div class="ball Yellow"></div>
                            部分装配</el-col
                        >
                        <el-col :span="6"
                            ><div class="ball Green"></div>
                            已分配</el-col
                        >
                    </el-row>
                </el-col>
                <el-col :span="6">
                    &nbsp;
                    <div style="color: red; margin-top: -5px">{{ errMes }}</div>
                </el-col>
                <el-col :span="9">
                    <div class="step">
                        <el-steps :active="active" align-center>
                            <el-step :title="item.title" :description="item.Mes" v-for="(item, index) in stepsData" :key="index"> </el-step>
                        </el-steps>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="State">{{ state }}</div>
                </el-col>
            </el-row>
            <div class="Executioning">
                <el-row>
                    <el-col :span="9"
                        ><el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>产品信息</span>
                            </div>
                            <div class="textLarger item">FID：{{ FID }}</div>
                            <div class="textLarge item">产品名称：宝马电控柜</div>
                            <table border="0px">
                                <tr>
                                    <td>产品编码：CP0001</td>
                                    <td>&nbsp;规格型号：MX1346</td>
                                </tr>
                                <tr>
                                    <td>产品类型：高压高柜</td>
                                    <td>&nbsp;生产订单：SO2020-988</td>
                                </tr>
                            </table>
                        </el-card>
                    </el-col>
                    <el-col :span="6"
                        ><el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>工时信息</span>
                            </div>
                            <div class="text item">开始时间：06-20 12:00</div>
                            <div class="text item">累计用时：40 min</div>
                            <div class="text item">当前开始：06-20 12:00</div>
                            <div class="text item">当前用时：40 min</div>
                        </el-card></el-col
                    >
                    <el-col :span="5"
                        ><el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>装配信息</span>
                                <el-button style="float: right; padding: 3px 0" type="text" @click="MaterialBox_form_show()">查看</el-button>
                            </div>
                            <div class="text item">料箱编号：Box001</div>
                            <div class="text item">装配进度：50/120件</div>
                            <div class="text item">装配次数：2</div>
                            <div class="text item red">关键物料：2/2</div>
                        </el-card></el-col
                    >
                    <el-col :span="4"
                        ><el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>文档资料</span>
                            </div>
                            <div class="text item"><a target="_blank" href="../../../../static/Files/gytz.txt">工艺图纸</a></div>
                            <div class="text item">
                                <a target="_blank" href="../../../../static/Files/gytz.txt" download="gytz.txt">作业指导书</a>
                            </div>
                        </el-card></el-col
                    >
                </el-row>
            </div>
        </div>
        <div style="margin-top:10px">
            <i class="el-icon-arrow-right header">装配工单执行</i><i class="el-icon-arrow-right header">装配明细</i>
        </div>
        <div style="margin-top:10px">
            <el-table
                :data="zpData"
                border
                :height="vheight"
                :header-cell-style="{ textAlign: 'center' }"
                :default-sort="{ prop: 'errcode', order: 'descending' }"
            >
                <el-table-column prop="state" label="状态" width="50px">
                    <template slot-scope="scope">
                        <div :class="scope.row.statebg"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="BOMNO" label="BOMNO" sortable> </el-table-column>
                <el-table-column prop="ItemNum" label="物料编号" sortable> </el-table-column>
                <el-table-column prop="ProductName" label="产品名称" sortable> </el-table-column>
                <el-table-column prop="BOMnum" label="BOM数量" sortable> </el-table-column>
                <el-table-column prop="AssembledQuantity" label="已装配数量" sortable> </el-table-column>
                <el-table-column prop="QuantityAssembled" label="待装配数量" sortable> </el-table-column>
                <el-table-column prop="Remark" label="备注信息" sortable> </el-table-column>
                <el-table-column prop="state" label="物料明细" width="85px">
                    <template slot-scope="scope">
                        <span @click="MaterialDetails_form_show(scope.row.ItemNum)">查看</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-pagination layout="prev, pager, next" :total="total" :page-size="pagesize" @current-change="current_change">
            </el-pagination> -->
            <el-card class="box-card operation">
                <el-row>
                    <el-col :span="14">
                        <el-button type="primary"><i class="iconfontNew iconNew-start"></i><br>开始</el-button>
                        <el-button type="primary"><i class="iconfontNew iconNew-stop"></i><br>暂停</el-button>
                        <el-button type="primary"><i class="el-icon-circle-check" style="font-size: 26px;"></i><br>完成</el-button>
                        <el-button type="primary"><i class="iconfontNew iconNew-add"></i><br>关键件</el-button>
                        <el-button type="primary"><i class="iconfontNew iconNew-clock"></i><br>报工</el-button></el-col
                    >
                    <el-col :span="10" class="right">
                        <el-button type="success"><i class="iconfontNew iconNew-shopping" @click="KanbanCallingMaterials_form_show"></i><br>看板叫料</el-button>
                        <el-button type="success"><i class="iconfontNew iconNew-export" style="font-size: 20px;line-height: 32px;"></i><br>剩料退还</el-button>
                        <el-button type="danger"><i class="el-icon-bell" style="font-size: 26px"></i><br>安灯呼叫(1/4)</el-button>
                        <el-button type="success"><i class="iconfontNew iconNew-other"></i><br>其它叫料</el-button></el-col
                    >
                </el-row>
            </el-card>
        </div>
        </div>
        <!-- 弹看板叫料 -->
         <el-dialog
            title
            :visible.sync="KanbanCallingMaterials_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
        >
            <KanbanCallingMaterials_form @KanbanCallingMaterials_form_close="KanbanCallingMaterials_form_close"></KanbanCallingMaterials_form>
        </el-dialog>
          <!-- 弹物料箱明细 -->
         <el-dialog
            title
            :visible.sync="MaterialBox_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
        >
            <MaterialBox_form @MaterialBox_form_close="MaterialBox_form_close"></MaterialBox_form>
        </el-dialog>
        <!-- 弹出框物料明细 -->
        <el-dialog
            title
            :visible.sync="MaterialDetails_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="true"
            :close-on-click-modal="true"
            :close-on-press-escape="false"
            :fullscreen="false"
        >
            <MaterialDetails_form></MaterialDetails_form>
        </el-dialog>
        
    </div>
</template>
<style>
.operation .el-button {
    padding: 0px;
    padding-top: 10px;
    height: 80px;
    width: 90px;
    line-height: 28px;
    text-align: center;
}
.Executioning .el-card {
    margin: 5px;
    height: 200px;
}
.Executioning .el-card__header {
    padding: 10px;
}
.State {
    width: 60px;
    line-height: 60px;
    font-size: 20px;
    border-radius: 50%;
    box-shadow: 2px 2px 5px #dcdcdc;
    text-align: center;
    background-color: #96be0d;
    color: white;
}
.ball {
    width: 20px;
    height: 20px;
    font-size: 12px;
    border-radius: 50%;
    box-shadow: 2px 2px 5px #dcdcdc;
    float: left;
    margin-right: 5px;
}
.step {
    margin-top: 10px;
}

.icon-erweima {
    font-size: 26px;
    color: tomato;
}

</style>
<script>
import MaterialDetails_form from '@/components/page/MesPortalPage/Assembly/MaterialDetails.vue';
import MaterialBox_form from '@/components/page/MesPortalPage/Assembly/MaterialBox.vue';
import KanbanCallingMaterials_form from '@/components/page/MesPortalPage/Assembly/KanbanCallingMaterials.vue';

export default {
    props: {
        FID: String
    },
    data() {
        return {
            MaterialDetails_form_openOff: false,
            MaterialBox_form_openOff: false,
            KanbanCallingMaterials_form_openOff: false,
            QRcode: '',
            vheight: '388px',
            show: true,
            active: 2, //从0开始
            state: 'YES',
            errMes: '异常信息：FID不存在，请重新扫描！',
            stepsData: [
                { title: 'ZP001', Mes: '' },
                { title: '张三', Mes: '' },
                { title: '扫描料箱', Mes: '' },
                { title: '扫描finishbox', Mes: '' }
            ],
            zpData: [
                {
                    state: '未装配',
                    statebg: 'ball Red',
                    BOMNO: 'A002',
                    ItemNum: 'A11111',
                    ProductName: '电阻1',
                    BOMnum: '10',
                    AssembledQuantity: '1',
                    QuantityAssembled: '1',
                    Remark: '备注1'
                },
                {
                    BOMNO: 'A002',
                    state: '部分装配',
                    statebg: 'ball Yellow',
                    ItemNum: 'A22222',
                    ProductName: '电阻2',
                    BOMnum: '20',
                    AssembledQuantity: '2',
                    QuantityAssembled: '2',
                    Remark: '备注2'
                },
                {
                    BOMNO: 'A002',
                    state: '已分配',
                    statebg: 'ball Green',
                    ItemNum: 'A33333',
                    ProductName: '电阻3',
                    BOMnum: '20',
                    AssembledQuantity: '3',
                    QuantityAssembled: '3',
                    Remark: '备注3'
                },
                {
                    BOMNO: 'A002',
                    state: '已启动',
                    statebg: 'ball Green',
                    ItemNum: 'A44444',
                    ProductName: '电阻4',
                    BOMnum: '20',
                    AssembledQuantity: '4',
                    QuantityAssembled: '4',
                    Remark: '备注4'
                },
                {
                    BOMNO: 'A002',
                    state: '部分装配',
                    statebg: 'ball Yellow',
                    ItemNum: 'A66666',
                    ProductName: '电阻2',
                    BOMnum: '20',
                    AssembledQuantity: '2',
                    QuantityAssembled: '2',
                    Remark: '备注2'
                },
                {
                    BOMNO: 'A002',
                    state: '已分配',
                    statebg: 'ball Green',
                    ItemNum: 'A77777',
                    ProductName: '电阻3',
                    BOMnum: '20',
                    AssembledQuantity: '3',
                    QuantityAssembled: '3',
                    Remark: '备注3'
                },
                {
                    BOMNO: 'A002',
                    state: '已启动',
                    statebg: 'ball Green',
                    ItemNum: 'A88888',
                    ProductName: '电阻4',
                    BOMnum: '20',
                    AssembledQuantity: '4',
                    QuantityAssembled: '4',
                    Remark: '备注4'
                },
                {
                    BOMNO: 'A002',
                    state: '部分装配',
                    statebg: 'ball Yellow',
                    ItemNum: 'A99999',
                    ProductName: '电阻2',
                    BOMnum: '20',
                    AssembledQuantity: '2',
                    QuantityAssembled: '2',
                    Remark: '备注2'
                },
                {
                    BOMNO: 'A002',
                    state: '已分配',
                    statebg: 'ball Green',
                    ItemNum: 'A11112',
                    ProductName: '电阻3',
                    BOMnum: '20',
                    AssembledQuantity: '3',
                    QuantityAssembled: '3',
                    Remark: '备注3'
                },
                {
                    BOMNO: 'A002',
                    state: '已启动',
                    statebg: 'ball Green',
                    ItemNum: 'A11112',
                    ProductName: '电阻4',
                    BOMnum: '20',
                    AssembledQuantity: '4',
                    QuantityAssembled: '4',
                    Remark: '备注4'
                },
                {
                    BOMNO: 'A002',
                    state: '部分装配',
                    statebg: 'ball Yellow',
                    ItemNum: 'A22221',
                    ProductName: '电阻2',
                    BOMnum: '20',
                    AssembledQuantity: '2',
                    QuantityAssembled: '2',
                    Remark: '备注2'
                },
                {
                    BOMNO: 'A002',
                    state: '已分配',
                    statebg: 'ball Green',
                    ItemNum: 'A22223',
                    ProductName: '电阻3',
                    BOMnum: '20',
                    AssembledQuantity: '3',
                    QuantityAssembled: '3',
                    Remark: '备注3'
                },
                {
                    BOMNO: 'A002',
                    state: '已启动',
                    statebg: 'ball Green',
                    ItemNum: 'A22224',
                    ProductName: '电阻4',
                    BOMnum: '20',
                    AssembledQuantity: '4',
                    QuantityAssembled: '4',
                    Remark: '备注4'
                },
                {
                    BOMNO: 'A002',
                    state: '部分装配',
                    statebg: 'ball Yellow',
                    ItemNum: 'A22225',
                    ProductName: '电阻2',
                    BOMnum: '20',
                    AssembledQuantity: '2',
                    QuantityAssembled: '2',
                    Remark: '备注2'
                },
                {
                    BOMNO: 'A002',
                    state: '已分配',
                    statebg: 'ball Green',
                    ItemNum: 'A22226',
                    ProductName: '电阻3',
                    BOMnum: '20',
                    AssembledQuantity: '3',
                    QuantityAssembled: '3',
                    Remark: '备注3'
                },
                {
                    BOMNO: 'A002',
                    state: '已启动',
                    statebg: 'ball Green',
                    ItemNum: 'A22227',
                    ProductName: '电阻4',
                    BOMnum: '20',
                    AssembledQuantity: '4',
                    QuantityAssembled: '4',
                    Remark: '备注4'
                }
            ]
        };
    },

    methods: {
        MaterialDetails_form_show(ItemNum) {
            this.MaterialDetails_form_openOff = true;
        },
        MaterialBox_form_show(ItemNum) {
            this.MaterialBox_form_openOff = true;
        },
        MaterialBox_form_close() {
            this.MaterialBox_form_openOff = false; //默认页面不显示为false
        },
         KanbanCallingMaterials_form_show() {
            this.KanbanCallingMaterials_form_openOff = true; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        KanbanCallingMaterials_form_close() {
            this.KanbanCallingMaterials_form_openOff = false; 
        },
        closeMySelf() {
            this.$emit('AssemblyExecutioning_form_close');
        },
       
        handleOpen(key, keyPath) {
            // alert(this.show); //展开事件
            if (this.show) {
                this.vheight = '680px';
                this.show = false;
            } else {
                this.vheight = '388px';
                this.show = true;
            }
        }
    
    },
    components: {
        //注册
        MaterialDetails_form,
        MaterialBox_form,
        KanbanCallingMaterials_form
    }
};
</script>
