<template>
  <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="1150px" @close="OnClose()">
     <h2 class="headerNotice">
        <i class="el-icon-thirdkucun"></i>
        <span v-if="this.form.DevID === undefined || this.form.DevID === ''">添加设备台账</span><span v-else-if="this.type == 'Edit'">编辑设备台账</span><span v-else>查看设备台账</span>
    </h2>
    <div style="height:485px; margin-top: 10px;">
        <el-form ref="form" :model="form">
            <el-form-item>
                <el-input v-model="form.ImageUrl" v-if=false></el-input>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="设备编码：" class="blue">
                                <el-input v-model="form.DevCode" class="handle-input-edit" v-bind:disabled="diasabledInput"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备名称：" class="blue">
                                <el-input v-model="form.DevName" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号：">
                                <el-input v-model="form.DevModel" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="设备类型：">
                                <selectTreeCategory  ref="selectTreeCategory" v-model="form.CategoryCode" value="form.CategoryCode" width="200" :props="defaultProps" placeholder="--设备类型--"></selectTreeCategory>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计量单位：">
                                <el-select v-model="form.DevUom" placeholder="--请选择--" style="width:200px">
                                    <el-option v-for="item in DevUomOptions"
                                        :label="item.SettingValue"
                                        :key="item.SettingValue"
                                        :value="item.SettingValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备尺寸：">
                                <el-input v-model="form.DevSize" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="设备重量：">
                                <el-input v-model="form.DevWeight" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备条码：">
                                <el-input v-model="form.BarCode" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="关键设备：">
                                <el-select v-model="form.DevABC" placeholder="--请选择--" style="width:200px">
                                    <el-option v-for="item in DevABCOptions"
                                        :label="item.SettingValue"
                                        :key="item.SettingValue"
                                        :value="item.SettingValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="制造国家：">
                                <el-input v-model="form.MadeCountry" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="制造厂商：">
                                <el-input v-model="form.Manufacturer" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出厂编号：">
                                <el-input v-model="form.ProductionNo" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="出厂日期：">
                                <el-date-picker v-model="form.ProductionDate" type="date" style="width:200px"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="采购日期：">
                                <el-date-picker v-model="form.BuyDate" type="date" style="width:200px"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="采购价格：">
                                <el-input v-model="form.BuyAmount" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="保质期限：">
                                <el-input v-model="form.WarrantyTime" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资产编号：">
                                <el-input v-model="form.AssetCode" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备状态：" class="blue">
                                <el-select v-model="form.DevStatus" placeholder="--请选择--" style="width:200px">
                                    <el-option v-for="item in DevStatusOptions"
                                        :label="item.SettingValue"
                                        :key="item.SettingNumber"
                                        :value="item.SettingNumber">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="安装位置：">
                                <el-select v-model="form.FactoryModelCode" placeholder="--请选择--" style="width:827px">
                                    <el-option v-for="item in LocationOptions"
                                        :label="item.nPathName"
                                        :key="item.FactoryModelCode"
                                        :value="item.FactoryModelCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="备注说明：">
                                <el-input v-model="form.Remark" type="textarea" :rows="4" class="handle-input-edit" style="width:827px"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4" style="height:465px;">
                   <span style="margin-left: 50px;">人员照片</span>
                     <div class="crop-demo">
                         <photoupload ref="photoupload" 
                             @fileupLoad="fileupLoad"
                             @filedelete="filedelete"
                         ></photoupload>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <div slot="footer" class="bottom">
            <el-button @click="OnClose">取 消</el-button>
            <el-button type="primary" @click="OnSubmit()" v-show="ShowFlag">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import VueCropper  from 'vue-cropperjs';
import photoupload from '../../../publicAssembly/PhotouploadAssembly';
import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';
import { showLoading, hideLoading } from '../../../../../assets/js/loading';

export default {
    name:'TemplateDialog',
     components: {
        photoupload: photoupload,
        selectTreeCategory:SelectTreeCategory,
        VueCropper
    },
    props: {
        show: { type: Boolean, default: false } // 弹框可见标志
    },
    data:function(){
        return{
            // 默认选中值
            selected: '',
            // 弹框可见否标记
            visible: this.show,
            form:{},
            diasabledInput:false, //设置人员编号不可编辑
            fileName: '',
            fileUrl: '',
            type:'',
            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'number',          // 唯一标识
                label: 'label',       // 标签显示
                children: 'children', // 子级
            },
            ShowFlag:true,
            DevUomOptions:[],//计量单位
            DevABCOptions:[],//关键设备
            LocationOptions:[],//安装位置
            DevStatusOptions:[]//设备状态
        }
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
        this.getDevUom()
        this.getLocation()
        this.getDevABC()
        this.getDevStatus()
    },
    methods: {
        //计量单位
        getDevUom(){
            let params = new URLSearchParams();
            params.append("strWhere"," SettingKey ='Unit'")

            axios.post(BaseWebApiUrl+"/SysSetting/QuerySysSettingDrowDownList",  params).then((res) => {  
                if(res.data.returnCode=="1"){
                    this.DevUomOptions = JSON.parse(res.data.returnData);
                    let options = {
                        SettingValue:'--请选择--'
                    }
                    //在数组头部添加元素
                     this.DevUomOptions.unshift(options)
                }
                else  
                {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        //关键设备
        getDevABC(){
            let params = new URLSearchParams();
            params.append("strWhere"," SettingKey ='DevABC'")

            axios.post(BaseWebApiUrl+"/SysSetting/QuerySysSettingDrowDownList",  params).then((res) => {  
                if(res.data.returnCode=="1"){
                    this.DevABCOptions = JSON.parse(res.data.returnData);
                    let options = {
                        SettingValue:'--请选择--'
                    }
                    //在数组头部添加元素
                     this.DevABCOptions.unshift(options)
                }
                else  
                {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
         //安装位置
        getLocation(){
            let params = new URLSearchParams();
            params.append("strWhere"," LayLevel=5")

            axios.post(BaseWebApiUrl+"/SysFactory/QueryFactoryCellDrowDownList",  params).then((res) => {  
                if(res.data.returnCode=="1"){
                    this.LocationOptions = JSON.parse(res.data.returnData);
                }
                else  
                {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        //设备状态
        getDevStatus(){
            let params = new URLSearchParams();
            params.append("strWhere"," SettingKey ='DevRunStatus'")

            axios.post(BaseWebApiUrl+"/SysSetting/QuerySysSettingDrowDownList",  params).then((res) => {  
                if(res.data.returnCode=="1"){
                    this.DevStatusOptions = JSON.parse(res.data.returnData);
                }
                else  
                {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },
        //添加页面初始化
        addPerson(obj,type){
            this.form = obj
            this.type = type
            this.ShowFlag = true

            if(obj.DevID == undefined)  
            {
                this.diasabledInput = false
                setTimeout(() => {
                    this.$refs.photoupload.ClearList()
                }, 10);
            }else
            {
                this.diasabledInput = true

                if(type == "Check")
                    this.ShowFlag = false

                this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.photoupload.ClearList()
                    //注意\要转为/
                    if(this.form.ImageUrl != "")
                        this.$refs.photoupload.handleShowImg(this.form.ImageUrl,"")
                    this.$refs.selectTreeCategory.getNode(this.form.CategoryCode,this.form.CategoryName)
                }, 10);
            });
            }
        },
        //保存
        OnSubmit() {
             if (this.form.DevCode == '' || this.form.DevCode == undefined) {
                this.$message.warning('设备编码不允许为空');
                return false;
             }

             if (this.form.DevName == '' || this.form.DevName == undefined) {
                this.$message.warning('设备名称不允许为空');
                return false;
             }

            if (this.form.DevStatus == '' || this.form.DevStatus == undefined) {
                this.$message.warning('设备状态不允许为空');
                return false;
            }

            if(this.form.DevID == undefined)
             {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    DevCode: this.form.DevCode,
                    DevName: this.form.DevName,
                    DevModel: this.form.DevModel,
                    CategoryCode: this.form.CategoryCode,
                    DevUom: this.form.DevUom,
                    DevSize: this.form.DevSize,
                    DevWeight: this.form.DevWeight,
                    BarCode: this.form.BarCode,
                    DevABC: this.form.DevABC,
                    MadeCountry: this.form.MadeCountry,
                    Manufacturer: this.form.Manufacturer,
                    ProductionNo: this.form.ProductionNo,
                    ProductionDate: this.form.ProductionDate,
                    BuyDate: this.form.BuyDate,
                    BuyAmount: this.form.BuyAmount,
                    WarrantyTime: this.form.WarrantyTime,
                    AssetCode: this.form.AssetCode,
                    DevStatus: this.form.DevStatus.replace('DevRunStatus:',''),
                    LocationCode: this.form.FactoryModelCode,
                    Remark: this.form.Remark=== undefined ?'':this.form.Remark,
                    CreateUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date(),
                    ImageUrl:this.fileUrl
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '设备台帐管理',
                    ObjectName: 'CreateDev',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔添加〕设备台帐：' + this.form.DevCode + "-" + this.form.DevName
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(EamWebApiUrl + '/EamDev/CreateDev', params).then((res) => {
                    hideLoading();
                    if (res.data.returnCode == '1') {
                        this.$message.success("保存成功");
                        this.$emit('addNewDomain', this.form);
                    } else {
                        this.$message.error(res.data.returnMsg);
                    }
                });

             }else
             {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    DevID:this.form.DevID,
                    DevCode: this.form.DevCode,
                    DevName: this.form.DevName,
                    DevModel: this.form.DevModel,
                    CategoryCode: this.form.CategoryCode,
                    DevUom: this.form.DevUom,
                    DevSize: this.form.DevSize,
                    DevWeight: this.form.DevWeight,
                    BarCode: this.form.BarCode,
                    DevABC: this.form.DevABC,
                    MadeCountry: this.form.MadeCountry,
                    Manufacturer: this.form.Manufacturer,
                    ProductionNo: this.form.ProductionNo,
                    ProductionDate: this.form.ProductionDate,
                    BuyDate: this.form.BuyDate,
                    BuyAmount: this.form.BuyAmount,
                    WarrantyTime: this.form.WarrantyTime,
                    AssetCode: this.form.AssetCode,
                    DevStatus: this.form.DevStatus.replace('DevRunStatus:',''),
                    LocationCode: this.form.FactoryModelCode,
                    Remark: this.form.Remark,
                    CreateUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date(),
                    ImageUrl:this.fileUrl
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '设备台帐管理',
                    ObjectName: 'UpdateDev',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔编辑〕设备台帐：' + this.form.DevCode + "-" + this.form.DevName
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(EamWebApiUrl + '/EamDev/UpdateDev', params).then((res) => {
                    hideLoading();
                    if (res.data.returnCode == '1') {
                        this.$message.success("保存成功");
                        this.$emit('addNewDomain', this.form);
                    } else {
                        this.$message.error(res.data.returnMsg);
                    }
                });
             }
        },
        //重置表单
        OnReset() {
            this.$refs.form.resetFields();
        },
        // 关闭弹框
        OnClose() {
            this.$emit('update:show', false); // 子组件更新弹框隐藏
            this.OnReset();
        },
       //---------------------------图片上传---------------------------
       fileupLoad(url, name) {
           this.fileName = name;
           this.fileUrl = url;
       },
       filedelete()
       {
           this.fileName = '';
           this.fileUrl = '';
       },
       //---------------------------图片上传---------------------------
        goBack(){
            this.$router.go(-1);
        }

        
  }
}
</script>

<style>
    .headerNotice {
        height: 40px;
        margin-bottom: 5px;
        border-bottom: 1px solid #d5e3ef;
        font-size: 16px;
        color: #44bbbb;
    }

    .el-form-lable{
        float: left;
    }

    .el-dialog__body{
        padding-top: 0px;
    }

    .pre-img{   
        width: 150px;
        height: 150px;
        margin-top: 11px;
        margin-left: 12px;
    }

    .crop-demo-btn{
        margin-top: 20px;
        margin-left: 42px;
    }

    .el-icon-lx-apps
    {
        color: #409EFF;
    }

    .switch{
        width: 200px;
    }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>

