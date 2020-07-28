import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

//引入组件
import Home from '../views/Home.vue';
import Welcome from "../components/Welcome";

//二级路由
import Users from "../views/Main/Users";
import Rights from "../views/Main/Rights";
import Roles from "../views/Main/Roles";

  const routes = [
    {
      path:'/Login',
      name:'Login',
      component:()=>import('../views/Login/Login')
    },
    {
      path:"/",
      redirect:'/Login'
    },
    {
      path:'/HomePage',
      name:'HomePage',
      component:()=>import('../views/Home/HomePage'),
      redirect:'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/users',component:Users},
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
      ]
    },
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: Home
    // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

//挂载路由导航首位
router.beforeEach((to,form,next)=>{
  //to ---将要访问的路径   //form --- 从哪个路径访问    //   //next 函数 代表放行
  if(to.path === '/Login'){
    return next();
  };
  //获取token
  let tokenStr = window.sessionStorage.getItem('token');
  //判断
  if(!tokenStr){
    return next('/Login');
  }else{
    next();
  }
})

export default router
