// 基础中间件配置
import express from 'express'
import cors from 'cors'
import pg from 'pg'
const { Pool } = pg
const app = express()
app.use(cors())          // 启用跨域请求支持
app.use(express.json())  // 解析JSON请求体
import userRoutes from './routes/userRoutes.js' // 导入路由模块
import teacherRoutes from './routes/teacherRoutes.js' // 导入路由模块

// PostgreSQL连接池配置（需要修改为实际数据库信息）
const pool = new Pool({
  user: 'postgres',    // 数据库用户名
  host: 'localhost',       // 数据库地址
  database: 'teaching-system', // 数据库名称
  password: '15922358396', // 数据库密码
  port: 5432,              // PostgreSQL默认端口
})
const userRouter = userRoutes(pool) // 创建用户路由实例
const teacherRouter = teacherRoutes(pool) // 创建教师路由实例
app.use('/api/teachers', teacherRouter) // 使用教师路由
app.use('/api/users', userRouter) // 使用用户路由


app.listen(3000, () => {
  console.log('Server running on port 3000')
})