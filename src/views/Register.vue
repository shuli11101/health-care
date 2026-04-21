<script setup>
import { ref } from 'vue'
import { registerAccount } from '@/api/front.js'
import router from '@/router/backrouter.js'
import { ElMessage } from 'element-plus'

// 表单
const formRef = ref(null)
const formData = ref({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  userType: 1
})

// 验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  try{
    await formRef.value.validate()
    const res = await registerAccount(formData.value)
    console.log(res)
    ElMessage.success('注册成功')
    router.push('/auth/login')

  } catch(err) {
    console.error('注册失败-完整错误:', err)
    console.error('注册失败-响应数据:', err?.response?.data)
    console.error('注册失败-状态码:', err?.response?.status)
    console.log('注册方面', err)
  }
}
</script>

<template>
  <div class="container">
    <div class="flex-box">
      <div class="title">
        <div class="title-text">
          <h2>创建您的账户</h2>
          <p>请填写注册信息</p>
        </div>
      </div>
    </div>
      <div class="form-container">
        <el-form :model="formData" ref="formRef" :rules="rules" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="formData.email" type="email"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input placeholder="请输入昵称（可选）" v-model="formData.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入手机号（可选）" v-model="formData.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" v-model="formData.password" type="password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input placeholder="请确认密码" v-model="formData.confirmPassword" type="password" show-password></el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button @click="submitForm" class="btn" type="primary">注册</el-button>
          <p style="margin-top: 10px">已经有帐户？<router-link to="/auth/login">去登陆</router-link></p>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 384px;
    .flex-box {
        display: flex;
        align-items: center;
    }
    .title {
        .title-text {
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
    }
    .form-container {
        margin-top: 20px;
        .btn {
            width: 100%;
        }
        .footer {
            padding: 30px;
            text-align: center;
        }
    }
}
</style>