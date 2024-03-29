<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {Plus} from '@element-plus/icons-vue'

const list = ref()
const tempID = ref()
const tempList =ref({
  id:'',
  feedbackState:'',
  feedbackContent: '',
  feedbackImg:'',
  diagnosisImg:'',
  initialImg:''
})//暂存显示评价内容的list

//异步函数
//获取所有眼底图像数据
import {listService, addService, deleteService, diagnosisService, getFeedbackService} from '@/api/doctor.js'
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
  initialImg:'',

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
  visibleDrawer.value = false
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

const getEvaluateResult = async () => {

  let result = await diagnosisService(tempID.value);
  tempList.value.id = result.data.id;
  tempList.value.feedbackState=result.data.feedbackState;
  tempList.value.feedbackContent=result.data.feedbackContent;
  tempList.value.feedbackImg=result.data.feedbackImg;
  tempList.value.diagnosisImg=result.data.diagnosisImg;
  tempList.value.initialImg=result.data.initialImg;
}

const getImages = ()=>{

}

const back = ()=>{


}

const searchlist =ref()
const searchID=ref('')
//用户搜索时选中的诊断状态
const diagnosisState=ref('')

//用户搜索时选中的反馈状态
const feedbackState=ref('')


//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//当每页条数发生了变化，调用此函数

const onSizeChange = (size) => {
  pageSize.value = size
  searchList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  searchList()
}



import { searchService } from '@/api/doctor.js'
const searchList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    searchID:searchID.value?searchID.value:null,
    diagnosisState: diagnosisState.value ? diagnosisState.value : null,
    feedbackState: feedbackState.value ? feedbackState.value : null
  }
  let result = await searchService(params);
  searchlist.value = result.data.items
  console.log("seachlist")
  console.log(searchlist.value)
  //渲染总条数
  total.value=result.data.total


}
searchList()

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span >评价反馈</span>

      </div>
    </template>
    <div>
      <el-form inline style="margin-left: 5%">
        <el-form-item label="ID"> <el-input placeholder="可输入ID"  v-model="searchID"></el-input></el-form-item>
        <el-form-item label="诊断状态：">
          <el-select placeholder="请选择" v-model="diagnosisState"  style="width: 110px">
            <el-option label="已诊断" value="已诊断"></el-option>
            <el-option label="未诊断" value="未诊断"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="反馈状态：">
          <el-select placeholder="请选择" v-model="feedbackState" style="width: 110px">
            <el-option label="合格" value="合格"></el-option>
            <el-option label="不合格" value="不合格"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="button" @click="searchList">搜索</el-button>
          <el-button class="button" @click="searchID='';diagnosisState='';feedbackState=''">重置</el-button>
        </el-form-item>

      </el-form>
    </div>
    <el-table :data="searchlist" style="width: 100%">
      <el-table-column label="ID"  type="index"> </el-table-column>
      <el-table-column  label="缩略图" >
        <template #default="scope">
          <!--调用图片组件 -->
          <el-image :src="scope.row.initialImg" fit="contain" style="width: 178px;height: 178px"></el-image>
        </template>

      </el-table-column>
      <el-table-column label="名称" prop= "title" ></el-table-column>
      <el-table-column label="诊断状态" prop="diagnosisState" >
        <template #default="scope">
          <el-tag size="large"  class="el-tag-green"  round v-if="(scope.row.diagnosisState)==='未诊断'">{{scope.row.diagnosisState}}</el-tag>
          <el-tag size="large" class="el-tag-red" round v-if="(scope.row.diagnosisState)==='已诊断'">{{scope.row.diagnosisState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button class="diagnosis" type="primary"  @click="tempID=scope.row.id;getEvaluateResult();visibleDrawer=true">查看评价反馈</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除操作" >

        <template #default="{ row }">
          <el-button class="delete" type="danger" @click="deleteImage(row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 评价内容弹窗 -->
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="评价诊断结果" direction="rtl" size="50%">

<!--      <el-form :model="tempList" label-width="100px" >-->
<!--        <el-form-item>-->

<!--        </el-form-item>-->
<!--        <el-form-item label="诊断是否合格">-->
<!--          <el-radio-group v-model="" size="large">-->
<!--            <el-radio label="合格" value="合格" border />-->
<!--            <el-radio label="不合格" value="不合格" border />-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="文字反馈内容"  >-->
<!--        </el-form-item>-->

<!--        <el-form-item label="反馈照片">-->
<!--          <el-upload class="image-uploader" :auto-upload="true" :show-file-list="false"-->
<!--                     action="/api/upload" name="file" :headers="{'Authorization':tokenStore.token}" :on-success="uploadSuccess">-->
<!--            <img v-if="imageModel.feedbackImg" :src="imageModel.feedbackImg" class="image"  alt=""/>-->
<!--            <el-icon v-else class="image-uploader-icon">-->
<!--              <Plus />-->
<!--            </el-icon>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
<!--      </el-form>-->


  <el-form>
    <el-form-item label="图像ID">
      <span class="display-text">{{tempList.id}}</span>
      </el-form-item>
    <el-form-item label="是否合格">
      <span class="display-text">{{tempList.feedbackState}}</span>

    </el-form-item>
    <el-form-item label="文字反馈内容">
      <span class="display-text">{{tempList.feedbackContent}}</span>

    </el-form-item>
    <div class="container">
      <img :src="tempList.initialImg" class="image"  alt="" >
      <img :src="tempList.feedbackImg" class="image"  alt="" >
      <img :src="tempList.feedbackImg" class="image"  alt="" >
    </div>
    <div class="container">
      <span class="image-title">眼底图像</span>
      <span class="image-title">诊断图像</span>
      <span class="image-title">反馈图像</span>
    </div>

  </el-form>
      <template #footer>
        <span class="drawer-footer">
            <el-button @click="visibleDrawer = false" class="button">返回</el-button>

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
      width: 400px;
      height: 400px;
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
      width: 400px;
      height: 400px;
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

.el-tag-green{
  background-color: rgba(162, 235, 73, 0.15);
  color: #A2EB49;
}

.el-tag-red{
  background-color: rgba(108, 93, 211, 0.15);
  color: #6C5DD3;
}
.container {
  display: flex; /* 启用弹性布局 */
  justify-content: space-between; /* 图像之间均匀分布空白 */
  align-items: center; /* 垂直居中 */
  text-align: center;
}
.image{
  position: relative;
  height:200px; /* vh 表示视口高度的百分比 */
  width: 200px; /* 或者根据需要设置具体的宽度 */
  display: flex;
  justify-content: center; /* 水平居中 */

}

.image-title{
  width: 27%;
  position: relative;
  justify-content: center; /* 水平居中 */

}
.display-text {
  /* 添加一些 CSS 样式来美化文本 */
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid rgba(108, 93, 211, 0.15);
  padding: 5px 10px;
  border-radius: 4px;
  background-color: rgba(108, 93, 211, 0.15);
}
.button{
  border-color: #6C5DD3;
  background-color: #6C5DD3;
  color:white ;

}
.button:hover{
  border-color: #998bff;
  background-color: #998bff;

}
</style>
