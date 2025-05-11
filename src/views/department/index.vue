<template>
  <div class="container">
    <div class="app-container">
      <el-tree v-loading="loading" :data="tissue" default-expand-all :props="defaultProps" :expand-on-click-node="false">
        <!-- 节点架构 -->
        <template slot-scope="{ node,data }">
          <!-- 架构 -->
          <el-row class="architecture-row">
            <el-col>{{ node.label }}</el-col>
            <el-col class="right-flex" :span="4">
              <!-- 身份 -->
              <span class="rank">{{ data.managerName }}</span>
              <!-- 下拉菜单 -->
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addDept(data.id)">添加子部门</el-dropdown-item>
                  <el-dropdown-item @click.native="editDept(data)">编辑部门</el-dropdown-item>
                  <el-dropdown-item @click.native="delDept(data.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
      <!-- 弹层 -->
      <AddEditDept ref="deptRef" @success="onSuccess" />
    </div>
  </div>
</template>

<script>
import { departmentListService, departDelService } from '@/api/department'
import { transListToTreeData } from '@/utils/transListToTreeData'
import AddEditDept from './components/addEditDept.vue'

export default ({
  name: 'DepartmentIndex',
  components: {
    AddEditDept
  },
  data() {
    return {
      // 数据
      tissue: [],
      defaultProps: {
        // 子节点的字段名
        children: 'children',
        // 显示内容的字段名
        label: 'name'
      },
      loading: false // 加载中
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    // 获取部门列表
    async getDepartmentList() {
      this.loading = true
      const res = await departmentListService()
      this.tissue = transListToTreeData(res.data, 0)
      this.loading = false
    },

    // 添加部门
    addDept(id) {
      // 打开弹层
      this.$refs.deptRef.openDialog(id)
    },

    // 编辑部门
    editDept(data) {
      // 打开弹层
      this.$refs.deptRef.openDialog(data.id, data)
    },

    // 成功回调 - 重新获取部门列表
    onSuccess() {
      this.getDepartmentList()
    },

    // 删除
    delDept(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await departDelService(id)
          this.$message({
            type: 'success',
            message: '删除部门成功!'
          })
          this.getDepartmentList()
        } catch (error) {
          this.$message({
            type: 'error',
            message: error.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
  /* 架构 */
  .architecture-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    .right-flex {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 200px;
      .rank {
        width: 60px;
        margin: 10px;
        display: inline-block;
        // overflow: hidden;
      }
    }

  }
}

</style>

