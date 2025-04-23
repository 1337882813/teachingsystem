<template>
  <div class="page-container">
    <div class="header-section">
      <h3 class="userid">欢迎,用户{{ name }}</h3>
      <div class="menu-container">
        <el-menu :ellipsis="false" :default-active="activeMenu" mode="horizontal" @select="handleMenuSelect" class="compact-menu">
          <el-menu-item index="course">课程选择</el-menu-item>
          <el-menu-item index="score">成绩查询</el-menu-item>
          <el-menu-item index="courseList" >课表查询</el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 课程选择界面 -->
    <div v-if="activeMenu === 'course'">
      <div class="search-container">
        <el-input v-model="input" placeholder="请输入课程号或课程名称" style="width: 300px" />
        <el-button type="primary" @click="searchCourse">搜索</el-button>
      </div>
    <el-table :data="tableData" height="400" border style="width: 100%">
      <el-table-column prop="kh" label="课程号" width="100" align="center" />
      <el-table-column prop="km" label="课程名称" width="100" align="center" />
      <el-table-column prop="xf" label="学分" width="50" align="center" />
      <el-table-column prop="gh" label="教师号" width="100" align="center" />
      <el-table-column prop="xm" label="任课教师" width="100" align="center" />
      <el-table-column prop="sksj" label="上课时间" width="200" align="center" />
      <el-table-column prop="xq" label="学期" width="100" align="center" />
      <el-table-column prop="yxh" label="院系号" width="50" align="center" />
      <el-table-column prop="wz" label="校区" width="150" align="center" />
      <el-table-column prop="skrs" label="已选人数" width="50" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="scope">
          <el-button :disabled="scope.row.selectDisabled" type="primary" size="small" @click="handleClickSelect(scope.row)">选课</el-button>
          <el-button :disabled="scope.row.deleteDisabled" type="primary" size="small" @click="handleClickDelete(scope.row)">退课</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 成绩查询界面 -->
  <div v-else-if="activeMenu==='score'">
      <el-table :data="scoreData" height="400" border style="width: 100%">
        <el-table-column prop="kh" label="课程号" width="100" align="center" />
        <el-table-column prop="km" label="课程名称" width="150" align="center" />
        <el-table-column prop="xf" label="学分" width="100" align="center" />
        <el-table-column prop="cj" label="成绩" width="100" align="center" />
        <el-table-column label="绩点" width="100" align="center" fixed="right">
          <template #default="scope">{{ calculateGPA(scope.row) }}</template>
        </el-table-column>
      </el-table>
      <div class="gpa-footer">平均绩点: {{ calculateAverageGPA() }}
      </div>
    </div>
    <!-- 课表查询界面 -->
    <div v-else-if="activeMenu==='courseList'">
      <el-table :data="courseData" height="400" border style="width: 100%">
        <el-table-column prop="kh" label="课程号" width="100" align="center" />
        <el-table-column prop="km" label="课程名称" width="100" align="center" />
        <el-table-column prop="xf" label="学分" width="50" align="center" />
        <el-table-column prop="gh" label="教师号" width="100" align="center" />
        <el-table-column prop="xm" label="任课教师" width="100" align="center" />
        <el-table-column prop="sksj" label="上课时间" width="200" align="center" />
        <el-table-column prop="xq" label="学期" width="100" align="center" />
        <el-table-column prop="yxh" label="院系号" width="50" align="center" />
        <el-table-column prop="wz" label="校区" width="150" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script  setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { ElInput, ElButton, ElTable, ElTableColumn ,ElMessage,ElMenu} from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router' // 导入路由模块
const router = useRouter() // 创建路由实例
const input = ref('')
const tableData = ref([])
const courseData = ref([])
const props = defineProps({
  username: String,
  name: String
})
const activeMenu = ref('course') // 默认选中的菜单
const scoreData = ref([]) // 成绩数据
const calculateGPA = (rowData) => {
  // 计算绩点
  const score = parseFloat(rowData.cj)
  if(score>=90) return 4.0
  else if(score>=85) return 3.7
  else if(score>=82) return 3.3
  else if(score>=78) return 3.0
  else if(score>=75) return 2.7
  else if(score>=72) return 2.3
  else if(score>=68) return 2.0
  else if(score>=64) return 1.5
  else if(score>=60) return 1.0
  else return 0.0
}
const calculateAverageGPA = () => {
  // 计算平均绩点
  if(scoreData.value.length === 0) return 0;
  const totalGPA = scoreData.value.reduce((sum, row) => {
    return sum + (calculateGPA(row) * parseFloat(row.xf)); // 绩点×学分
  }, 0);
  const totalCredits = scoreData.value.reduce((sum, row) => {
    return sum + parseFloat(row.xf); // 总学分
  }, 0);
  return totalCredits > 0 ? (totalGPA / totalCredits).toFixed(2) : 0;
}
const handleMenuSelect = async (index) => {
  activeMenu.value = index // 更新选中的菜单
 try{ if (index === 'score') {
    // 发送请求获取成绩数据  
    const response = await axios.post('http://localhost:3000/api/users/scores',{
      studentId:props.username
    })
    if(response.data.success){
      scoreData.value = response.data.data
    }
    else{
      ElMessage.error('获取成绩失败')
    }
  }
  else if(index === 'courseList'){
    // 发送请求获取课表数据
    const response = await axios.post('http://localhost:3000/api/users/selected',{
      studentId:props.username
    })
    if(response.data.success){
      courseData.value = response.data.data 
    }
    else{
      ElMessage.error('获取课表失败')
    }
  }}
    catch(error){
       ElMessage.error('获取课表失败')
}
}
const searchCourse = async() => {
  // 搜索逻const handleLogin = async() => {
  try{ 
    if (!input.value.trim()) {
      ElMessage.warning('请输入课程号或课程名称')
      return
    }
    const response = await axios.post('http://localhost:3000/api/users/students', {
      course: input.value.trim(),
      studentId: props.username
    })
    
    if (response.data.success) {
      tableData.value = response.data.data.map(item => ({
        ...item,
        selectDisabled: item.isselected, // 已选则禁用选课按钮
        deleteDisabled: !item.isselected // 未选则禁用退课按钮
      }))
    
    }else {
      ElMessage.warning('未找到相关课程')
      console.log('搜索课程:', input.value, '未找到结果')
    }
    }catch(error){
      ElMessage.error('没有该课程')
      return false
}}

const handleClickSelect = async (rowData) => {
  try{
    const response= await axios.post('http://localhost:3000/api/users/select',{
      xh:props.username,
      xq:rowData.xq,
      kh:rowData.kh,
      gh:rowData.gh,
      cj:null,
      sksj:rowData.sksj,
    });
    if(response.data.success){
      ElMessage.success('选课成功')
      // 更新表格数据，禁用选课按钮
      rowData.selectDisabled = true;
      rowData.deleteDisabled = false; 
    }
    else {
      ElMessage.error('选课失败') 
    }
  }catch(error){
    ElMessage.error('选课失败')
  }
}

const handleClickDelete = async (rowData) => {
  try{
    const response= await axios.post('http://localhost:3000/api/users/delete',{
      xh:props.username,
      xq:rowData.xq,
      kh:rowData.kh,
      gh:rowData.gh,
    });
    if(response.data.success){
      ElMessage.success('退课成功')
      // 更新表格数据，禁用选课按钮
      rowData.selectDisabled = false;
      rowData.deleteDisabled = true; 
    }
    else {
      ElMessage.error('退课失败') 
    }
  }catch(error){
    ElMessage.error('退课失败')
  }
}


</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.userid {
  margin-bottom: 10px;
  font-size: 18px;
  color: #409EFF;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.el-table {
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.menu-container {
  margin-bottom: 10px;
}
.compact-menu {
 border-bottom: none
 !important; 
}
</style>