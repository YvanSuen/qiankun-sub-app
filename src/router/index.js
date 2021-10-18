import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '首页' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/AssemblyExecution',
                    component: () => import(/* webpackChunkName: "AssemblyExecution" */ '../components/page/MesPortalPage/Assembly/AssemblyExecution.vue'),
                    meta: { title: '装配工单执行' },
                    children:[
                        {
                            path: '/AssemblyExecutioning',
                            component: () => import(/* webpackChunkName: "AssemblyExecution" */ '../components/page/MesPortalPage/Assembly/AssemblyExecutioning.vue'),
                            meta: { title: '执行' }
                        },
                    ]
                },
                {
                    path: '/test',
                    name:'test',
                    component: () => import(/* webpackChunkName: "AssemblyExecution" */ '../components/page/MesPortalPage/Inspection/test.vue'),
                    meta: { title: 'test' }
                },
                {
                    name:'CheckBenchmark',
                    path: '/CheckBenchmark',
                    component: () => import(/* webpackChunkName: "InspectionExecution" */ '../components/page/EamPortalPage/Benchmark/CheckBenchmark/CheckBenchmark.vue'),
                    meta: { title: '执行' }
                },
                {
                    path: '/InspectionExecution',
                    component: () => import(/* webpackChunkName: "InspectionExecution" */ '../components/page/MesPortalPage/Inspection/InspectionExecution.vue'),
                    meta: { title: '检测工单执行' },
                },
                {
                    path: '/PackagingExecution',
                    component: () => import(/* webpackChunkName: "PackagingExecution" */ '../components/page/MesPortalPage/Packaging/PackagingExecution.vue'),
                    meta: { title: '包装工单执行' }
                },
                {
                    path: '/IQCInspectionExecution',
                    component: () => import(/* webpackChunkName: "IQCInspectionExecution" */ '../components/page/QmsPortalPage/QualityInspectionManagement/IQCInspectionExecution.vue'),
                    meta: { title: 'IQC检验执行' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
