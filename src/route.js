import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/login.vue'
import Students from './components/students.vue'
import Teacher from './components/teacher.vue'

// 添加根路径重定向
const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { path: '/login', name: 'login',component: Login }, // 登录页面
  {
    path: '/students',
    name: 'student',
    component: Students,
    props: (route) => ({ username: route.query.username,name:route.query.name }) // 添加props配置
  }, // 学生信息页面
  {
    path:'/teacher',
    name:'teacher',
    component:Teacher ,// 教师信息页面
    props: (route) => ({ username: route.query.username,name:route.query.name }) // 添加props配置

  }
]
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 历史模式
  routes, // 路由配置   
})
export default router