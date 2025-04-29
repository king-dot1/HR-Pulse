<template>
  <div class="login-container">
    <!-- logo -->
    <div class="logo" />
    <!-- 表单 -->
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!-- 登录表单 -->
        <el-form ref="formRef" :model="formModel" :rules="rules">
          <el-form-item prop="mobile">
            <el-input v-model="formModel.mobile" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="formModel.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item prop="isChecked">
            <el-checkbox v-model="formModel.isChecked">用户平台使用协议</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formModel: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isChecked: process.env.NODE_ENV === 'development' // 勾选框

      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^.{6,16}$/,
            message: '密码长度应该为6-16位之间',
            trigger: 'blur'
          }
        ],
        isChecked: [
          { validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback(new Error('您必须勾选用户的使用协议'))
            }
          }, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 登录
    async onLogin() {
      await this.$refs.formRef.validate()
      // 登录接口
      await this.$store.dispatch('user/login', this.formModel)
      // 登录成功后跳转到首页
      // 跳转主页
      this.$router.push('/')
      // 刷新页面
      // this.$router.go(0)
    }
  }
}
</script>

<style lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  // logo
  .logo {
    flex:3;
    background: rgba(38, 72, 176) url(('../../assets/common/login_back.png'))  no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
  }
  // 表单
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    h1 {
      font-size: 24px;
      padding-left: 20px;
    }
    .login-card {
      &.el-card {
        border: 0;
      }
      // 登录表单
      .el-form {
        .el-form-item {
          .el-input {
            width: 350px;
            height: 44px;
            .el-input__inner {
              width: 100%;
              height: 100%;
              background-color: #f4f5fb;
            }
          }
          .el-button {
            width: 100%;
            height: 40px;
          }
        }
      }
    }

  }
}
</style>
