<template>
  <div class="container">
    <div class="app-container">
      <!-- 按钮 -->
      <div class="heard">
        <el-button type="primary" size="mini" @click="openDept">添加角色</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="(index) => index + (params.page - 1) * params.pagesize + 1"
          width="50"
          label="序号"
        />
        <el-table-column
          prop="name"
          width="200"
          label="角色"
        >
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" placeholder="请输入角色名称" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="启用"
        >
          <template v-slot="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" />
            <span v-else>{{ row.state===1?'已开启':row.state===0?'未开启':'无' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
        >
          <template v-slot="{row}">
            <el-input
              v-if="row.isEdit"
              v-model="row.editRow.description"
              size="mini"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
            />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <div v-if="!row.isEdit">
              <el-button type="text" size="mini">分配权限</el-button>
              <el-button type="text" size="mini" @click="row.isEdit = true">编辑</el-button>
              <el-popconfirm style="margin-left:10px" title="确定删除这段内容吗？" @onConfirm="delRole(row.id)">
                <el-button slot="reference" type="text" size="mini">删除</el-button>
              </el-popconfirm>
            </div>
            <div v-else>
              <el-button size="mini" type="primary" @click="onUpdate(row)">确定</el-button>
              <el-button size="mini" @click="onCancel(row)">取消</el-button>
            </div>

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="page">
        <el-pagination
          layout="prev, pager, next"
          :page-size="params.pagesize"
          :current-page="params.page"
          :total="params.total"
          @current-change="changePage"
        />
      </div>

      <!-- 弹层 -->
      <RoleDept ref="deptRef" @success="getRoleList" />
    </div>
  </div>

</template>

<script>
import { roleGetPageService, roleUpdateService, roleDeleteService } from '@/api/role'
import RoleDept from './components/roleDept.vue'

export default ({
  name: 'RoleIndex',
  components: {
    RoleDept
  },
  data() {
    return {
      tableData: [], // 初始表格数据
      params: {
        page: 1, // 当前页码
        pagesize: 5, // 每页显示条数
        total: 0 // 总条数
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: { rows, total }} = await roleGetPageService(this.params)
      this.tableData = rows

      this.tableData.forEach(item => {
        // 给 rows 添加 isEdit 字段
        // this.$set() 用于向响应式对象添加属性，确保属性被正确响应
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
      this.params.total = total
    },

    changePage(newPage) {
      this.params.page = newPage // 更新当前页码
      this.getRoleList()
    },

    // 添加角色
    openDept() {
      this.$refs.deptRef.open()
    },

    // 取消编辑
    onCancel(row) {
      // 重置
      row.isEdit = false
      row.editRow = {
        name: row.name,
        state: row.state,
        description: row.description
      }
    },

    // 确认编辑
    async onUpdate(row) {
      // 判断角色是否存在
      const { data: { rows }} = await roleGetPageService({ page: 1, pagesize: 10000000 })
      const isExist = rows.find(item => item.name === row.editRow.name && item.id !== row.id)
      if (isExist) {
        this.$message({
          message: '角色已存在',
          type: 'warning'
        })
        return
      }

      if (row.editRow.name && row.editRow.description) {
        await roleUpdateService({ ...row.editRow, id: row.id, state: row.editRow.state ? 1 : 0 })
        // 更新表格数据
        // Object.assign() 方法用于将所有可枚举的自身属性的值从一个或多个源对象复制到目标对象
        Object.assign(row, { ...row.editRow, isEdit: false, state: row.editRow.state ? 1 : 0 })
        this.$message({
          message: '更新角色成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '角色名称和描述不能为空',
          type: 'warning'
        })
      }
    },

    // 删除角色
    async delRole(id) {
      await roleDeleteService(id)
      this.$message({
        message: '删除角色成功',
        type: 'success'
      })
      if (this.tableData.length === 1 && this.params.page > 1) this.params.page--
      this.getRoleList()
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  .app-container{
    padding: 20px;
    .heard {
      padding-bottom: 10px;
    }
        /* 使用 ::v-deep 穿透修改表格表头颜色 */
    ::v-deep .el-table thead th {
      background-color: #f5f6f8; /* 可根据需求调整颜色 */
    }

    // 分页
    .page {
      text-align: center;
      margin: 40px 0;
    }

  }
}

</style>

