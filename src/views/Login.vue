<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus";
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//用于注册的数据模型
const registerData = ref({
  role:'',
  username: '',
  password: '',
  rePassword: ''
})
//自定义确认密码的校验函数
const rePasswordValid = (rule, value, callback) => {
  if (value == null || value === '') {
    return callback(new Error('请再次确认密码'))
  }
  if (registerData.value.password !== value) {
    return callback(new Error('两次输入密码不一致'))
  }
}
//用于注册的表单校验模型
const registerDataRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '用户名的长度必须为5~16位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
  ],
  rePassword: [
    { validator: rePasswordValid, trigger: 'blur' }
  ]
})
//用于注册的事件函数（调用后台接口进行注册）
import {registerService, userInfoGetService} from '@/api/user.js'
const register =async () => {
  let result =await registerService(registerData.value);//响应式对象获取值的需要.value
  // if (result.code === 0) {
  //   alert(result.msg?result.msg:'注册成功!')
  // } else {
  //   alert('注册失败!')
  // }
  // alert(result.msg?result.msg:'注册成功!')
  ElMessage.success(result.msg?result.msg:'注册成功!')
}


//清空数据模型的数据
const clearRegisterData = () => {
  registerData.value = {
    username: '',
    password: '',
    rePassword: ''
  }
}
import {useTokenStore} from "@/stores/token.js";
const tokenStore = useTokenStore();

import {useUserInfoStore} from "@/stores/user.js";
const  userInfoStore =useUserInfoStore();
import { loginService } from '@/api/user.js'

import{useRouter} from 'vue-router'
const router =useRouter();

//用于登录的事件函数
const login = async () => {
  let result = await loginService(registerData.value)
  // if(result.code===0){
  //   alert('登录成功!')
  // }else{
  //   alert('登录失败!')
  // }
  // alert(result.msg?result.msg:'登录成功!')
  ElMessage.success(result.msg?result.msg:'登录成功!')

 //得到的token存储到pinia
  tokenStore.setToken(result.data);

  //存储用户信息到pinia
  userInfoStore.setInfo()

  //借助路由完成页面跳转
   router.push('/')


}
import {UsernameStore} from "@/stores/user.js";
const usernameStore = UsernameStore();
const username = async () => {

  usernameStore.setUsername(registerData.value.username);


}



</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-image class="logo" style="height: 60px;width: 283px" :src="'https://eye-ground.oss-cn-beijing.aliyuncs.com/logo.png'"  />

      <!-- 注册表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="registerDataRules">

        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group  placeholder="请选择角色" v-model="registerData.role" >
            <el-radio label="专家" value="专家" border />
            <el-radio label="工程师" value="工程师" border />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" @click="register" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="clearRegisterData();isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="registerDataRules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group  placeholder="请选择角色" v-model="registerData.role" size="large" >
            <el-radio label="专家" value="专家" border />
            <el-radio label="工程师" value="工程师" border />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false" >忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister=true;clearRegisterData()">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
    url('@/assets/login_bg (2).png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
      background-color: blueviolet;
      border: blueviolet;
    }

    .el-link {
      color: blueviolet;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
.logo{
margin-bottom: 20px;
}
</style>