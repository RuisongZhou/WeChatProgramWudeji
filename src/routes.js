import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
//import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import adminUserRegister from './views/nav1/checkAdmin.vue'
import adminUser  from './views/nav1/administrators.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import register from './views/register.vue'
//import echarts from './views/charts/echarts.vue'
import forum from './views/nav3/forum.vue'
import order from './views/nav2/orderManage.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: register,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '', 
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '账户',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/table', component: Table, name: '账户列表' },
            { path: '/user', component: user, name: '审核列表' },
            { path: '/adminUserRegister', component:adminUserRegister, name:'管理员审核列表' },
            { path: '/adminUser', component:adminUser, name:'已有管理员' }
        ]
    },
        {
            path: '/',
            component: Home,
            name: '商城',
            iconCls: 'fa fa-id-card-o',
            children: [
                { path: '/page4', component: Page4, name: '查看商城' },
                { path: '/page5', component: Page5, name: '发布商品' },
                { path: '/order', component: order, name: '订单管理'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '论坛',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/forums', component: forum, name: '板块管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;