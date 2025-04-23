<template>
  <div class="login-container">
    <h2 class="login-title">教学事务管理系统登录</h2>
    <el-form 
      ref="formRef" 
      :model="loginForm" 
      :rules="rules"
      label-width="80px"
      label-position="top"
      @submit.native.prevent="handleLogin"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="loginForm.username"
          :prefix-icon="User"
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          :prefix-icon="Lock"
          type="password"
          placeholder="请输入密码"
          show-password
          @key.enter="handleLogin"
        />
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          native-type="submit"
          class="login-btn"
        >
          立即登录
        </el-button>
      </el-form-item>
    </el-form>

    <div class="login-links">
      <a href="#">忘记密码？</a>
      <a href="#">新用户注册</a>
    </div> 
    <students :username="loginForm.username"/>
  </div>
 
</template>
<script setup>

import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton,ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const formRef = ref(null)
const loginForm = ref({
  username: '',
  password: '',
})
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleLogin = async() => {
  try{ 
    const valid=await formRef.value.validate()
    if (valid) {
       const response = await axios.post('http://localhost:3000/api/users/login', {
        username: loginForm.value.username,
        password: loginForm.value.password,
        
       })   
      if (response.data.success) {
        if(response.data.user.role==='student'){
        ElMessage.success('登录成功')
        // 添加参数传递
        router.push({ 
          name: 'student',
          query: { 
            username: response.data.user.xh ,
            name: response.data.user.xm, // 将用户姓名传递给 student 组件
          }
        })
      }
      else if(response.data.user.role==='teacher'){
        ElMessage.success('登录成功')
        // 添加参数传递
        router.push({
          name:'teacher',
          query: {
            username: response.data.user.gh,
            name: response.data.user.xm, // 将用户姓名传递给 teacher 组件
          }
        })
      }
    } }
      else {
      return false
    }
  }
catch(error){
  ElMessage.error('请输入正确的用户名和密码')
}
}

</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.login-links {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.login-links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.login-links a:hover {
  color: #409EFF;
}
</style>

<style>
/* 引入Element Plus基础样式 */
@import 'element-plus/dist/index.css';
</style>