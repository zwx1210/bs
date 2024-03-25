<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {Plus} from '@element-plus/icons-vue'

const list = ref()

//异步函数
//获取所有眼底图像数据
import {listService, addService, deleteService, diagnosisService} from '@/api/doctor.js'
import {ElMessage, ElMessageBox} from "element-plus";
const getList = async () => {
  let result = await listService();

  list.value = result.data;

  console.log(list.value)
}
getList();

//控制添加图像抽屉
const visibleDrawer = ref(false)

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
  getList()
  let result = addService(imageModel.value);
  ElMessage.success(result.message? result.message:'上传成功')
  //隐藏弹窗
   visibleDrawer.value = false
  //再次访问后台接口，查询所有,上传后刷新界面
   imageModel.value.initialImg=''
  imageModel.value.title=''
  imageModel.value.patient=''
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


import { useTokenStore } from '@/stores/token.js'
import router from "@/router/index.js";

const tokenStore = useTokenStore();

//上传图片成功回调
const  uploadSuccess = (result) => {
  //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
  imageModel.value.initialImg=result.data
  console.log(result.data)


}

import {useIDStore} from "@/stores/id.js";
const IDStore = useIDStore();

//绑定查看诊断结果的跳转页面
const Diagnosisresult = (row)=>{
  IDStore.setID(row.id)
  router.push({
    path:'/doctor/diagnosisResult',
    query: {
      id: row.id
    }
  })

}

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span >眼底图像数据管理</span>
        <div class="extra">
          <el-button class="upload" type="primary" @click="visibleDrawer=true" >上传眼底图像</el-button>
        </div>
      </div>
    </template>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="ID"  type="index"> </el-table-column>
        <el-table-column  label="缩略图" >

            <template #default="scope">
              <!--调用图片组件 -->
              <el-image :src="scope.row.initialImg" fit="contain"></el-image>
            </template>

        </el-table-column>


      <el-table-column label="名称" prop= "title" ></el-table-column>
      <el-table-column label="病人ID" prop= "patient" ></el-table-column>
      <el-table-column label="诊断状态" prop="diagnosisState" ></el-table-column>
      <el-table-column label="诊断操作" >
        <template #default="scope">
          <el-button class="diagnosis" type="primary" v-if="(scope.row.diagnosisState)==='已诊断'" @click="Diagnosisresult(scope.row)">查看诊断结果</el-button>
          <el-button class="result"  type="primary"  v-if="(scope.row.diagnosisState)==='未诊断'" @click="Diagnosisresult(scope.row)" >一键诊断</el-button>
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
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="上传眼底图像" direction="rtl" size="50%">
      <!-- 添加文章表单 -->
      <el-form :model="imageModel" label-width="100px" >
        <el-form-item label="名称" >
          <el-input v-model="imageModel.title" placeholder="请输入名称" ></el-input>
        </el-form-item>
        <el-form-item label="患者ID" >
          <el-input v-model="imageModel.patient" placeholder="请输入患者ID" ></el-input>
        </el-form-item>
        <el-form-item label="眼底图像文件">
          <el-upload class="image-uploader" :auto-upload="true" :show-file-list="false"
          action="/api/upload" name="file" :headers="{'Authorization':tokenStore.token}" :on-success="uploadSuccess">
            <img v-if="imageModel.initialImg" :src="imageModel.initialImg" class="image"  alt=""/>
            <el-icon v-else class="image-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="drawer-footer">
            <el-button @click="visibleDrawer = false">取消</el-button>
            <el-button type="primary" class="ok"  @click="addImage"> 确认 </el-button>
        </span>
      </template>
    </el-drawer>
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
  .diagnosis:hover{
    border-color: #998bff;
    background-color: #998bff;

  }
  .result{
    border-color: #32AD32;
    background-color: #32AD32;

  }
  .result:hover{
    border-color: #96ff53;
    background-color: #96ff53;
  }

  .delete{
    border-color: red;
    background-color: red;
  }
  .delete:hover{
    border-color: #fd9191;
    background-color: #fd9191;
  }
}
 .ok{
   border-color: #6C5DD3;
   background-color: #6C5DD3;
 }
 .ok:hover{
   background-color: #998bff;
   border-color: #998bff;
 }
 .smallImg{
   width: 17px;
   height: 178px;
   display: block;
 }


.el-input.is-disabled .el-input__inner{
  color: #1636d6;
}
/** el-input disabled时的背景和边框*/
.el-input.is-disabled{
  background:#dbdada;
  border: 1px solid #868686;
}
/** el-input 正常模式下、readonly模式下的文字颜色 */
.el-input__inner{
  color: #0800ff;
}


.image-uploader {
  :deep() {
    .image {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: #6C5DD3;
    }

    .el-icon.image-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}




</style>