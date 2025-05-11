<template>
  <div class="dept">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- 表单 -->
      <el-form ref="formRef" :model="formModel" :rules="rules" size="small" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formModel.name" style="width:80%" placeholder="2-10个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formModel.code" style="width:80%" placeholder="2-10个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="managerId">
          <dept-select-vue v-model="formModel.managerId" style="width:80%" />
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formModel.introduce" :rows="4" style="width:80%" type="textarea" placeholder="1-100个字符" />
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-button type="primary" @click="addEdit">确定</el-button>
              <el-button type="default" @click="dialogVisible = false">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item></el-form>

    </el-dialog>
  </div>
</template>

<script>
import deptSelectVue from './deptSelect.vue'
import { departmentListService, departAddService, departEditService } from '@/api/department'

export default {
  name: 'AddEditDept',
  components: {
    deptSelectVue
  },
  data() {
    return {
      title: '新增部门',
      dialogVisible: false, // 弹层是否显示
      formModel: {
        code: '', // 部门编码: 校验1: 1-50个字符之间. 校验2: 所有部门编码不可以重复
        introduce: '', // 部门介绍： 校验1: 1-300个字符之间
        managerId: '', // 部门负责人名字
        name: '', // 部门名称 校验1: 1-50个字符之间. 校验2: 同级部门中不能出现重复部门名字
        pid: '' // 部门父级部门id

      },
      rules: {
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码长度为2-10个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            if (this.formModel?.id) return callback()

            // 校验2: 所有部门编码不可以重复
            const { data } = await departmentListService()
            const code = data.find(item => item.code === value)
            if (code) {
              callback(new Error('部门编码不可以重复'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍的长度为1-100个字符', trigger: 'blur' }
        ],
        managerId: [
          { required: true, message: '请选择部门负责人', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称长度为2-10个字符', trigger: 'blur' },
          { validator: async(rule, value, callback) => {
            if (this.formModel?.id) return callback()

            // 校验2: 同级部门中不能出现重复部门名字
            const { data } = await departmentListService()
            const name = data.find(item => item.name === value)
            if (name) {
              callback(new Error('部门名称不可以重复'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // 打开弹层
    // 接收 pid, data
    // data 有数据是编辑，否则添加
    openDialog(pid, data) {
      data ? this.title = '编辑部门' : this.title = '新增部门'
      // 重置表单
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields()
      }
      this.formModel = {
        code: '',
        introduce: '',
        managerId: '',
        name: '',
        pid: ''
      }
      if (data) {
        // 编辑
        this.formModel = {
          ...data
        }
      } else {
        // 添加
        this.formModel.pid = pid
      }
      this.dialogVisible = true
    },

    // 添加部门/编辑
    async addEdit() {
      // 开启loading
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        // 预校验
        await this.$refs.formRef.validate()

        // 判断是添加还是编辑
        this.formModel.id
          ? await departEditService(this.formModel)
          : await departAddService(this.formModel)

        this.dialogVisible = false
        // 告诉父父组件，添加成功
        this.$emit('success')
        this.$message({
          message: this.formModel.id ? '更新部门成功' : '新增部门成功',
          type: 'success'
        })
      } catch (error) {
        loading.close()
      }
      loading.close()
    }

  }
}
</script>

<style>

</style>
