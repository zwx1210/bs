<script setup>
import {deleteService, diagnosisService, listService, evaluateService, addService} from "@/api/doctor.js";
import {ElMessage} from "element-plus";
import {
  Check,
 Close
} from '@element-plus/icons-vue';
import { ref } from 'vue'
import {useIDStore} from "@/stores/id.js";
import {Plus} from "@element-plus/icons-vue";
const IDStore = useIDStore();
console.log(IDStore.ID)
const list = ref()
const getDiagnosisResult = async () => {
  let result = await diagnosisService(IDStore.ID);
   list.value = result.data;
}
getDiagnosisResult();

const visibleDrawer = ref(false)

//声明暂存图像数据模型
const imageModel = ref({
  id: IDStore.ID,
  feedbackState:'',
  feedbackContent: '',
  feedbackImg:''
})
//添加分类表单校验
const imageRules = {
  feedbackContent: [
    { required: true, message: '请输入评价内容', trigger: 'blur' },
  ],
  feedbackImg: [
    { required: true, message: '请上传反馈图片', trigger: 'blur' },
  ]}

const evaluateImage = async ()=>{
  let result = evaluateService(imageModel.value);
  ElMessage.success(result.message? result.message:'评价成功')
  //隐藏弹窗
  visibleDrawer.value = false
  //再次访问后台接口，查询所有,上传后刷新界面
  imageModel.value.id=''
  imageModel.value.feedbackState=''
  imageModel.value.feedbackContent=''
  imageModel.value.feedbackImg=''
}
import {useTokenStore} from "@/stores/token.js";
const tokenStore = useTokenStore();

const  uploadSuccess = (result) => {
  //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
  imageModel.value.feedbackImg=result.data
  console.log(result.data)
}


import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

</script>
<template>
  <el-card class="page-container" shadow="always">
    <template #header>
      <div class="header">
        <span >分级诊断 </span>
      </div>

    </template>
    <!-- 添加分类弹窗 -->
    <!-- 抽屉 -->
    <div class="container">
      <img :src="list.initialImg" class="image"  alt="" >
      <img :src="list.initialImg" class="image"  alt="" >
    </div>
    <div class="container">
      <div  class="item">原彩照</div>
      <div  class="item">分割彩照</div>
    </div>
    <div class="container">
      <el-card :body-style="{ borderRadius: '0px' }" class="result">
        <!-- 卡片内容 -->
        <template #header>
          <div class="name">
            <span >近视级别 </span>
          </div>
        </template>
        <div class="card-content">
          这里放置卡片的具体内容...
        </div>
      </el-card>

      <el-card :body-style="{ borderRadius: '10px' }" class="result">
        <template #header>
          <div class="name">
            <span >分割结果 </span>
          </div>
        </template>
        <!-- 卡片内容 -->
        <div class="card-content">
          这里放置卡片的具体内容...

        </div>
      </el-card>
      <el-card :body-style="{ borderRadius: '10px' }" class="result">
        <!-- 卡片内容 -->
        <template #header >
          <div class="name">
            <span >病变预测</span>
          </div>
        </template>
        <div class="card-content">
          这里放置卡片的具体内容...


        </div>
      </el-card>
      <el-button class="button" type="primary" @click="visibleDrawer=true" >评价</el-button>

    </div>

    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="评价诊断结果" direction="rtl" size="50%">
      <el-form :model="imageModel" label-width="100px" >
        <el-form-item label="诊断是否合格">
        <el-radio-group v-model="imageModel.feedbackState" size="large">
          <el-radio label="合格" value="合格" border />
          <el-radio label="不合格" value="不合格" border />
        </el-radio-group>
        </el-form-item>
        <el-form-item label="文字反馈内容"  >
          <div class="editor"><quill-editor
              theme="snow"
              v-model:content="imageModel.feedbackContent"
              contentType="html"
              class="editor"
          >
          </quill-editor></div>

        </el-form-item>

        <el-form-item label="反馈照片">
          <el-upload class="image-uploader" :auto-upload="true" :show-file-list="false"
                     action="/api/upload" name="file" :headers="{'Authorization':tokenStore.token}" :on-success="uploadSuccess">
            <img v-if="imageModel.feedbackImg" :src="imageModel.feedbackImg" class="image"  alt=""/>
            <el-icon v-else class="image-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="drawer-footer">
            <el-button @click="visibleDrawer = false">取消</el-button>
            <el-button type="primary" class="ok"  @click="evaluateImage"> 确认 </el-button>
        </span>
      </template>
    </el-drawer>
  </el-card>
</template>
<style lang="scss" scoped>
.page-container{
  position: relative;
  border-radius: 15px;

}
.container {
  display: flex; /* 启用弹性布局 */
  justify-content: space-between; /* 图像之间均匀分布空白 */
  align-items: center; /* 垂直居中 */


}
.item{
  text-align: center;
  width: 50%;
  font-size: 18px;
  color:#6C5DD3;
}
.result{
  text-align: center;
  width: 31%;
  border-radius: 20px;
  height: 15vh;
  margin: 1%;

}
.image{
  position: relative;
  height: 56vh; /* vh 表示视口高度的百分比 */
  width: 40%; /* 或者根据需要设置具体的宽度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  margin-left: 6%;
  margin-right: 6%;

}
.header{
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 40px;
  color:#6C5DD3;

}

.name{
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
  color:#6C5DD3;

}
.button{
  border-color: #6C5DD3;
  background-color: #6C5DD3;
  position: absolute; /* 使用绝对定位 */
  right: 1%; /* 将按钮放置在父容器右侧边缘 */
  bottom: 0; /* 将按钮放置在父容器底部边缘 */
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 400px;
  }
}

.image-uploader {
  :deep() {
    .image {
      width: 300px;
      height: 300px;
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
      width: 300px;
      height: 300px;
      text-align: center;
    }
  }
}


</style>