<template>
  <el-dialog  :close-on-click-modal="false" :visible.sync="visible" width="900px" @close="OnClose()">
     <h2 class="headerNotice">
        <i class="el-icon-thirdkucun"></i>
        <span v-if="this.form.PersonID === undefined || this.form.PersonID === ''">添加人员账号</span><span v-else>编辑人员账号</span>
    </h2>
    <div style="height:300px; margin-top: 10px;">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item>
                <el-input v-model="form.ImageUrl" v-if=false></el-input>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="18">
                    <div>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="人员编码：" class="el-form-lable blue" >
                                    <el-input v-model="form.PersonCode" class="handle-input-edit" v-bind:disabled="diasabledInput"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="人员姓名：" class="el-form-lable blue">
                                    <el-input v-model="form.PersonName" class="handle-input-edit"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="电话号码：" class="el-form-lable">
                                <el-input v-model="form.PersonPhone" class="handle-input-edit"></el-input>
                            </el-form-item>
                        </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系地址：" class="el-form-lable">
                                    <el-input v-model="form.PersonAdd" class="handle-input-edit"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row :gutter="20">
                            <el-col :span="12">
                                 <el-form-item label="电子邮箱：" class="el-form-lable">
                                    <el-input v-model="form.PersonEmail" class="handle-input-edit" type="email"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所属部门：" class="el-form-lable blue">
                                    <selectTreeDept ref="selectTreeDept" v-model="form.DeptID" value="form.DeptID" width="200" :props="defaultProps" placeholder="--所属部门--"></selectTreeDept>
                                </el-form-item>
                            </el-col>
                        </el-row>
                         <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="备注说明：" class="el-form-lable">
                                    <el-input v-model="form.Remark" class="handle-input-edit"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="登录密码：" class="el-form-lable blue">
                                    <el-input v-model="form.LoginPwd" class="handle-input-edit" type="password"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="人员状态：" class="el-form-lable blue">
                                    <!--说明：当用如上的【active-value="1" inactive-value="0"】，此时的【active-value】值类型为string，如果要求【active-value】值类型为number时，必须在其前面加上    : -->
                                    <el-switch 
                                    v-model="form.PersonStatus" 
                                    active-text="Y" 
                                    inactive-text="N" 
                                    inactive-color="#BFBFBF" 
                                    active-value="在用" 
                                    inactive-value="停用" 
                                    class="switch"></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="允许登录：" class="el-form-lable blue">
                                    <el-switch 
                                    v-model="form.LoginTrueValue" 
                                    active-text="Y" 
                                    inactive-text="N" 
                                    inactive-color="#BFBFBF" 
                                    active-value="允许" 
                                    inactive-value="禁止" 
                                    class="switch"></el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="移动端权限：" class="el-form-lable blue">
                                    <el-switch 
                                    v-model="form.MobileLogin" 
                                    active-text="Y" 
                                    inactive-text="N" 
                                    inactive-color="#BFBFBF" 
                                    active-value="允许" 
                                    inactive-value="禁止" 
                                    class="switch"></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12"></el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div style="height:280px">
                        <span style="margin-left: 50px;">人员照片</span>
                        <div class="crop-demo">
                            <photoupload ref="photoupload" 
                                @fileupLoad="fileupLoad"
                                @filedelete="filedelete"
                            ></photoupload>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-form>  
        </div>
        <div slot="footer" class="bottom">
            <el-button @click="OnClose">取 消</el-button>
            <el-button type="primary" @click="OnSubmit()">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import VueCropper  from 'vue-cropperjs';
import photoupload from '../../publicAssembly/PhotouploadAssembly';
import SelectTreeDept from '../../publicAssembly/SelectTreeDept.vue';
import { showLoading, hideLoading } from '../../../../assets/js/loading';

export default {
    name:'TemplateDialog',
     components: {
        photoupload: photoupload,
        selectTreeDept:SelectTreeDept,
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
            // 数据默认字段
            defaultProps: {
                parent: 'parentId',   // 父级唯一标识
                value: 'id',          // 唯一标识
                label: 'label',       // 标签显示
                children: 'children', // 子级
            }
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
    methods: {
        //添加页面初始化
        addPerson(obj){
            this.form = obj;
            
            if(obj.PersonID == undefined)  
            {
                this.diasabledInput = false
                setTimeout(() => {
                    this.$refs.photoupload.ClearList()
                }, 10);
            }else
            {
                this.diasabledInput = true
                this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.photoupload.ClearList()
                    //注意\要转为/
                    if(this.form.ImageUrl != "")
                        this.$refs.photoupload.handleShowImg(this.form.ImageUrl,"")
                        this.$refs.selectTreeDept.getNode(this.form.DeptID,obj.DeptName)
                }, 10);
            });
            }
        },
        //保存
        OnSubmit() {

             if (this.form.PersonCode == '' || this.form.PersonCode == undefined) {
                this.$message.warning('人员编码不允许为空');
                return false;
             }

             if (this.form.PersonName == '' || this.form.PersonName == undefined) {
                this.$message.warning('人员姓名不允许为空');
                return false;
             }
             
            if(this.form.PersonEmail != '' && this.form.PersonEmail != undefined){
                var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                if (!reg.test(this.form.PersonEmail)) {
                    this.$message.warning('电子邮箱不正确');
                    return false;
                }
            }

            if (this.form.DeptID == '' || this.form.DeptID == undefined) {
                this.$message.warning('所属部门不允许为空');
                return false;
            }

            if (this.form.LoginPwd == '' || this.form.LoginPwd == undefined) {
                this.$message.warning('登录密码不允许为空');
                return false;
            }
            
             if(this.form.PersonID == undefined)
             {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    PersonCode: this.form.PersonCode,
                    PersonName: this.form.PersonName,
                    LoginPwd: this.form.LoginPwd,
                    PersonPhone: this.form.PersonPhone,
                    PersonEmail: this.form.PersonEmail,
                    PersonAdd: this.form.PersonAdd,
                    DeptCode: this.form.DeptID,
                    Remark: this.form.Remark,
                    PersonStatus: this.form.PersonStatus == "在用" ? false : true,
                    LoginTrue: this.form.LoginTrueValue == "允许" ? true : false,
                    MobileLogin: this.form.MobileLogin == "允许" ? true : false,
                    CreateUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date(),
                    ImageUrl: this.fileUrl
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '人员账号管理',
                    ObjectName: 'CreatPerson',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔添加〕人员账号：' + this.form.PersonCode + "-" + this.form.PersonName
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/Person/CreatPersonVUE', params).then((res) => {
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
                    PersonId:this.form.PersonID,
                    PersonCode: this.form.PersonCode,
                    PersonName: this.form.PersonName,
                    LoginPwd: this.form.LoginPwd,
                    PersonPhone: this.form.PersonPhone,
                    PersonEmail: this.form.PersonEmail,
                    PersonAdd: this.form.PersonAdd,
                    DeptCode: this.form.DeptID,
                    Remark: this.form.Remark,
                    PersonStatus: this.form.PersonStatus == "在用" ? false : true,
                    LoginTrue: this.form.LoginTrueValue == "允许" ? true : false,
                    MobileLogin: this.form.MobileLogin == "允许" ? true : false,
                    ModifyUser: localStorage.getItem('ms_username'),
                    ModifyDate: new Date(),
                    ImageUrl: null
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '人员账号管理',
                    ObjectName: 'UpdatePerson',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔编辑〕人员账号：' + this.form.PersonCode + "-" + this.form.PersonName
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/Person/UpdatePersonVUE', params).then((res) => {
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

</style>

