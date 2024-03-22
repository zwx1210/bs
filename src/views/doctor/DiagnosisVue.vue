<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span >分级诊断 {{this.$route.query.id}}</span>
      </div>
    </template>
    <!-- 添加分类弹窗 -->
    <!-- 抽屉 -->

  </el-card>
</template>
<script>
import {deleteService, diagnosisService, listService} from "@/api/doctor.js";
import {ElMessage} from "element-plus";
const diagnosisResult= async () => {
  console.log(this)
  console.log("12")
  let result = await diagnosisService(this.$route.query.id);
}
diagnosisResult();
import { ref } from 'vue'
const hah =ref()


export default {

  created() {
    // 在组件创建时可以通过 this.id 访问到传递进来的 id
    diagnosisService(this.$route.query.id).then(resData =>{
      console.log(resData.data)
      console.log(this.$data)
        }
    )



  }


};


</script>