<template>
    <el-dialog
        :visible.sync="visible"
        width="740px"
        @close="OnClose()"
        :close-on-click-modal="false"
    >
        <h2 class="headerNotice">
            <i class="el-icon-thirdkucun"></i>
            <span>添加/编辑部门信息</span>
        </h2>

        <div style="height:280px; margin-left: 50px; margin-top: 30px;">
            <el-form ref="form" :model="form"  status-icon>
               <el-form-item label="部门编码：" class="el-form-lable blue" >
                    <el-input v-model="form.number" class="handle-input-edit" v-bind:disabled="diasabledInput"></el-input>
                </el-form-item>
                <el-form-item label="部门名称：" class="el-form-lable blue">
                    <el-input v-model="form.name" class="handle-input-edit"></el-input>
                </el-form-item>
                <el-form-item label="节点类型：" class="el-form-lable">
                    <el-switch 
                        v-bind:disabled="diasabledInput"
                        v-model="form.isLeaf" 
                        active-text="父" 
                        inactive-text="子" 
                        inactive-color="#BFBFBF" 
                        active-value="0" 
                        inactive-value="1" 
                        class="switch"></el-switch>
                </el-form-item>
                <el-form-item label="失效状态：" class="el-form-lable">
                    <el-switch
                        v-bind:disabled="diasabledInputFa" 
                        v-model="form.InvalidStatus" 
                        active-text="Y" 
                        inactive-text="N" 
                        inactive-color="#BFBFBF" 
                        active-value="1" 
                        inactive-value="0" 
                        class="switch"></el-switch>
                </el-form-item>
                <el-form-item label="备注说明：" class="el-form-lable" style="width: 600px;">
                    <el-input v-model="form.remark" type="textarea" :rows="4" class="handle-input-edit" style="width: 500px;font: 400 13.3333px Arial; !important"></el-input>
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
            isLeaf:'0',
            diasabledInput:false, //设置部门编号不可编辑
            diasabledInputFa:false,//父节点不允许修改失效状态
            form:{},
            pid:''//添加时的父级节点id
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
        addPerson(obj,pid){

            console.log(obj)

            this.form = obj
            this.pid = pid

            if(pid == undefined)  
            {
                if(obj.isLeaf == '0')
                    this.diasabledInputFa = true
                else
                    this.diasabledInputFa = false
                this.diasabledInput = true
            } 
            else
                this.diasabledInput = false
                
        },
        //保存
        OnSubmit() {

             if (this.form.number == '' || this.form.number == undefined) {
                this.$message.warning('部门编码不允许为空');
                return false;
             }

             if (this.form.name == '' || this.form.name == undefined) {
                this.$message.warning('部门名称不允许为空');
                return false;
             }

            let Terminal = false
            if(this.form.isLeaf == '1')
                Terminal = true

            let InvalidStatus = false
            if(this.form.InvalidStatus == '1')
                InvalidStatus = true
            
             if(this.pid != undefined)
             {
                let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    DeptCode : this.form.number,
                    DeptName : this.form.name,
                    DeptNameEN : this.form.name,
                    Remark : this.form.remark,
                    ParentID : this.pid,
                    DeptID : this.pid,
                    Terminal : Terminal,
                    CreateUser: localStorage.getItem('ms_username'),
                    ModifyUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyDate: new Date(),
                    InvalidStatus : InvalidStatus
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '部门编码管理',
                    ObjectName: 'CreatDept',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔添加〕部门：' + this.form.number + "-" + this.form.name
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/SysDept/CreatDept', params).then((res) => {
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
                    DeptCode : this.form.number,
                    DeptName : this.form.name,
                    DeptNameEN : this.form.name,
                    Remark : this.form.remark,
                    ParentID : this.form.pid,
                    DeptID : this.form.id,
                    Terminal : Terminal,
                    CreateUser: localStorage.getItem('ms_username'),
                    ModifyUser: localStorage.getItem('ms_username'),
                    CreateDate: new Date(),
                    ModifyDate: new Date(),
                    InvalidStatus : InvalidStatus
                });

                params.append('json', jsonData);

                let json = JSON.stringify({
                    IPAdd: '127.0.0.1',
                    HostName: 'LEE',
                    HostType: '0',
                    MenuName: '部门编码管理',
                    ObjectName: 'UpdateSysDept',
                    CreateUser: localStorage.getItem('ms_username'),
                    Operation: '〔编辑〕部门：' + this.form.number + "-" + this.form.name
                });

                params.append('Logjson', json);
                showLoading();
                axios.post(BaseWebApiUrl + '/SysDept/UpdateSysDept', params).then((res) => {
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

<style>
    .el-form-lable{
        float: left;
        width: 300px;
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
 