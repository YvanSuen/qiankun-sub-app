import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import { messages } from './components/common/i18n';
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/theme-green/iconfont.css'; // 浅绿色主题
import './assets/css/app.css'; // 浅绿色主题

import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

/*后加页面同一样式*/
import "./assets/css/styleCss.css";
import "./assets/icon/iconfont.css";


// 引用js
import $ from '../Config.js';
import PublicMethod from './assets/js/PublicMethod.js';
Vue.prototype.PublicMethod=PublicMethod;

import { scrollY } from "@/utils/scorllbar.js"; //滚动条
Vue.prototype.escrollY = scrollY

//import "./assets/css/font_830376_qzecyukz0s.css";
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'big'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
//“to”: 即将要进入的目标 路由对象;（这个对象中包含name，params，meta等属性）
//"from": 当前导航正要离开的路由对象；（这个对象中包含name，params，meta等属性）
//“next”: Function: 确保要调用 next 方法，否则钩子就不会被 resolved。
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
     const role = localStorage.getItem('ms_username');//
     //const role =sessionStorage.getItem("ms_username");
   
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');

















// 没用到
function downloadFile(url) {
    url = url.replace(/\\/g, "/");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    // 文件下载进度
    xhr.onprogress = (res) => {

        this.loadingTip =
            "源文件下载中: " + ((res.loaded / res.total) * 100).toFixed(2) + "%";
    };
    xhr.onload = () => {

        this.loadingTip = "";
        this.loading = false;

        if (xhr.status === 200) {

            // 获取文件blob数据并保存
            var num = url.lastIndexOf("/") + 1;
            //把参数和文件名分割开
            var fileName = url.substring(num).split("?")[0];
            var export_blob = new Blob([xhr.response]);
            var save_link = document.createElementNS(
                "http://www.w3.org/1999/xhtml",
                "a"
            );
            save_link.href = URL.createObjectURL(export_blob);
            save_link.download = fileName;
            save_link.click();
        }
    };
    this.loading = true;
    xhr.send();
}