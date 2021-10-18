<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-thirdkucun"></i> 工厂日历设置
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select
                    v-model="query.workshop"
                    class="handle-select mr10"
                    @change="selectChanged"
                >
                    <el-option key="0" label="--所属车间--" value="0"></el-option>
                    <el-option
                        v-for="item in workshopList
"
                        :key="item.FactoryModelCode"
                        :label="item.FactoryModelName"
                        :value="item.FactoryModelCode"
                    ></el-option>
                </el-select>
                <el-select v-model="query.line" class="handle-select mr10">
                    <el-option key="0" label="--所属线体--" value="0"></el-option>
                    <el-option
                        v-for="item in lineList
"
                        :key="item.FactoryModelCode"
                        :label="item.FactoryModelName"
                        :value="item.FactoryModelCode"
                    ></el-option>
                </el-select>

                <el-select v-model="query.CalendarType" class="handle-select mr10">
                    <el-option
                        key="CalendarType:CalendarProduction"
                        label="生产日历"
                        value="CalendarType:CalendarProduction"
                    ></el-option>
                    <el-option
                        key="CalendarType:CalendarDev"
                        label="设备日历"
                        value="CalendarType:CalendarDev"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handlQuery">搜索</el-button>
            </div>
            <div class="handle-box" style="float:right;margin-right: 5px;">
                <el-button
                    type="primary"
                    icon="el-icon-thirdiconfontunie042"
                    @click="handleAdd"
                >新增班次</el-button>
            </div>

            <div class="handle-box" style="float:right; margin-right: 5px;">
                <el-button type="primary" icon="el-icon-thirdbtn-add" @click="handleGenerate">生成班次</el-button>
            </div>
            <div class="handle-box" style="float:right; margin-right: 5px;">
                <el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDelete">删除班次</el-button>
            </div>
            <div class="handle-box" style="float:right;margin-right: 5px;">
                <el-button type="primary" icon="el-icon-thirdbtntrash" @click="handleDeletAll">清空班次</el-button>
            </div>
            <el-calendar id="calendar" v-model="value">
                <template slot="dateCell" slot-scope="{ data}">
                    <div
                        class="data.isSelected ? 'is-selected' : ''"
                    >{{ data.day.split('-').slice(2).join('-') }}</div>

                    <div v-for="item in Calendar" :key="item.id">
                        <div
                            v-if="(item.start>=data.day+' 00:00:00') && (item.start<=data.day+' 23:59:59') "
                        >
                            <div class="fc-day-grid-event">
                                <div
                                    id="divColor"
                                    @click="handleEventClick(item.id,item.title)"
                                    class="divCalendar"
                                >{{ data.isSelected && item.id==selectedid ? '✔️' : ''}} {{item.title}}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-calendar>
        </div>

        <el-dialog :visible.sync="editVisible" width="620px" :close-on-click-modal="false">
            <h2 class="headert">
                <i class="el-icon-thirdkucun"></i>
                <span>生成工厂日历</span>
            </h2>

            <div style="height:380px;  margin-top: 30px; margin-left: 50px;">
                <el-form ref="domainValidateForm" status-icon>
                    <el-form-item class="blue">
                        <label slot="label">车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
                        <el-select
                            v-model="calendarGenerate.workshop"
                            class="handle-select mr10"
                            @change="selectChangedGenerate"
                        >
                            <el-option key="0" label="--所属车间--" value="0"></el-option>
                            <el-option
                                v-for="item in workshopListGenerate"
                                :key="item.FactoryModelCode"
                                :label="item.FactoryModelName"
                                :value="item.FactoryModelCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <label slot="label">线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;体:</label>
                        <el-select v-model="calendarGenerate.line" class="handle-select mr10">
                            <el-option key="0" label="--所属线体--" value="0"></el-option>
                            <el-option
                                v-for="item in lineListGenerate"
                                :key="item.FactoryModelCode"
                                :label="item.FactoryModelName"
                                :value="item.FactoryModelCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="blue">
                        <label slot="label">模&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;板:</label>
                        <el-select v-model="calendarGenerate.model" class="handle-select mr10">
                            <el-option key="0" label="--模板--" value="0"></el-option>
                            <el-option
                                v-for="item in modelGenerateList
"
                                :key="item.CalendarModeID"
                                :label="item.CalendarModeName"
                                :value="item.CalendarModeID"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="blue">
                        <label slot="label">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型:</label>
                        <el-select
                            v-model="calendarGenerate.CalendarType"
                            class="handle-select mr10"
                        >
                            <el-option
                                key="CalendarType:CalendarProduction"
                                label="生产日历"
                                value="CalendarType:CalendarProduction"
                            ></el-option>
                            <el-option
                                key="CalendarType:CalendarDev"
                                label="设备日历"
                                value="CalendarType:CalendarDev"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间:" class="blue">
                        <el-date-picker
                            v-model="calendarGenerate.beginTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间:" class="blue">
                        <el-date-picker
                            v-model="calendarGenerate.endTime"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item label="备注说明:">
                        <el-input
                            type="textarea"
                            :rows="4"
                            v-model="calendarGenerate.remark"
                            style="width: 400px;"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="bottom">
                <el-button @click="OnClose">关闭</el-button>
                <el-button type="primary" @click="Generate">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="editVisibleAdd" width="770px" :close-on-click-modal="false">
            <h2 class="headert">
                <i class="el-icon-thirdkucun"></i>
                <span>新增工厂日历</span>
            </h2>

            <div style="height:370px;  margin-top: 30px;  ">
                <el-form ref="domainValidateForm" status-icon>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item class="blue">
                                <label
                                    slot="label"
                                >车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间:</label>
                                <el-select
                                    v-model="calendarAdd.workshop"
                                    class="handle-select mr10"
                                    @change="selectChangedAdd"
                                >
                                    <el-option key="0" label="--所属车间--" value="0"></el-option>
                                    <el-option
                                        v-for="item in workshopListAdd"
                                        :key="item.FactoryModelCode"
                                        :label="item.FactoryModelName"
                                        :value="item.FactoryModelCode"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item>
                                <label
                                    slot="label"
                                >线&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;体:</label>
                                <el-select v-model="calendarAdd.line" class="handle-select mr10">
                                    <el-option key="0" label="--所属线体--" value="0"></el-option>
                                    <el-option
                                        v-for="item in lineListAdd"
                                        :key="item.FactoryModelCode"
                                        :label="item.FactoryModelName"
                                        :value="item.FactoryModelCode"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item class="blue">
                                <label
                                    slot="label"
                                >类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型:</label>
                                <el-select
                                    v-model="calendarAdd.CalendarType"
                                    class="handle-select mr10"
                                >
                                    <el-option
                                        key="CalendarType:CalendarProduction"
                                        label="生产日历"
                                        value="CalendarType:CalendarProduction"
                                    ></el-option>
                                    <el-option
                                        key="CalendarType:CalendarDev"
                                        label="设备日历"
                                        value="CalendarType:CalendarDev"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="班次名称:" class="blue">
                                <el-input v-model="calendarAdd.ClassName" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item class="blue">
                                <label
                                    slot="label"
                                >日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:</label>
                                <el-date-picker
                                    v-model="calendarAdd.datetime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item class="blue">
                                <label slot="label">开始时间:</label>
                                <el-time-select
                                    v-model="calendarAdd.begintime"
                                    :picker-options="{
                                start:'00:00',
                                step:'00:10',
                                end:'23:59',
                            }"
                                    placeholder="选择时间"
                                ></el-time-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="开始于前一天:">
                                <el-switch
                                    v-model="calendarAdd.BegingdefaultValue"
                                    active-text="Y"
                                    inactive-text="N"
                                    inactive-color="#BFBFBF"
                                    active-value="1"
                                    inactive-value="0"
                                    class="switch"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item class="blue">
                                <label slot="label">结束时间:</label>
                                <el-time-select
                                    v-model="calendarAdd.endtime"
                                    :picker-options="{
                                start:'00:00',
                                step:'00:10',
                                end:'23:59',
                            }"
                                    placeholder="选择时间"
                                ></el-time-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结束与后一天:">
                                <el-switch
                                    v-model="calendarAdd.enddefaultValue"
                                    active-text="Y"
                                    inactive-text="N"
                                    inactive-color="#BFBFBF"
                                    active-value="1"
                                    inactive-value="0"
                                    class="switch"
                                ></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="计划投入:" class="blue">
                                <el-input v-model="calendarAdd.in"  type="number" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="计划产出:" class="blue">
                                <el-input v-model="calendarAdd.out"  type="number" class="handle-input mr10"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="备注说明:">
                                <el-input
                                    type="textarea"
                                    :rows="4"
                                    v-model="calendarAdd.remark"
                                    style="width: 400px;"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="bottom">
                <el-button @click="addOnClose">关闭</el-button>
                <el-button type="primary" @click="addSave">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>



<script>
import axios from 'axios';
import { showLoading, hideLoading } from '../../../../assets/js/loading';
export default {
    name: 'Calendar',
    components: {},
    data: function () {
        return {
            query: {
                workshop: '0',
                line: '0',
                CalendarType: 'CalendarType:CalendarProduction'
            },
            calendarGenerate: {
                workshop: '0',
                line: '0',
                CalendarType: 'CalendarType:CalendarProduction',
                model: '0',
                beginTime: '',
                endTime: '',
                remark: ''
            },
            calendarAdd: {
                workshop: '0',
                CalendarType: 'CalendarType:CalendarProduction',
                ClassName: '',
                datetime: '',
                begintime: '',
                BegingdefaultValue: '0',
                endtime: '',
                enddefaultValue: '0',
                remark: '',
                in: '0',
                out: '0'
            },
            Calendar: [],
            calendarEvents: [],
            dialogFormVisible: false,
            workshopList: [],
            workshopListGenerate: [],
            lineList: [],
            modelGenerateList: [],
            lineListGenerate: [],
            loading: false,
            value: new Date(),
            selectedid: '',
            selectedtitle: '',
            editVisible: false,
            editVisibleAdd: false,
            workshopListAdd: [],
            lineListAdd: []
        };
    },
    mounted() {
        this.loading = true;
        // this.getCalendar();
        this.initDrowlist();
        this.initDrowlistModel();
        this.$nextTick(() => {
            // 点击前一个月
            let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)');
            prevBtn.addEventListener('click', () => {
                this.getCalendar();
            });
        });
        this.$nextTick(() => {
            // 点击今天按钮
            let prevBtntaday = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)');
            prevBtntaday.addEventListener('click', () => {
                this.getCalendar();
            });
        });
        this.$nextTick(() => {
            // 点击后一个月
            let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:last-child');
            prevBtn.addEventListener('click', () => {
                this.getCalendar();
            });
        });
    },
    methods: {
        handlQuery() {
            this.getCalendar();
        },
        handleGenerate() {
            this.editVisible = true;
        },
        handleAdd() {
            this.editVisibleAdd = true;
        },

        getCalendar() {
            let params = new URLSearchParams();
            if (this.query.workshop == '' || this.query.workshop == undefined || this.query.workshop == '0') {
                this.$message.error('请选择所属车间');
                return false;
            }
            var strWhere = '1=1';
            strWhere = strWhere + " and  AREACode='" + this.query.workshop + "'";
            if (this.query.line != '' && this.query.workshop != undefined && this.query.workshop != '1') {
                strWhere = strWhere + " and  CELLCode='" + this.query.line + "'";
            }
            strWhere = strWhere + " and  CalendarType='" + this.query.CalendarType + "'";
            strWhere = strWhere + " and  CONVERT(varchar(7), CalendarDay, 120) = N'" + this.GetDate() + "'";
            params.append('strWhere', strWhere);
            showLoading();
            axios.post(BaseWebApiUrl + '/SysCalendarProductionSub/QueryCalendarListInfo', params).then((res) => {
                hideLoading();
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.Calendar = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        ToDate(tim) {
            //时间处理
            const d = new Date(tim);
            d.setHours(0, 0, 0, 0);
            return (tim = d.setHours(0, 0, 0, 0));
        },
        load() {
            //刷新数据的方法，重新查询一遍数据也可
        },
        // 新增

        handleEventClick(id, title) {
            this.selectedid = id;
            this.selectedtitle = title;
        },
        selectChanged(value) {
            this.initDrowlistLine(value);
        },
        selectChangedGenerate(value) {
            this.initDrowlistLineGenerate(value);
        },
        selectChangedAdd(value) {
            this.initDrowlistLineAdd(value);
        },
        initDrowlistModel() {
            let params = new URLSearchParams();
            params.append('strWhere', ' 1=1');
            axios.post(BaseWebApiUrl + '/CalendarMode/QueryCalendarModelDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.modelGenerateList = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },

        initDrowlist() {
            let params = new URLSearchParams();
            params.append('strWhere', " LayType ='AREA' AND PersonCode='" + localStorage.getItem('ms_username') + "'");
            axios.post(BaseWebApiUrl + '/SysFactory/QueryFactoryAREADrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.workshopList = data;
                    this.workshopListGenerate = data;
                    this.workshopListAdd = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        initDrowlistLine(FactoryModelCode) {
            let params = new URLSearchParams();
            params.append('strWhere', " AreaCode='" + FactoryModelCode + "' and CellCode<>'' and layType='CELL'  order by nPath");
            axios.post(BaseWebApiUrl + '/SysFactory/QueryFactoryCellDrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.calendarGenerate.line = '0';
                    this.lineList = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        initDrowlistLineGenerate(FactoryModelCode) {
            let params = new URLSearchParams();
            params.append('strWhere', " AreaCode='" + FactoryModelCode + "' and CellCode<>'' and layType='CELL'  order by nPath");
            axios.post(BaseWebApiUrl + '/SysFactory/QueryFactoryCellDrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.calendarGenerate.line = '0';
                    this.lineListGenerate = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        initDrowlistLineAdd(FactoryModelCode) {
            let params = new URLSearchParams();
            params.append('strWhere', " AreaCode='" + FactoryModelCode + "' and CellCode<>'' and layType='CELL'  order by nPath");
            axios.post(BaseWebApiUrl + '/SysFactory/QueryFactoryCellDrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.calendarAdd.line = '0';
                    this.lineListAdd = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        handleDelete() {
            //  this.selectedid=id;
            //   this.selectedtitle=title; if (this.NoticeForm.titel == '' || this.NoticeForm.titel == undefined) {

            if (this.selectedid == '' || this.selectedid == undefined) {
                this.$message.error('选择要删除的班次');
                return false;
            }
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = new URLSearchParams();
                    var strWhere = " CalendarProductionSubID = '" + this.selectedid + "'";
                    params.append('strDel', strWhere);

                    let json = JSON.stringify({
                        IPAdd: localStorage.getItem('IPAdd'),
                        HostName: localStorage.getItem('HostName'),
                        MenuName: '工厂日历设置管理',
                        ObjectName: 'DeleteCalendar',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation: '〔删除〕工厂日历：' + this.selectedtitle
                    });
                    params.append('Logjson', json);

                    showLoading();
                    axios.post(BaseWebApiUrl + '/SysCalendarProductionSub/DeleteCalendar', params).then((res) => {
                        hideLoading();
                        if (res.data.returnCode == '1') {
                            this.$message.success('删除成功');
                            this.selectedid = '';
                            this.getCalendar();
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
                .catch(() => {});
        },
        handleDeletAll() {
            let params = new URLSearchParams();
            if (this.query.workshop == '' || this.query.workshop == undefined || this.query.workshop == '0') {
                this.$message.error('请选择所属车间');
                return false;
            }

            this.$confirm('确定要清除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = new URLSearchParams();
                    var strWhere = '';
                    if (this.query.line != '' && this.query.workshop != undefined && this.query.workshop != '1') {
                        strWhere =
                            " AREACode = '" +
                            this.query.workshop +
                            "' and CELLCode = '" +
                            this.query.line +
                            "' and CONVERT(varchar(7), CalendarDay, 120)='" +
                            this.GetDate() +
                            "' and  CalendarType='" +
                            this.query.CalendarType +
                            "'";
                    } else {
                        strWhere =
                            " AREACode = '" +
                            this.query.workshop +
                            "' and  CONVERT(varchar(7), CalendarDay, 120)='" +
                            this.GetDate() +
                            "' and  CalendarType='" +
                            this.query.CalendarType +
                            "'";
                    }

                    params.append('strDel', strWhere);

                    let json = JSON.stringify({
                        IPAdd: localStorage.getItem('IPAdd'),
                        HostName: localStorage.getItem('HostName'),
                        MenuName: '工厂日历设置管理',
                        ObjectName: 'DeleteCalendar',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation:
                            '〔删除〕工厂日历：' +
                            this.GetDate() +
                            ':' +
                            this.query.workshop +
                            ':' +
                            this.query.line +
                            ':' +
                            this.query.CalendarType
                    });
                    params.append('Logjson', json);

                    showLoading();
                    axios.post(BaseWebApiUrl + '/SysCalendarProductionSub/DeleteCalendarList', params).then((res) => {
                        hideLoading();
                        if (res.data.returnCode == '1') {
                            this.$message.success('删除成功');
                            this.getCalendar();
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
                .catch(() => {});
        },
        Generate() {
            if (
                this.calendarGenerate.workshop == '' ||
                this.calendarGenerate.workshop == undefined ||
                this.calendarGenerate.workshop == '0'
            ) {
                this.$message.error('请选择所属车间');
                return false;
            }
            if (this.calendarGenerate.model == '' || this.calendarGenerate.model == undefined || this.calendarGenerate.model == '0') {
                this.$message.error('请选择模板');
                return false;
            }
            if (this.calendarGenerate.beginTime == '' || this.calendarGenerate.beginTime == undefined) {
                this.$message.error('开始时间不允许为空');
                return false;
            }
            if (this.calendarGenerate.endTime == '' || this.calendarGenerate.endTime == undefined) {
                this.$message.error('结束时间不允许为空');
                return false;
            }
            let params = new URLSearchParams();

            params.append('beginTime', this.calendarGenerate.beginTime);
            params.append('endTime', this.calendarGenerate.endTime);
            params.append('CalendarType', this.calendarGenerate.CalendarType);
            params.append('AREACode', this.calendarGenerate.workshop);
            params.append('CELLCode', this.calendarGenerate.line);
            params.append('Modelid', this.calendarGenerate.model);
            params.append('Remark', this.calendarGenerate.remark);
            let json = JSON.stringify({
                IPAdd: localStorage.getItem('IPAdd'),
                HostName: localStorage.getItem('HostName'),
                MenuName: '工厂日历设置管理',
                ObjectName: 'GenerateCalendar',
                CreateUser: localStorage.getItem('ms_username'),
                Operation:
                    '〔生成〕工厂日历：' +
                    this.calendarGenerate.workshop +
                    ':' +
                    this.calendarGenerate.beginTime +
                    '-' +
                    this.calendarGenerate.endTime
            });
            params.append('Logjson', json);

            showLoading();
            axios.post(BaseWebApiUrl + '/SysCalendarProductionSub/GenerateCalendar', params).then((res) => {
                hideLoading();
                if (res.data.returnCode == '1') {
                    this.editVisible = false;
                    this.$message.success('生成成功');
                    this.getCalendar();
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },

        addSave() {
            if (this.calendarAdd.workshop == '' || this.calendarAdd.workshop == undefined || this.calendarAdd.workshop == '0') {
                this.$message.error('请选择所属车间');
                return false;
            }
            if (this.calendarAdd.ClassName == '' || this.calendarAdd.ClassName == undefined) {
                this.$message.error('班次名称不允许为空');
                return false;
            }
            if (this.calendarAdd.datetime == '' || this.calendarAdd.datetime == undefined) {
                this.$message.error('日期不允许为空');
                return false;
            }
            if (this.calendarAdd.begintime == '' || this.calendarAdd.begintime == undefined) {
                this.$message.error('开始时间不允许为空');
                return false;
            }
            if (this.calendarAdd.endtime == '' || this.calendarAdd.endtime == undefined) {
                this.$message.error('结束时间不允许为空');
                return false;
            }
            if (this.calendarAdd.in == '' || this.calendarAdd.in == undefined) {
                this.$message.error('计划投入不允许为空');
                return false;
            }
            if (this.calendarAdd.out == '' || this.calendarAdd.out == undefined) {
                this.$message.error('计划产出不允许为空');
                return false;
            }
            let params = new URLSearchParams();
            var temptimebegin = '';
            var temptimeend = '';
            if (this.calendarAdd.BegingdefaultValue == '1') {
                temptimebegin = this.addDate(this.calendarAdd.datetime, -1) + ' ' + this.calendarAdd.begintime;
            } else {
                temptimebegin = this.calendarAdd.datetime + ' ' + this.calendarAdd.begintime;
            }

            if (this.calendarAdd.enddefaultValue == '1') {
                temptimeend = this.addDate(this.calendarAdd.datetime, 1) + ' ' + this.calendarAdd.endtime;
            } else {
                temptimeend = this.calendarAdd.datetime + ' ' + this.calendarAdd.endtime;
            }

            let jsonData = JSON.stringify({
                CalendarDay:this.calendarAdd.datetime,
                CalendarType: this.calendarAdd.CalendarType,
                AREACode: this.calendarAdd.workshop,
                CELLCode: this.calendarAdd.line,
                CalendarClassName: this.calendarAdd.ClassName,
                Remark: this.calendarAdd.remark,
                begintime: temptimebegin,
                endtime: temptimeend,
                PlanInQty: this.calendarAdd.in,
                PlanOutQty: this.calendarAdd.out,
                Remark: this.calendarAdd.remark,

                CreateUser: localStorage.getItem('ms_username'),
                CreateDate: new Date(),
                ModifyUser: localStorage.getItem('ms_username'),
                ModifyDate: new Date()
            });
            params.append('json', jsonData);

            let json = JSON.stringify({
                IPAdd: localStorage.getItem('IPAdd'),
                HostName: localStorage.getItem('HostName'),
                MenuName: '工厂日历设置管理',
                ObjectName: 'CreatCalendar',
                CreateUser: localStorage.getItem('ms_username'),
                Operation: '〔新增〕工厂日历：' + this.calendarAdd.workshop + '-' + this.calendarAdd.datetime
            });
            params.append('Logjson', json);

            showLoading();
            axios.post(BaseWebApiUrl + '/SysCalendarProductionSub/CreatCalendar', params).then((res) => {
                hideLoading();
                if (res.data.returnCode == '1') {
                    this.editVisibleAdd = false;
                    this.$message.success('生成成功');
                    this.getCalendar();
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        // 关闭弹框
        OnClose() {
            //this.NoticeForm = [];
            this.editVisible = false;
        },
        addOnClose() {
            //this.NoticeForm = [];
            this.editVisibleAdd = false;
        },
        addDate(date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            var val = d.getFullYear() + '' + month + '' + day;
            return val;
        },
        GetDate() {
            var data01 = document.getElementsByClassName('el-calendar__title')[0].innerText;

            var splitData = data01.split(' ');
            var year = splitData[0];
            var month = '';
            switch (splitData[2]) {
                case '1':
                    month = '01';
                    break;
                case '2':
                    month = '02';
                    break;
                case '3':
                    month = '03';
                    break;
                case '4':
                    month = '04';
                    break;
                case '5':
                    month = '05';
                    break;
                case '6':
                    month = '06';
                    break;
                case '7':
                    month = '07';
                    break;
                case '8':
                    month = '08';
                    break;
                case '9':
                    month = '09';
                    break;
                case '10':
                    month = '10';
                    break;
                case '11':
                    month = '11';
                    break;
                case '12':
                    month = '12';
                    break;
                default:
                    month = '13';
            }

            return year + '-' + month;
            //一月 2021
        }
    }
};
</script>

<style scoped>
.handle-input {
    width: 210px;
    display: inline-block;
    text-align: center;
}
.divCalendar {
    background-color: #3a87ad;
    margin: 2px;
    padding-left: 5px;
}
.handle-select {
    width: 200px;
}

.calendar-day {
    text-align: center;
    color: #202535;
    line-height: 30px;
    font-size: 12px;
}
.is-selected {
    background-color: green;
    /* font-size: 10px;
        margin-top: 5px; */
}
.el-calendar-table .el-calendar-day {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    height: 150px;
}
.el-calendar-table .el-calendar-click {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    height: 100px;
}
.el-calendar-table thead th {
    padding: 6px 0;
    color: #606266;
    font-weight: normal;
    text-align: center;
}
/* #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
        content: '当月';
    } */
.el-calendar-table:not(.is-range) td.next,
.el-calendar-table:not(.is-range) td.prev {
    opacity: 0.7;
}
.calendar-day,
.is-selected {
    color: white;
}

.fc-day-grid-event {
    margin: 1px 2px 0;
    padding: 0 1px;
}
.fc-event {
    position: relative;
    display: block;
    font-size: 0.85em;
    line-height: 1.2;
    border-radius: 3px;
    color: black;
}
.fc-event,
#fc-eventone {
    border: 1px solid LightBLue;
    background-color: LightBLue;
}
.fc-event,
#fc-eventtwo {
    border: 1px solid PeachPuff;
    background-color: PeachPuff;
}
.headert {
    height: 40px;
    margin-bottom: 5px;
    border-bottom: 1px solid #d5e3ef;
    font-size: 16px;
    color: #44bbbb;
}
</style>
