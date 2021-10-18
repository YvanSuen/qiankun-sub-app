<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <!--   <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div> -->
        <div class="logo">
             <img src="../../assets/img/logon.png" class="logo-img" />
        </div>
      
        <div class="header-right">
            <div class="header-user-con">
             <div style="font-size:20px;margin-top:-5px;margin-right:60px">{{ newTime }}</div>
               <router-link  to="/"> <img src="../../assets/img/home.png" height="26px" style="margin-top:5px;margin-right:10px" /></router-link>
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
const days = ['天', '一', '二', '三', '四', '五', '六']; // 星期数组
let icnow = new Date(); // 初始化时间
let interval;
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: 'lee',
            message: 2,
            year: icnow.getFullYear(),
            month: icnow.getMonth() + 1,
            date: icnow.getDate(),
            day: days[icnow.getDay() - 1],
            time: icnow.toTimeString().substring(0, 8)
        };
    },
    created() {
        interval = setInterval(() => {
            let icnow = new Date();
            this.year = icnow.getFullYear();
            this.month = icnow.getMonth() + 1;
            this.date = icnow.getDate();
            this.day = days[icnow.getDay()];
            this.time = icnow.toTimeString().substring(0, 8);
        }, 1000);
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        },
        newTime() {
            return this.year + '年' + this.month + '月' + this.date + '日 星期' + this.day + ' ' + this.time;
        }
    },
    methods: {
        reloadTime() {
            reStrTime = '<%=getSeriveTime() %>';
            if (reStrTime != '') {
                clearTimeout(timeID);
                fnDate(reStrTime);
            } else {
            }
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('ms_username');
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        // if (document.body.clientWidth < 1500) {
        //     this.collapseChage();
        // }
    },
    beforeDestroy() {
        clearInterval(interval);
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
    background-color: #24999c;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
}
.header .logo-img{
    margin-left:20px;margin-top:10px;vertical-align:middle
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-left: 15px;
    margin-right: 5px;
    font-size: 26px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
