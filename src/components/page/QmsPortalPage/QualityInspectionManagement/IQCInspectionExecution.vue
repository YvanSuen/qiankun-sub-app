<template>
    <div>
        <div>
            <div>
                <el-row>
                    <el-col :span="7">
                        <el-input
                            class="textLarge"
                            placeholder="请扫描料箱条码及指令码"
                            suffix-icon="iconfontNew iconNew-Recode red"
                            v-model="QRcode"
                        >
                        </el-input>
                    </el-col>
                    <el-col :span="10">
                        &nbsp;
                        <div style="color: red; margin-top: -8px">{{ errMes }}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="pull-right">
                            单据状态：<el-select v-model="DocumentStatus" placeholder="--请选择单据状态--">
                                <el-option v-for="item in sDsoptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div style="margin-top: 10px">
                <i class="el-icon-arrow-right header">IQC检验执行</i><i class="el-icon-arrow-right header">任务清单</i>

                <el-row :gutter="40" style="padding: 0px; margin: 0px; height: 750px; overflow-y: auto">
                    <el-col :span="6" v-for="(item, i) in todoList" :key="i">
                        <el-card :body-style="{ padding: '20px' }" style="margin-top: 10px">
                            <div style="border-bottom: solid 1px #dcdcdc; padding-bottom: 5px">
                                <span v-bind:class="item.color">{{ item.state }}</span> {{ item.fid }}
                            </div>
                            <div style="margin-top: 10px">
                                <div class="text item">物料编号：{{ item.code }}</div>
                                <div class="text item">物料名称：iISRHLOLELLE</div>
                                <div class="text item">规格型号：LC01-FB</div>
                                <div class="text item">批次号：20211109001</div>
                                <div class="text item">采购订单号：PO10023-001</div>
                                <div class="text item">ASN单号：201101001</div>
                                <div class="text item">供应商代码：0001 山东东营线材</div>
                                <div class="text item">到货数量：100</div>
                                <div class="text item">抽检数量：10</div>
                                <div class="text item">所在料箱：WZ0001</div>
                                <div class="text-right">
                                    <el-button class="btn-phoenix" type="primary" @click="IQCInspectionExecutioning_form_show(item.code)"
                                        >执行</el-button
                                    >
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 弹出框 -->
        <el-dialog
            title
            :visible.sync="IQCInspectionExecutioning_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
        >
            <prop_form  @IQCInspectionExecutioning_form_close="IQCInspectionExecutioning_form_close"></prop_form>
        </el-dialog>
    </div>
</template>
<script>
import prop_form from '@/components/page/QmsPortalPage/QualityInspectionManagement/IQCInspectionExecutioning.vue';

export default {
    data() {
        return {
            DocumentStatus: '',
            sDsoptions: [
                {
                    value: '未检验',
                    label: '未检验'
                },
                {
                    value: '检验中',
                    label: '检验中'
                },
                {
                    value: '已完成',
                    label: '已完成'
                }
            ],
            IQCInspectionExecutioning_form_openOff: false,
            QRcode: '',
            errMes: '异常信息：F检验任务不存在，请重新扫描！',
            todoList: [
                {
                    fid: 'IQC202100102',
                    code: '89145001',
                    state: '检验中',
                    color: 'state Purple'
                },
                {
                    fid: 'IQC202100102',
                    code: '89145002',
                    state: '未检验',
                    color: 'state Silver'
                },
                {
                    fid: 'IQC202100102',
                    code: '89145003',
                    state: '未检验',
                    color: 'state Silver'
                },
                {
                    fid: 'IQC202100102',
                    code: '89145004',
                    state: '检验中',
                    color: 'state Purple'
                },
                {
                    fid: 'IQC202100102',
                    code: '89145004',
                    state: '检验中',
                    color: 'state Purple'
                },
                {
                    fid: 'IQC202100102',
                    code: '89145004',
                    state: '已完成',
                    color: 'state Green'
                }
            ],
          
        };
    },
    computed: {},
    methods: {
        IQCInspectionExecutioning_form_show(key) {
            this.IQCInspectionExecutioning_form_openOff = true; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        IQCInspectionExecutioning_form_close() {
            this.IQCInspectionExecutioning_form_openOff = false; //默认页面不显示为false,点击按钮将这个属性变成true
        }
    },
    mounted: function () {
        //页面加载后时执行
        // bb();
    },
    components: {
        //注册
        prop_form
    }
};

export function bb() {
    let aa = localStorage.getItem('ms_username');
}
</script>
<style>
.text-right {
    text-align: right;
    margin-top: -30px;
}
</style>