<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'


const list = ref()

//异步函数
//获取所有眼底图像数据
import {listService, addService, deleteService} from '@/api/doctor.js'
import {ElMessage, ElMessageBox} from "element-plus";
const getList = async () => {
  let result = await listService();

  list.value = result.data;
  console.log(list.value)
}
getList();

//控制添加图像弹窗
const dialogVisible = ref(false)

//添加图像数据模型
const imageModel = ref({
  title: '',
  patient: '',
  initialImg:''//暂时作文本
})
//添加分类表单校验
const imageRules = {
  title: [
    { required: true, message: '请输入眼底图像名称', trigger: 'blur' },
  ],
  patient: [
    { required: true, message: '请输入病人ID', trigger: 'blur' },
  ],
  initialImg: [
    { required: true, message: '请上传眼底图像文件', trigger: 'blur' },
  ]
}

//访问后台，同步等待异步调用结果
const addImage = async ()=>{
  let result = addService(imageModel.value);
  ElMessage.success(result.message? result.message:'上传成功')
  //隐藏弹窗
  dialogVisible.value = false
  //再次访问后台接口，查询所有,上传后刷新界面
  getList()
}


//删除眼底图像
//删除眼底图像  给删除按钮绑定事件


//删除
const deleteImage = (row) => {
  ElMessageBox.confirm(
      '你确认要删除该眼底图像文件吗？',
      '温馨提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        //用户点击了确认
        let result = await deleteService(row.id)
        ElMessage.success(result.message?result.message:'删除成功')
        //刷新
        getList()
      })
      .catch(() => {
        //用户点击了取消
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span >眼底图像数据管理</span>
        <div class="extra">
          <el-button class="upload" type="primary" @click="dialogVisible=true" >上传眼底图像</el-button>
        </div>
      </div>
    </template>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="ID"  type="index"> </el-table-column>
      <el-table-column label="缩略图" prop= "initialImage" ></el-table-column>
      <el-table-column label="名称" prop= "title" ></el-table-column>
      <el-table-column label="病人ID" prop= "patient" ></el-table-column>
      <el-table-column label="诊断状态" prop="diagnosisState" ></el-table-column>
      <el-table-column label="诊断操作" >
        <template #default="{ row }">
          <el-button class="diagnosis" type="primary" >查看诊断结果</el-button>
          <el-button class="result"  type="primary">一键诊断</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" >

        <template #default="{ row }">
          <el-button class="delete" type="danger" @click="deleteImage(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" title="上传眼底图像" width="30%">
      <el-form :model="imageModel" :rules="imageRules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="imageModel.title" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="病人ID" prop="patient">
          <el-input v-model="imageModel.patient" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="图像文件" prop="initialImage">
          <el-input v-model="imageModel.initialImg" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addImage"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 40px;
    color:#6C5DD3;

  }
  .upload{
    border-color: #6C5DD3;
    background-color: #6C5DD3;
  }

  .diagnosis{
    border-color: #6C5DD3;
    background-color: #6C5DD3;
  }
  .result{
    border-color: greenyellow;
    background-color: greenyellow;
  }
  .delete{
    border-color: red;
    background-color: red;
  }
}
</style>