<template>
  <el-dialog
    title="员工导入"
    :visible="dialogVisible"
    width="30%"
    @close="$emit('update:dialogVisible', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-demo">
        <input ref="upload-input" accept=".xlsx,.xls" type="file" class="upload-input" @change="uploadFielChange">
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button size="small" type="text" @click="getTemplate">下载导入模板</el-button>
          <div class="el-upload__text">将文件拖到此处或
            <el-button type="text" @click="uploadFiel">点击上传</el-button>
          </div>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button size="mini" type="primary" @click="$emit('update:dialogVisible', false)">取 消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { employeeTmplateService, employeeImportService } from '@/api/employee'
import FileSaver from 'file-saver'

export default ({
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 下载模板
    async getTemplate() {
      const res = await employeeTmplateService()
      FileSaver.saveAs(res.data, '员工导入模板.xlsx')
    },

    // 触发上传按钮
    uploadFiel() {
      this.$refs['upload-input'].click()
    },

    // 监听文件上传
    async uploadFielChange(e) {
      if (!e.target.files[0]) {
        this.$message({
          message: '请选择文件',
          type: 'warning'
        })
        return
      }
      // 创建表单对象
      const formData = new FormData()
      // 将文件添加到表单对象中
      formData.append('file', e.target.files[0])

      try {
        await employeeImportService(formData)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.$emit('update:dialogVisible', false)
        // 告知父组件上传成功
        this.$emit('success')
      } catch (error) {
        // 上传失败，清空文件输入框
        // this.$refs['upload-input'].value = ''
      }
      // 上传失败，清空文件输入框
      this.$refs['upload-input'].value = ''
    }
  }
})
</script>

<style lang="scss" scoped>
.upload-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 360px;
  height: 180px;
  margin: 20px;
  // 隐藏上传按钮
  .upload-input {
    display: none;
  }
  // 上传
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    line-height: 40px;
    border-radius: 5px;
    color: #bbb;

    // 图标
    .el-icon-upload{
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
    // 按钮文字
    .el-button {
      padding: 12px 0;
      font-size: 14px
    }
  }
}
</style>
