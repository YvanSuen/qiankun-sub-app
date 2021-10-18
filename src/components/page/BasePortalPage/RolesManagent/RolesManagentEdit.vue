<template>
    <el-dialog
        :visible.sync="visible"
        width="400px"
        @close="OnClose()"
        :close-on-click-modal="false"
    >
        <h2 class="headerNotice">
            <i class="el-icon-thirdkucun"></i>
            <span>添加/编辑角色信息</span>
        </h2>

        <div style="height:150px; margin-left: 25px; margin-top: 30px;">
            <el-form ref="form" :model="form"  status-icon>
               <el-form-item label="角色编码：" class="blue" >
                    <el-input v-model="form.number" class="handle-input-edit" v-bind:disabled="diasabledInput"></el-input>
                </el-form-item>
                <el-form-item label="角色名称：" class="blue">
                    <el-input v-model="form.name" class="handle-input-edit"></el-input>
                </el-form-item>
                <el-form-item label="备注说明：">
                    <el-input v-model="form.remark" class="handle-input-edit"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="bottom">
            <el-button @click="OnClose">取 消</el-button>
            <el-button type="primary" @click="OnSubmit(form)">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios';
import VueCropper  from 'vue-cropperjs';
import { showLoading, hideLoading } from '../../../../assets/js/loading';

export default {
    name:'TemplateDialog',
     components: {
        VueCropper
    },
    props: {
        show: { type: Boolean, default: false } // 弹框可见标志
    },
    data:function(){
        return{
            // 弹框可见否标记
            visible: this.show,
            diasabledInput:false, //设置角色编号不可编辑
            form:{}
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

            this.form = obj

            if(obj.name != undefined)  
                this.diasabledInput = true
            else
                this.diasabledInput = false
        },
        //保存
        OnSubmit() {

             if (this.form.number == '' || this.form.number == undefined) {
                this.$message.warning('角色编码不允许为空');
                return false;
             }

             if (this.form.name == '' || this.form.name == undefined) {
                this.$message.warning('角色名称不允许为空');
                return false;
             }
            
             if(this.form.id == undefined)
             {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    RoleCode : this.form.number,
                    RoleName : this.form.name,
                    Remark : this.form.remark,
                    CreateUser: localStorage.getItem('ms_username'),
                    ModifyUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyDate: new Date()
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '角色编码管理',
                    ObjectName: 'CreatRoles',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔添加〕角色：' + this.form.number + "-" + this.form.name
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/SysRoles/CreatRoles', params).then((res) => {
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
                    RoleCode : this.form.number,
                    RoleName : this.form.name,
                    Remark : this.form.remark,
                    RoleID : this.form.id,
                    CreateUser: localStorage.getItem('ms_username'),
                    ModifyUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyDate: new Date(),
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '角色编码管理',
                    ObjectName: 'UpdateSysRoles',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔编辑〕角色：' + this.form.number + "-" + this.form.name
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/SysRoles/UpdateSysRoles', params).then((res) => {
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
            //调用父页面方法
            this.$parent.clear()
        },
        goBack(){
            this.$router.go(-1);
        }
  }
}
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
 