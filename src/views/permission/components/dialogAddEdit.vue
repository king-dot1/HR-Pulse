<template>
  <el-dialog
    :title="formModel.id ? '编辑权限' : '添加权限'"
    :visible.sync="dialogVisible"
    width="50%"
    class="dialog-add-edit"
  >
    <!-- 表单 -->
    <el-form ref="formRef" label-width="120px" :model="formModel" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formModel.name" style="width: 90%" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formModel.code" style="width: 90%" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formModel.description" style="width: 90%" placeholder="请输入权限描述" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch v-model="formModel.enVisible" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" :loading="loading" type="primary" @click="add">确 定</el-button>
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { permissionListService, permissionAddService, permissionEditService } from '@/api/permission'

export default {
  name: 'DialogAddEdit',
  data() {
    return {
      dialogVisible: false, // 弹层是否可见
      // 表单数据
      formModel: {
        name: '', // 权限名称
        code: '', // 权限标识
        description: '', // 权限描述
        type: 1, // 权限类型 1 添加 2 编辑 (点击编辑或添加时，就要赋值)
        pid: 0, // 上级权限id
        enVisible: false // 权限点开启状态
      },
      rowChildren: [], // 存储当前权限点的子集们
      // 表单校验规则
      rules: {
        // 校验: 权限点"名字"不能和子集们现有的权限点名字重复
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            // 如果是编辑, 则需要校验
            if (this.rowChildren?.length > 0 && this.formModel.type === 2) {
              const isExist = this.rowChildren.some(item => item.name === value)
              isExist ? callback(new Error('权限名称不可与子权限点重名')) : callback()
            } else {
              // 添加时, 直接通过
              callback()
            }
          }, trigger: 'blur' }
        ],
        // 校验: 权限标识不能和所有人重复, 应该是唯一的标识重要, 后续前端需要用此值做判断
        code: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            // 获取所有权限点
            const res = await permissionListService()
            const isExist = res.data.some(item => item.code === value && item.id !== this.formModel.id)
            isExist ? callback(new Error('权限标识不可与其他权限点重复')) : callback()
          }, trigger: 'blur' }
        ]
      },
      loading: false // 按钮加载状态

    }
  },
  methods: {
    // 点击添加/编辑按钮
    async add() {
      this.loading = true
      try {
        // 校验
        await this.$refs.formRef.validate()
        // 提交
        this.formModel.id
          ? await permissionEditService({ ...this.formModel, enVisible: this.formModel.enVisible ? 1 : 0 })
          : await permissionAddService({ ...this.formModel, enVisible: this.formModel.enVisible ? 1 : 0 })

        this.$message({
          message: this.formModel.id ? '更新成功' : '新增成功',
          type: 'success'
        })
        // 关闭弹层
        this.dialogVisible = false
        // 重新获取表格数据
        this.$emit('success')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },

    /**
     * 打开弹层
     * flag, true: 编辑, false: 添加
     * row 当前权限点
     */
    open(flag, row) {
      // 重置表单
      if (this.$refs.formRef) {
        // 清空校验
        this.$refs.formRef.clearValidate()
        this.formModel = {
          name: '', // 权限名称
          code: '', // 权限标识
          description: '', // 权限描述
          type: 1, // 权限类型 1 添加 2 编辑 (点击编辑或添加时，就要赋值)
          pid: 0, // 上级权限id
          enVisible: false // 权限点开启状态; 0关闭, 1开启
        }
      }

      if (flag) {
        // 编辑
        this.formModel = { ...row, enVisible: row.enVisible === '1' }
        this.rowChildren = row?.children
      } else {
        // 添加；判断 row 是否存在
        if (row) {
          this.formModel.type = 2
          this.formModel.pid = row.id
          this.rowChildren = row?.children
        } else {
          this.formModel.type = 1
        }
      }
      this.dialogVisible = true
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog-add-edit {
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}

</style>
