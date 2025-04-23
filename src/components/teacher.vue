<template>
<h3 class="userid">欢迎,用户{{ name }}</h3>
  <div class="page">
    <div class="menu" >
        <el-menu :default-active="activeMenu" mode="vertical"  @select="handleMenuSelect" class="compact-menu">
            <el-menu-item  index="myCourse"><el-icon><Avatar/></el-icon>我教的课程</el-menu-item>
            <el-menu-item index="courseManage"><el-icon><Tickets /></el-icon>课程事务管理</el-menu-item>
            <el-menu-item index="studentGradeManage"><el-icon><Histogram /></el-icon>学生成绩管理</el-menu-item>
        </el-menu>
    </div>
    <!--我教的课程界面  -->
    <div v-if="activeMenu==='myCourse'" class="tableShow">
    <el-table :data="myCourseData" height="400" border style="width: 100%">
      <el-table-column prop="kh" label="课程号" width="100" align="center" />
      <el-table-column prop="km" label="课程名称" width="100" align="center" />
      <el-table-column prop="xf" label="学分" width="70" align="center" />
      <el-table-column prop="xm" label="任课教师" width="100" align="center" />
      <el-table-column prop="sksj" label="上课时间" width="180" align="center" />
      <el-table-column prop="xq" label="学期" width="100" align="center" />
      <el-table-column prop="wz" label="校区" width="140" align="center" />
      <el-table-column prop="skrs" label="课程人数" width="100" align="center" />
    </el-table>
    </div>
    <!-- 课程事务管理界面 -->
    <div v-else-if="activeMenu==='courseManage'" class="tableShow">
    <el-table :data="courseManageData" height="400" border stripe style="width: 100%">
      <el-table-column prop="kh" label="课程号" width="100" align="center" />
      <el-table-column prop="km" label="课程名称" width="100" align="center" />
      <el-table-column prop="xm" label="任课教师" width="100" align="center" />
      <el-table-column prop="sksj" label="上课时间" width="180" align="center" />
      <el-table-column prop="xq" label="学期" width="100" align="center" />
      <el-table-column prop="skrs" label="课程人数" width="100" align="center" />
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="courseCheck(scope.row)">考勤</el-button>
          <el-button type="primary" size="small" @click="sendHomework(scope.row)">发布作业</el-button>
          <el-button type="primary" size="small" @click="randomSelect(scope.row)">随机选人</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>
<script setup>
import { ref,onMounted} from 'vue'
import { defineProps } from 'vue'
import { ElInput, ElButton, ElTable, ElTableColumn ,ElMessage,ElMenu} from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router' // 导入路由模块
import { Avatar,Tickets,Histogram } from '@element-plus/icons-vue'
const router = useRouter() // 创建路由实例
const activeMenu = ref('myCourse') // 定义当前选中的菜单
const myCourseData = ref([]) // 定义表格数据
const courseManageData=ref([])
onMounted(async () => { // 页面加载时执行
    await loadMyCourses() // 加载我教的课程数据
  })
const courseCheck=(rowData)=>{ // 考勤
  
}
const sendHomework=(rowData)=>{ }// 发布作业

const randomSelect=(rowData)=>{ }// 随机选人
const loadMyCourses = async () => { // 加载我教的课程数据
    try {
      const response=await axios.post('http://localhost:3000/api/teachers/myCourses',
       {teacherId:props.username})
       if(response.data.success){
         myCourseData.value=response.data.data
       }
       else{
         ElMessage.error(response.data.message)
       }
    }catch (error) {
      ElMessage.error('加载我的课程数据失败')
    }
  }
const loadCourseManage = async () => { // 加载我教的课程数据
  try {
    const response=await axios.post('http://localhost:3000/api/teachers/courseManage',
      {teacherId:props.username})
      if(response.data.success){
        courseManageData.value=response.data.data
      }
      else{
        ElMessage.error(response.data.message)
      }
  }catch (error) {
    ElMessage.error('加载我的课程数据失败')
  }
}
const handleMenuSelect = async (index) => { // 菜单点击事件
    activeMenu.value = index 
    try{ if(index==='myCourse'){
       await loadMyCourses() // 加载我的课程数据
    }
    else if(index==='courseManage'){
      await loadCourseManage() // 加载我的课程数据
    }
    else if(index==='studentGradeManage'){}
  } 
    catch(errror){}
  }


const props = defineProps({
  username: String,
  name: String
})
</script>
<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex
}
.menu{
    width: 150px;
    margin-right: 20px;
}
.userid {
    display: flex;
    flex-direction: column;
    align-items: center;  
    font-size: 18px;
    color: #409EFF;
    margin-bottom: 30px;
}
.tableShow {
  flex:1;
  overflow: auto;
}

</style>