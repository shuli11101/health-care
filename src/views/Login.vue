<script setup>
  import { Back } from '@element-plus/icons-vue'
  import { reactive, ref } from 'vue'


  // 用户信息
  const form = reactive({
    username: '',
    password: ''
  })

  const rules = reactive({
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' }
    ]
  })

  // 登陆校验
  const loginRef = ref()
  const loginAccount = async (formEl) => {
    if(!formEl) return
    await formEl.value.validate()
  }

</script>




<template>
  <div class="container">
    <div class="title">
      <p class="back-home">
        <el-icon><Back /></el-icon>
        <span><router-link to="/">返回首页</router-link></span>
      </p>
      <div class="title-text">
        <h2>登陆您的账户</h2>
        <p>请输入您的登陆信息</p>
      </div>
    </div>
    <div class="login-form">
      <el-form
        :model="form"
        :rules="rules"
        :ref="loginRef"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="form.username" size="large" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="btn" size="large" @click="loginAccount(loginRef)">登陆</el-button>
      <div class="footer">
        <p>还没有账号？<router-link to="/auth/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
  .container {
    width: 384px;
    .back-home {
      margin-bottom: 60px;
    }
    .title-text{
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }

    .login-form {
      margin-top: 10px;
      width: 100%;
      .btn {
        width: 100%;
        margin-top: 30px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        .router-link {
          color: #244972;
          }
        }
    }
  }
</style>