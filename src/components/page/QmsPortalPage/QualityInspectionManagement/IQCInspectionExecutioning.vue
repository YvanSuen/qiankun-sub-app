<template>
    <div>
        <div class="headbar">
            IQC检验执行
            <span class="pull-right" @click="closeMySelf"
                ><i class="el-icon-error" style="font-size: 26px; margin-top: 6px"></i
            ></span>
        </div>
        <div class="body">
            <div>
                <el-form ref="form" :model="params" label-width="80px">
                    <el-row class="text">
                        <el-col :span="6">检验单号：{{ params.iInspectionNo }}</el-col>
                        <el-col :span="6">采购订单号：{{ params.iPurchaseorderNo }}</el-col>
                        <el-col :span="6">检验方式：{{ params.sInspectionmethod }} </el-col>
                        <el-col :span="6">批次编码：20210513001</el-col>
                    </el-row>
                    <el-row class="text">
                        <el-col :span="6">物料编码：2021051</el-col>
                        <el-col :span="6">物&nbsp;料&nbsp;名&nbsp;称：继电器</el-col>
                        <el-col :span="6">规格型号：LC01-1# </el-col>

                        <el-col :span="6"></el-col>
                    </el-row>
                    <el-row class="text">
                        <el-col :span="6">到货数量：200</el-col>
                        <el-col :span="6"
                            >检&nbsp;验&nbsp;数&nbsp;量：<el-input
                                v-model="params.iinumnum"
                                style="width: 200px"
                                placeholder="请输入内容"
                            ></el-input
                        ></el-col>
                        <el-col :span="6"
                            >结果判定：<el-select v-model="params.sResult" placeholder="--请选择判定结果--" style="width: 200px">
                                <el-option v-for="item in sRopRtions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option> </el-select
                        ></el-col>
                    </el-row>
                    <div class="pull-right" style="top: 90px; right: 20px">
                        <!-- <el-button type="success" @click="closeMySelf"><i class="el-icon-circle-close"></i><br />关闭</el-button> -->
                        <el-button type="success"><i class="el-icon-document"></i><br />保存</el-button>
                        <el-button type="success"><i class="el-icon-circle-check"></i><br />提交</el-button>
                    </div>
                </el-form>
            </div>
            <div class="collapse">
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item title="检验项目 >尺寸检查" name="1">
                        <table style="width: 100%" class="text">
                            <tr>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 40px; text-align: center">1、</td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    检验内容：横向尺寸<br />
                                    项目类型：定量<br />
                                    检验标准：符合尺寸要求<br />
                                </td>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 160px">
                                    <el-button type="primary" @click="Defectinformation_form_show"><i class="el-icon-document"></i><br />缺陷</el-button>
                                    <el-button type="danger" @click="Inspectionitemrecord_form_show" ><i class="el-icon-document"></i><br />NG</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-bottom: dotted 1px #dcdcdc; text-align: center">2、</td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    检验内容：横向尺寸<br />
                                    项目类型：定量<br />
                                    检验标准：符合尺寸要求<br />
                                </td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    <el-button type="primary"><i class="el-icon-document"></i><br />缺陷</el-button>
                                    <el-button type="primary" @click="Inspectionitemrecord_form_show"><i class="el-icon-document"></i><br />未检</el-button>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-bottom: dotted 1px #dcdcdc; text-align: center">3、</td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    检验内容：横向尺寸<br />
                                    项目类型：定量<br />
                                    检验标准：符合尺寸要求<br />
                                </td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    <el-button type="primary"><i class="el-icon-document"></i><br />缺陷</el-button>
                                    <el-button type="primary" @click="Inspectionitemrecord_form_show"><i class="el-icon-document"></i><br />未检</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-collapse-item>
                    <el-collapse-item title="检验项目 >外观检查" name="2">
                        <table style="width: 100%" class="text">
                            <tr>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 40px; text-align: center">4、</td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    检验内容：表面油污检查<br />
                                    项目类型：定性<br />
                                    检验标准：物料编码无油污<br />
                                </td>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 160px">
                                    <el-button type="primary"><i class="el-icon-document"></i><br />缺陷</el-button>
                                    <el-button type="success" ><i class="el-icon-document"></i><br />OK</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-collapse-item>
                    <el-collapse-item title="检验项目 >重量检查" name="3">
                        <table style="width: 100%" class="text">
                            <tr>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 40px; text-align: center">5、</td>
                                <td style="border-bottom: dotted 1px #dcdcdc">
                                    检验内容：称重计量<br />
                                    检验标准：单个重量符合要求<br />
                                </td>
                                <td style="border-bottom: dotted 1px #dcdcdc; width: 160px">
                                    <el-button type="primary"><i class="el-icon-document"></i><br />缺陷</el-button>
                                    <el-button type="success"><i class="el-icon-document"></i><br />已检</el-button>
                                </td>
                            </tr>
                        </table>
                    </el-collapse-item>
                    <el-collapse-item title="缺陷信息" name="4">
                        <el-table
                            :data="zpData"
                            border
                            height="220px"
                            :header-cell-style="{ textAlign: 'center' }"
                            :default-sort="{ prop: 'errcode', order: 'descending' }"
                        >
                            <el-table-column prop="index" label="序号" width="75px"> </el-table-column>
                            <el-table-column prop="code" label="缺陷编码" sortable> </el-table-column>
                            <el-table-column prop="type" label="缺陷类型" sortable> </el-table-column>
                            <el-table-column prop="num" label="数量" sortable> </el-table-column>
                            <el-table-column prop="reason" label="缺陷原因" sortable> </el-table-column>
                        </el-table>
                    </el-collapse-item>
                    <el-collapse-item title="评审确认" name="0">
                        <div style="padding: 10px">
                            <el-row class="text">
                                <el-col :span="8">评审意见：{{ params.iInspectionNo }}</el-col>
                                <el-col :span="16">评&nbsp;审&nbsp;说&nbsp;明：{{ params.iPurchaseorderNo }}</el-col>
                            </el-row>
                            <el-row class="text">
                                <el-col :span="8"
                                    >合格数量：<el-input v-model="params.iinumnum" style="width: 200px" placeholder="请输入内容"></el-input
                                ></el-col>
                                <el-col :span="8"
                                    >不合格数量：<el-input
                                        v-model="params.iinumnum"
                                        style="width: 200px"
                                        placeholder="请输入内容"
                                    ></el-input
                                ></el-col>
                                <el-col :span="8"
                                    >处理完成：<el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"> </el-switch
                                ></el-col>
                            </el-row>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
           <!-- 弹出框 -->
        <el-dialog
            title
            v-if="Inspectionitemrecord_form_openOff"
            :visible.sync="Inspectionitemrecord_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
           
        >
            <Inspectionitemrecord_form :Num="Number(params.iinumnum)"  @Inspectionitemrecord_form_close="Inspectionitemrecord_form_close"></Inspectionitemrecord_form>
        </el-dialog>
        <el-dialog
            title
            v-if="Defectinformation_form_openOff"
            :visible.sync="Defectinformation_form_openOff"
            center
            :append-to-body="true"
            :lock-scroll="false"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            class="openpage"
        >
          <Defectinformation_form   @Defectinformation_form_close="Defectinformation_form_close"></Defectinformation_form>
        </el-dialog>
    </div>
</template>
<script>
import Inspectionitemrecord_form from '@/components/page/QmsPortalPage/QualityInspectionManagement/InspectionitemRecord.vue';
import Defectinformation_form from '@/components/page/QmsPortalPage/QualityInspectionManagement/Defectinformation.vue';
export default {
    data() {
        return {
            activeNames: ['0', '1'],
            Inspectionitemrecord_form_openOff: false,
            Defectinformation_form_openOff: false,
            params: {
                iInspectionNo: 'IQC202100101',
                iPurchaseorderNo: '112105210001',
                sInspectionmethod: '抽检',
                sResult: '合格',
                iinumnum: '50'
            },
            value2: true,
            sRopRtions: [
                {
                    value: '未检验',
                    label: '未检验'
                },
                {
                    value: '合格',
                    label: '合格'
                },
                {
                    value: '不合格',
                    label: '不合格'
                }
            ],
            zpData: [
                {
                    index: '1',
                    code: 'C0001',
                    type: '尺寸偏大',
                    num: '3',
                    reason: '图纸问题'
                },
                {
                    index: '2',
                    code: 'C0002',
                    type: '尺寸偏大',
                    num: '2',
                    reason: '图纸问题'
                },
                {
                    index: '3',
                    code: 'C0003',
                    type: '尺寸偏大',
                    num: '5',
                    reason: '图纸问题'
                },
                {
                    index: '4',
                    code: 'C0003',
                    type: '尺寸偏大',
                    num: '5',
                    reason: '图纸问题'
                }
            ]
        };
    },
    computed: {},
    methods: {
        Defectinformation_form_show() {
            this.Defectinformation_form_openOff = true; //默认页面不显示为false,点击按钮将这个属性变成true
        }
        ,
        Defectinformation_form_close() {
            this.Defectinformation_form_openOff = false; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        Inspectionitemrecord_form_show() {
            this.Inspectionitemrecord_form_openOff = true; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        Inspectionitemrecord_form_close() {
            this.Inspectionitemrecord_form_openOff = false; //默认页面不显示为false,点击按钮将这个属性变成true
        },
        closeMySelf() {
            this.$emit('IQCInspectionExecutioning_form_close');
        },
        handleChange(val) {
            console.log(val);
        }
    },
    mounted: function () {
        //页面加载后时执行
        // bb();
    },
    components: {Inspectionitemrecord_form,Defectinformation_form}
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