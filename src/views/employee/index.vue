<template>
  <div class="container">
    <div class="app-container">
      <!-- 左树 -->
      <div class="left">
        <el-input v-model="paramsQuery.keyword" size="small" prefix-icon="el-icon-search" placeholder="输入员工姓名全员搜索" @input="changeValue" />

        <!-- 树结构 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          highlight-current
          :expand-on-click-node="false"
          :data="treeList"
          :props="defaultProps"
          default-expand-all
          @current-change="handleNodeChange"
        />
      </div>
      <!-- 右表 -->
      <div class="right">
        <!-- 操作区 -->
        <el-row class="operate-area" type="flex">
          <el-col>
            <el-button size="mini">群发通知</el-button>
          </el-col>
          <el-col>
            <el-row type="flex" justify="end">
              <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
              <el-button size="mini" @click="dialogVisible = true">excel导入</el-button>
              <el-button size="mini" :loading="loading" @click="exportEmployee">excel导出</el-button>
            </el-row>
          </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="48"
          />
          <el-table-column
            prop="staffPhoto"
            label="头像"
            align="center"
          >
            <template v-slot="{row}">
              <span class="img-staffPhoto">
                <el-image v-if="row.staffPhoto" :src="row.staffPhoto" />
                <!-- 头像空 -->
                <span v-else class="empty">{{ (row.username+'').charAt(0) }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
            sortable
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
          >
            <template v-slot="{row}">
              <span>{{ row.formOfEmployment === 1 ? '正式' : '非正式' }}</span>
            </template></el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
          />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            sortable
          />
          <el-table-column width="180" label="操作">
            <template v-slot="{row}">
              <el-button type="text" size="mini" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="mini">角色</el-button>
              <el-popconfirm
                style="margin-left: 10px;"
                title="确定删除这段内容吗？"
                @onConfirm="delEmployee(row.id)"
              >
                <el-button slot="reference" type="text" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row type="flex" justify="end" style="height: 60px;" align="middle">
          <el-pagination
            :current-page.sync="paramsQuery.page"
            :page-size="paramsQuery.pagesize"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </div>
    </div>
    <!-- 弹层导入 -->
    <importExcelVue :dialog-visible.sync="dialogVisible" @success="getEmployeeList" />
  </div>
</template>

<script>
import { departmentListService } from '@/api/department'
import { transListToTreeData } from '@/utils/transListToTreeData'
import { employeeListService, employeeExportService, employeeDeleteService } from '@/api/employee'
import FileSaver from 'file-saver'
import importExcelVue from './components/importExcel.vue'

export default ({
  name: 'EmployeeIndex',
  components: {
    importExcelVue
  },
  data() {
    return {
      treeList: [], // 树结构数据
      defaultProps: { // 树结构属性
        children: 'children',
        label: 'name'
      },
      tableData: [], // 表格数据
      paramsQuery: {
        departmentId: null, // 部门id,根据部门查询当前部门及子部门的用户
        page: 1, // 当前页码
        pagesize: 10, // 每页显示条数
        keyword: '' // 搜索关键字
      },
      total: 0, // 总条数
      timer: null, // 定时器
      dialogVisible: false, // 弹层是否显示
      loading: false // 导出按钮是否加载中
    }
  },
  created() {
    this.getTreeList()
    this.getEmployeeList()
  },
  methods: {
    // 获取树结构数据
    async getTreeList() {
      // 默认获取10条
      const res = await departmentListService()
      this.treeList = transListToTreeData(res.data, 0)
      this.paramsQuery.departmentId = this.treeList[0].id
      // nextTick 是在 DOM 更新完成后执行的回调函数
      this.$nextTick(() => {
      // 树结构高亮当前节点
        this.$refs.deptTree.setCurrentKey(this.paramsQuery.departmentId)
      })
    },

    // 获取员工列表
    async getEmployeeList() {
      const res = await employeeListService(this.paramsQuery)
      this.tableData = res.data.rows
      this.total = res.data.total
    },

    // 当前页码改变
    handleCurrentChange(val) {
      this.paramsQuery.page = val
      this.getEmployeeList()
    },

    // 节点改变时触发
    handleNodeChange(data) {
      this.paramsQuery.departmentId = data.id
      this.getEmployeeList()
    },

    // 搜索
    changeValue() {
      // 防抖动; 设置时间，在时间内如果再次触发，就会清除定时器，重新设置定时器
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.paramsQuery.page = 1
        this.getEmployeeList()
      }, 300)
    },

    // 导出员工信息
    async exportEmployee() {
      this.loading = true
      try {
        const res = await employeeExportService()
        // file-sarver包 实现下载 Blob文件
        FileSaver.saveAs(res.data, '员工信息.xlsx')
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(error)
      }

      // // 创建下载链接
      // const url = URL.createObjectURL(res.data)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = '员工信息.xlsx'
      // a.click()
      // // 释放 URL 对象
      // URL.revokeObjectURL(url)
    },

    // 删除员工
    async delEmployee(id) {
      await employeeDeleteService(id)
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      // 处理最后一条数据
      if (this.tableData.length === 1 && this.paramsQuery.page > 1) this.paramsQuery.page--
      this.getEmployeeList()
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  .app-container {
    display: flex;
    .left {
      width: 280px;
      padding: 20px;
      border-right: 1px solid #eaeef4;
    }
    .right {
      flex: 1;
      padding: 20px;
      // 操作区
      .operate-area {
        margin: 10px;
      }

      /* 使用 ::v-deep 穿透修改表格表头颜色 */
      ::v-deep .el-table thead th {
        background-color: #f5f6f8; /* 可根据需求调整颜色 */
      }

      // 头像
      .img-staffPhoto {
        width: 30px;
        height: 30px;
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;

        .el-image {
          width: 30px;
          height: 30px;
          img {
            width: 100%;
            height: 100%;
          }
        }

        // 头像空时显示
        .empty {
          width: 100%;
          height: 100%;
          line-height: 30px;
          display: inline-block;
          text-align: center;
          background: #04c9be;
          color: #fff;
          font-size: 12px;
        }
      }

    }
  }
}
</style>

