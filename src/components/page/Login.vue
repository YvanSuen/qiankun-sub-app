<template>
    <div class="login-wrap">
        <div class="center" style="padding-top: 200px; padding-bottom: 30px">
            <h1 style="font-size: 26px">
                <span style="color: white">Phoenix Contact MES System</span>
            </h1>
            <h4 id="id-company-text" style="color: #96be0d">© 2019 Phoenix Contact</h4>
        </div>
        <div class="ms-login">
            <div class="center">
                <img src="../../assets/img/logo.png" style="height: 40px; margin-top: 20px" alt />
            </div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username" class="">
                    <el-input v-model="param.username" placeholder="username" style="width:100%">
                        <el-button slot="prepend" icon="el-icon-thirdbtn_wode"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter.native="submitForm()" style="width:100%">
                        <el-button slot="prepend" icon="el-icon-thirdmima1"></el-button>
                    </el-input>
                  
                </el-form-item>
                <div class="login-btn">
                  <el-button type="primary" @click="submitForm()" >登&nbsp;&nbsp;&nbsp;录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
 
<script>
import axios from 'axios';
export default {
    data: function () {
        return {
            param: {
                username: '2020',
                password: '123456'
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    mounted: function () {
        this.getIp();
    },
    methods: {
        getIp() {
            /* 
            var osInfo;
            osInfo += '操作系统=' + os.platform();
            osInfo += '系统版本=' + os.release();
            osInfo += '系统名称=' + os.type();
            osInfo += 'CPU架构=' + os.arch();
            console.log(osInfo); */
            var os = require('os');
            localStorage.setItem('HostName', "");
            localStorage.setItem('HostName', os.hostname());
        },
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    let params = new URLSearchParams();

                    let json = JSON.stringify({
                        IPAdd: localStorage.getItem('IPAdd'),
                        HostName: localStorage.getItem('HostName'),
                        HostType: '0',
                        MenuName: '用户登录系统',
                        ObjectName: 'CheckLogin',
                        CreateUser: this.param.username,
                        Operation: '〔登录〕' + this.param.username + '登录系统'
                    });

                    params.append('Username', this.param.username);
                    params.append('Password', this.param.password);
                    params.append('Logjson', json);
                    axios.post(BaseWebApiUrl + '/Public/Login', params).then((res) => {
                        if (res.data.returnCode == '1') {
                            this.$message.success(res.data.returnMsg);
                             //sessionStorage.setItem("ms_username",this.param.username)
                             localStorage.setItem('Session', JSON.stringify(res.data.returnData));
                             localStorage.setItem('ms_username', this.param.username);
                            this.$router.push('/');
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};

</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, #7fb543 0%, #23999d 100%), linear-gradient(#00747d, #00747d);
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    color: #191716;
    background-color: #fff;
    width: 500px;
    margin-left: auto;
    margin-right: auto;
    background: rgba(255, 255, 255, 0.5);
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    margin-bottom: 10px;
    font-size: 18px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>