<template>
    <el-dialog
        :visible.sync="visible"
        width="600px"
        @close="OnClose()"
        :close-on-click-modal="false"
    >
        <h2 class="headerNotice">
            <i class="el-icon-thirdkucun"></i>
            <span>添加/编辑公告信息</span>
        </h2>

        <div style="height:340px; margin-left: 50px; margin-top: 30px;">
            <el-form ref="domainValidateForm" :model="NoticeForm"  status-icon>
                <el-form-item label="公告标题:" class="blue">
                    <el-input v-model="NoticeForm.titel" class="handle-input-edit"></el-input>
                </el-form-item>
                <el-form-item label="公告类型:" class="blue">
                    <el-select v-model="NoticeForm.NoticeType" class="handle-input-edit">
                        <el-option
                            v-for="item in SettingDrowDown"
                            :key="item.SettingNumber"
                            :label="item.SettingValue"
                            :value="item.SettingNumber"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="时间范围:" class="blue">
                    <el-date-picker
                        is-range
                        v-model="NoticeForm.datatime"
                           value-format="yyyy-MM-dd"   
                        range-separator="-"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        placeholder="选择时间范围"
                        class="mr10"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="公告附件:">
                    <fileupload
                        ref="myFileUpload"
                     
                        @fatherMethodFileupLoad="fatherMethodFileupLoad"
                        @fatherMethodFileupLoadDel="fatherMethodFileupLoadDel"
                    ></fileupload>
                </el-form-item>
                <el-form-item label="公告内容:" class="blue">
                    <el-input
                        type="textarea"
                        :rows="3"
                        v-model="NoticeForm.desc"
                        style="  width: 280px;"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="bottom">
            <el-button @click="OnClose">取 消</el-button>
            <el-button type="primary" @click="OnSubmit(NoticeForm)">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import fileupload from '../../publicAssembly/fileuploadAssembly';
import { showLoading, hideLoading } from '../../../../assets/js/loading';
export default {
    name: 'NoticeDialog',
    components: { fileupload: fileupload },
    props: {
        show: { type: Boolean, default: false } // 弹框可见标志
    },
    data() {
        return {
            // 弹框可见否标记
            visible: this.show,
            NoticeForm: {
                titel: '',
                datatime: [],
                NoticeType: '',
                desc: ''
            },
            SettingDrowDown: {}, //公告类型下拉
            fileName: '',
            fileUrl: '',
            editFlag: 1, //1标识新增 2标识修改
            Rank:""
        };
    },
    watch: {
        // 监听show,visible 随着show变化而变化
        show: {
            immediate: true,
            handler(show) {
                this.visible = show;
            }
        }
    },

    methods: {
        // 关闭弹框
        OnClose() {
            //this.NoticeForm = [];
            this.ClearInput();
            this.$refs.myFileUpload.ClearInput();
            this.$emit('update:show', false); // 子组件更新弹框隐藏
            this.ClearInput();
        },
        // 提交表单
        OnSubmit() {
         
            if (this.NoticeForm.titel == '' || this.NoticeForm.titel == undefined) {
                this.$message.error('公告标题不允许为空');
                return false;
            } else if (this.NoticeForm.desc == '' || this.NoticeForm.desc == undefined) {
                this.$message.error('公告内容不允许为空');
                return false;
            } else {
                if (this.editFlag == 1) {
                    let params = new URLSearchParams();

                    let jsonData = JSON.stringify({
                        NoticeType: this.NoticeForm.NoticeType,
                        Title: this.NoticeForm.titel,
                        Describe: this.NoticeForm.desc,
                        AttName: this.fileName,
                        AttUrl: this.fileUrl,
                        StartDate: this.NoticeForm.datatime[0],
                        ExpireDate: this.NoticeForm.datatime[1],
                        CreateUser: localStorage.getItem('ms_username'),
                        CreateDate: new Date()
                    });
                    params.append('json', jsonData);

                    let json = JSON.stringify({
                       
                         IPAdd:  localStorage.getItem('IPAdd'),
                        HostName:  localStorage.getItem('HostName'),
                        MenuName: '通知公告管理',
                        ObjectName: 'CreatSysNotice',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation: '〔添加〕通知公告：' + this.NoticeForm.titel
                    });
                    params.append('Logjson', json);
                    showLoading();
                    axios.post(BaseWebApiUrl + '/SysNotice/CreatSysNotice', params).then((res) => {
                        hideLoading();
                        if (res.data.returnCode == '1') {
                            this.$message.success("保存成功");
                            this.ClearInput();
                            this.$emit('addNewDomain', this.NoticeForm);
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                } else {
                    let params = new URLSearchParams();

                    let jsonData = JSON.stringify({
                        Rank:this.Rank,
                        NoticeType: this.NoticeForm.NoticeType,
                        Title: this.NoticeForm.titel,
                        Describe: this.NoticeForm.desc,
                        AttName: this.fileName,
                        AttUrl: this.fileUrl,
                        StartDate: this.NoticeForm.datatime[0],
                        ExpireDate: this.NoticeForm.datatime[1],
                        CreateUser: localStorage.getItem('ms_username'),
                        CreateDate: new Date()
                    });
                    params.append('json', jsonData);

                    let json = JSON.stringify({
                       IPAdd:  localStorage.getItem('IPAdd'),
                        HostName:  localStorage.getItem('HostName'),
                        HostType: '0',
                        MenuName: '通知公告管理',
                        ObjectName: 'UpdateSysNotice',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation: '〔编辑〕通知公告：' + this.NoticeForm.titel
                    });
                    params.append('Logjson', json);
showLoading();
                    axios.post(BaseWebApiUrl + '/SysNotice/UpdateSysNotice', params).then((res) => {
                        hideLoading();
                        if (res.data.returnCode == '1') {
                            this.$message.success("修改成功");
                            this.ClearInput();
                            this.$emit('addNewDomain', this.NoticeForm);
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                }
            }
        },
        addNotice() {
            let params = new URLSearchParams();
            params.append('strWhere', "SettingKey='NoticeType'");
            axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingDrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.NoticeForm.NoticeType = data[0]['SettingNumber'];
                    this.SettingDrowDown = data;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
            this.getPassYearFormatDate();
            this.$nextTick(() => {
                this.$refs.myFileUpload.ClearInput();
            });
        },
        editNotice(selectedRow) {
            this.editFlag = 2;
            let params = new URLSearchParams();
            this.NoticeForm.datatime = [selectedRow.StartDate, selectedRow.ExpireDate];
            this.NoticeForm.titel = selectedRow.Title;
            this.NoticeForm.desc = selectedRow.Describe;
            this.fileUrl = selectedRow.AttUrl;
            this.fileName = selectedRow.AttName;
            this.Rank=selectedRow.Rank;
            params.append('strWhere', "SettingKey='NoticeType'");
            axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingDrowDownList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let data = JSON.parse(res.data.returnData);
                    this.SettingDrowDown = data;
                    this.NoticeForm.NoticeType = selectedRow.NoticeType;
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });

            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.myFileUpload.SetInput(selectedRow.AttUrl, selectedRow.AttName);
                }, 10);
            });
        },
        getPassYearFormatDate() {
            var nowDate = new Date();
            var date = new Date(nowDate);
            date.setDate(date.getDate() - 30);
            var seperator1 = '-';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            var formatDate = year + seperator1 + month + seperator1 + strDate;
            this.getNowFormatDate(formatDate);
        },
        /* 获取现在时间，并接受过去时间的值 */
        getNowFormatDate(formatDate) {
            var date = new Date();
            var seperator1 = '-';
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = '0' + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate;
            }
            var nowData = year + seperator1 + month + seperator1 + strDate;
            this.NoticeForm.datatime = [formatDate, nowData]; // 默认赋值一年时间
        },
        fatherMethodFileupLoad  (url,name) {
              this.fileUrl =url;
            this.fileName =name;
        }
        ,
        fatherMethodFileupLoadDel  () {
            this.fileUrl = '';
            this.fileName = '';
        }
        ,
        ClearInput() {
            this.NoticeForm.titel = '';
            this.fileUrl = '';
            this.fileName = '';
            this.NoticeForm.desc = '';
            this.Rank="";
        }
    }
};
</script>
<style scoped>
.blue {
    color: blue !important;
}
.headerNotice {
    height: 40px;
    margin-bottom: 5px;
    border-bottom: 1px solid #d5e3ef;
    font-size: 16px;
    color: #44bbbb;
}
</style>
 