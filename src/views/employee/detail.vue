<template>
  <div class="detail-container">
    <div class="app-container">
      <div class="detail-form">
        <el-form ref="formRef" :model="formModel" :rules="rules" label-width="220px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formModel.username" size="mini" style="width:300px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="formModel.workNumber" :disabled="true" size="mini" style="width:300px" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="formModel.mobile" :disabled="!!id" size="mini" style="width:300px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="部门" prop="departmentId">
            <!-- 部门组件 -->
            <elect-tree v-model="formModel.departmentId" />
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select v-model="formModel.formOfEmployment" size="mini" style="width:300px" placeholder="请选择">
              <el-option label="正式" :value="1" />
              <el-option label="非正式" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="入职时间"
            prop="timeOfEntry"
          >
            <el-date-picker
              v-model="formModel.timeOfEntry"
              size="mini"
              style="width:300px"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="转正时间"
            prop="correctionTime"
          >
            <el-date-picker
              v-model="formModel.correctionTime"
              size="mini"
              style="width:300px"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="员工头像">
            <!-- 上传图片组件 -->
            <upload-img v-model="formModel.staffPhoto" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="saveEmployee">{{ id?'保存更新':'保存' }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import electTree from './components/select-tree.vue'
import uploadImg from './components/upload-img.vue'
import { employeeInfoService, employeeUpdateService, employeeAddService } from '@/api/employee'

export default {
  name: 'EmployeeDetail',
  components: {
    electTree,
    uploadImg
  },
  data() {
    return {
      formModel: {
        username: '', // 姓名 1-4位
        mobile: '', // 手机号 11位
        formOfEmployment: '', // 聘用形式 1正式 2非正式
        workNumber: '', // 工号 禁用
        departmentId: '', // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 员工头像
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 4, message: '姓名长度在2-4个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < this.formModel.timeOfEntry) {
                callback(new Error('转正时间不能小于入职时间'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]

      }

    }
  },

  // 计算属性
  computed: {
    // 获取id
    id() {
      return this.$route.params.id
    }
  },
  created() {
    // 判断是否有id
    this.id && this.getEmployeeDetail(this.id)
  },

  methods: {
    // 获取员工详情
    async getEmployeeDetail(id) {
      const res = await employeeInfoService(id)
      this.formModel = res.data
    },

    // 保存/编辑
    async saveEmployee() {
      this.loading = true

      // 表单验证
      await this.$refs['formRef'].validate()
      if (this.id) {
        // 编辑
        await employeeUpdateService(this.formModel)
        this.$message({
          message: '更新员工成功',
          type: 'success'
        })
      } else {
        // 保存
        await employeeAddService(this.formModel)
        this.$message({
          message: '新增员工成功',
          type: 'success'
        })
      }

      // 跳转到列表页
      this.$router.push('/employee')
    }
  },

  // 路由守卫，在路由进入前执行
  beforeRouteEnter(to, from, next) {
    // 判断标题
    to.meta.title = to.params.id ? '员工详情' : '添加员工'
    next()
  }

}
</script>

<style lang="scss">
.app-container {
  .detail-form {
    background-color: #fff;
    padding: 20px;
  }
}

</style>
