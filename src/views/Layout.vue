<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#6C5DD3"  text-color="#fff"
               router>
        <el-menu-item index="/doctor/getList">
          <el-icon>
            <Management />
          </el-icon>
          <span>眼底图像数据管理</span>
        </el-menu-item >
        <el-menu-item index="/doctor/diagnosisResult">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>智能分级诊断</span>
        </el-menu-item>
        <el-menu-item index="/doctor/evaluateResult">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>诊断结果反馈</span>
        </el-menu-item>

        <el-sub-menu>
          <el-menu-item index="/user/info">
            <el-icon>
              <Crop />
            </el-icon>
            <span>个人主页</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar" >
            <el-icon>
              <EditPen />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>

          <el-menu-item index="/user/password" >
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>早上好：<strong>王医生</strong></div>
        <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">个人信息</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <div style=" height: 570px;border: 1px solid #ffffff;">
          <router-view></router-view>
        </div>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>基于tf的眼底图像辅助准段系统 ©2024 Created by ZWX</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: white;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;

    }
  }

  .el-header {
    background-color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: rgba(102, 102, 102, 0.99);
  }
}
</style>