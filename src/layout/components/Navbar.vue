<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 消息图标 -->
      <div class="icon-info">
        <i class="el-icon-bell" />
      </div>
      <!-- 头像 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <!-- 头像空时 -->
          <span v-else class="empty-avatar">
            {{ (name+"").substr(0,1) }}
          </span>

          <span class="name">{{ name }}</span>
        </div>
        <!-- 下拉菜单 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="dialogVisible=true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 弹出层 -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <!-- 表单 -->
        <el-form ref="formRef" size="small" :model="formModel" :rules="rules" width="20%" label-width="120px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="formModel.oldPassword" placeholder="请输入旧密码" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="formModel.newPassword" placeholder="请输入新密码" type="password" />
          </el-form-item>
          <el-form-item label="重复密码" prop="confirmPassword">
            <el-input v-model="formModel.confirmPassword" placeholder="请再次输入密码" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="upPassword">确定修改</el-button>
            <el-button @click="dialogVisible=false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { userLogoutService } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      dialogVisible: false,
      formModel: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入长度为6-16位的密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入重复密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value !== this.formModel.newPassword) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  watch: {
    dialogVisible(flag) {
      // 表单重置; 打开重置
      if (flag) this.$refs.formRef.resetFields()
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 登出
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    // 调用接口获取用户信息
    async getUserInfo() {
      await this.$store.dispatch('user/getUserInfoStore')
    },
    // 修改密码
    async upPassword() {
      // 表单校验
      await this.$refs.formRef.validate()
      // 调用接口
      await userLogoutService(this.formModel)
      this.dialogVisible = false
      // 提示
      this.$message({
        message: '修改成功',
        type: 'success'
      })
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    // flex
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .name {
          cursor: pointer;
          margin: 0 40px 0 20px;
          font-size: 16px;
          color: #383c4e;
        }
        // 头像空时
        .empty-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color:#fff;
        }
      }
    }

    // 消息图标
   .icon-info {
      cursor: pointer;
      font-size: 23px;
      margin-right: 15px;
   }
  }
}
</style>
