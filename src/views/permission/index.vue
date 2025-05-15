<template>
  <div class="container">
    <div class="app-container">
      <!-- 按钮 -->
      <el-button style="margin-bottom: 20px;" size="mini" type="primary" @click="openDialog(false)">添加权限</el-button>
      <!-- 表格 -->
      <el-table style="width: 100%" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all border :data="tableData">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标记" prop="code" />
        <el-table-column label="描述" prop="description" />

        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="openDialog(false, row)">添加</el-button>
            <el-button type="text" @click="openDialog(true, row)">编辑</el-button>
            <el-button type="text" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 弹层 -->
      <dialog-add-edit ref="dialogRef" @success="getTableData" />
    </div>
  </div>

</template>

<script>
import { permissionListService, permissionDeleteService } from '@/api/permission'
import { transListToTreeData } from '@/utils/transListToTreeData'
import DialogAddEdit from './components/dialogAddEdit.vue'

export default ({
  name: 'PermissionIndex',
  components: {
    DialogAddEdit
  },
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const res = await permissionListService()
      this.tableData = transListToTreeData(res.data, 0)
    },

    // 打开弹层
    openDialog(flag, row) {
      this.$refs.dialogRef.open(flag, row)
    },

    // 删除
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 判断删除的是否有子集
        const hasChildren = this.tableData.some(item => item.id === id && item.children?.length > 0)
        if (hasChildren) {
          this.$message({
            type: 'warning',
            message: '该权限点有子集, 请先删除子集'
          })
          // 返回，不执行删除
          return
        }
        // 调用删除接口
        await permissionDeleteService(id)
        this.getTableData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {})
    }
  }
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
    /* 使用 ::v-deep 穿透修改表格表头颜色 */
    ::v-deep .el-table thead th {
      background-color: #f5f6f8; /* 可根据需求调整颜色 */
    }
}
</style>

