<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {Plus} from '@element-plus/icons-vue'

const list = ref()
const searchlist =ref()
const f =ref()

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
  initialImg:'',
  classificationResult:''
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
let dialogVisible=ref(false)

const diagnose = async(row)=>{



  let result = await diagnoseService(row.id);
  f.value=result.data


}


import {diagnoseService} from "@/api/doctor.js";
import {CountUp} from "countup.js";


const directive = {
  inserted(el, binding) {
    // 获取到需要动态变化的数值
    let finalNum = el.innerText;
    let count = 0;
    let timer = setInterval(() => {
      count++;
      el.innerText = count;
      if (count > finalNum) {
        //  避免count大于finalNum最终数字显示不对
        count = finalNum;
        el.innerText = count;
        // 清空定时器
        clearInterval(timer);
        timer = null;
      }
    }, 10);
  },
};



const options = {
  duration: 20,
};



let demo = new CountUp('percentage', 100, options);
if (!demo.error) {
  demo.start();
} else {
  console.error(demo.error);
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span >眼底图像数据管理</span>

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
      <el-form-item>
        <el-button class="upload" type="primary" @click="visibleDrawer=true"  >上传眼底图像</el-button>
      </el-form-item>
    </el-form>
    </div>

    <el-table :data="searchlist" style="width: 100%">
      <el-table-column label="ID"  prop="id"> </el-table-column>
        <el-table-column  label="缩略图" >
            <template #default="scope">
              <!--调用图片组件 -->
              <el-image :src="scope.row.initialImg" fit="contain"></el-image>
            </template>
        </el-table-column>


      <el-table-column label="名称" prop= "title" ></el-table-column>
      <el-table-column label="病人ID" prop= "patient" ></el-table-column>
      <el-table-column label="诊断状态" prop="diagnosisState" >
        <template #default="scope">
          <el-tag size="large"  class="el-tag-green"  round v-if="(scope.row.diagnosisState)==='未诊断'">{{scope.row.diagnosisState}}</el-tag>
          <el-tag size="large" class="el-tag-red" round v-if="(scope.row.diagnosisState)==='已诊断'">{{scope.row.diagnosisState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="反馈状态" prop="diagnosisState" >
        <template #default="scope">
          <el-tag size="large"  class="el-tag-green"  round v-if="(scope.row.feedbackState)==='合格'">{{scope.row.feedbackState}}</el-tag>
          <el-tag size="large"  class="el-tag-blue"  round v-if="(scope.row.feedbackState)==='未知'">{{scope.row.feedbackState}}</el-tag>
          <el-tag size="large" class="el-tag-red" round v-if="(scope.row.feedbackState)==='不合格'">{{scope.row.feedbackState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="诊断操作" >
        <template #default="scope">
          <el-button class="diagnosis" type="primary" v-if="(scope.row.diagnosisState)==='已诊断'" @click="Diagnosisresult(scope.row)">查看诊断结果</el-button>
          <el-button class="result"  type="primary"  v-if="(scope.row.diagnosisState)==='未诊断'" @click="dialogVisible=true;diagnose(scope.row);" >一键诊断</el-button>
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
    <el-dialog v-model="dialogVisible" title="AI辅助诊断" width="30%" >
<div class="dialog-container" ></div>
        <span class="emoji">诊断中，请耐心等待~😊😊😊</span>
      <div class="cont" >
        <p id="bar"></p>
      </div>
      <span id="percentage"></span>
      <div class="complete">
        <svg width="70" height="70" >

          <circle fill="none" stroke="#6C5DD3" stroke-width="5" cx="30" cy="30" r="22" stroke-linecap="round" transform="rotate( -11.25 30 30)" class="circle" />
          <polyline fill="none" stroke="#6C5DD3" stroke-width="5" points="16,32.75 26.625,40.5 43,22.25" stroke-linecap="round" stroke-linejoin="round" class="tick"/>
        </svg>
      </div>
<!--      <CountUp :end="100" :duration="20"  />-->
      <div>{{f}}</div>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false;getList()">返回</el-button>
            <el-button  class="button" type="primary" @click=""> 查看诊断结果 </el-button>
        </span>
      </template>
    </el-dialog>
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

    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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

.button{
  border-color: #6C5DD3;
  background-color: #6C5DD3;
  color:white ;

}
.button:hover{
  border-color: #998bff;
  background-color: #998bff;

}

.cont {


}

.cont, p {
  width: 300px;
  height: 20px;
  border-radius: 10px;
  margin: 5% 10%;


}

#bar {
  background: linear-gradient(-90deg,blue, pink);
  width: 0;
  animation: prog 1 5s cubic-bezier(0.6, 0, 0.8, 1) forwards;
}
/*进度提示数字展示*/
#txt {

  font: bold 18px/20px "";
  color: #2fff00;
}
/*蓝色逐渐向右填充动画*/
@keyframes prog {
  0% {
    width: 0px;
  }
  100% {
    width: 300px;
  }
}


@keyframes circleAnimation {
  0%{
    stroke-dashoffset: 150;
  }
  100%{
    stroke-dashoffset: 0;
  }

}

@keyframes tickAnimation {
  from{
    stroke-dashoffset: 45;
  }
  to{
    stroke-dashoffset: 0;
  }

}

.circle {
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  animation: tickAnimation  1s  5s cubic-bezier(0.6, 0, 0.8, 1) forwards;

}

.tick {
  stroke-dasharray: 45;
  stroke-dashoffset: 45;
  animation: tickAnimation  1s  5s cubic-bezier(0.6, 0, 0.8, 1) forwards;
}



.dialog-container {
  width:100%

}
.emoji{
  margin: 10% 30%;
  width: 50%;
}
.complete{
  width: 100%;
  margin: 2% 40%;
}
</style>