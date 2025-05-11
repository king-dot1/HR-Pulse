<template>
  <div class="dept">
    <!-- 弹层 -->
    <el-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form ref="formRef" :model="formModel" :rules="rules" size="small" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formModel.name" style="width:80%" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="formModel.state" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formModel.description"
            type="textarea"
            style="width:80%"
            :rows="3"
            placeholder="请输入内容"
          /></el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-button :loading="loading" type="primary" @click="addRole">确定</el-button>
              <el-button @click="dialogVisible=false">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { roleAddService } from '@/api/role'

export default ({
  name: 'RoleDept',
  data() {
    return {
      loading: false, // 加载中
      dialogVisible: false,
      formModel: {
        name: '', // 角色名称
        description: '', // 角色描述
        state: 0 // 状态
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 打开弹层
    open() {
      // 重置表单
      if (this.$refs.formRef) this.$refs.formRef.resetFields()
      this.dialogVisible = true
    },

    // 添加角色
    async addRole() {
      this.loading = true
      try {
        // 校验
        await this.$refs.formRef.validate()
        // 调用接口
        await roleAddService(this.formModel)
        this.dialogVisible = false

        this.$emit('success')
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
