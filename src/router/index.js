
//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import ListVue from "@/views/doctor/ListVue.vue";
import DiagnosisVue from "@/views/doctor/DiagnosisVue.vue";
import FeedbackVue from "@/views/doctor/FeedbackVue.vue";
import UserAvatarVue from "@/views/user/UserAvatar.vue";
import UserResetPasswordVue from "@/views/user/UserResetPassword.vue";
import UserInfoVue from "@/views/user/UserInfo.vue";


//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        component: LayoutVue,
        //重定向
        redirect: '/doctor/getList',
        //子路由
        children: [
            { path: '/doctor/getList', component: ListVue },
            { path: '/doctor/diagnosisResult', component: DiagnosisVue },
            { path: '/doctor/evaluateResult', component: FeedbackVue },
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue},
            { path: '/user/password', component: UserResetPasswordVue },
        ]
    }
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
//导出
export default router


