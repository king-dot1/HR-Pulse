<template>
  <el-cascader
    :value="value"
    size="mini"
    style="width:300px"
    :options="options"
    :props="props"
    placeholder="请选择"
    separator="-"
    @change="handleChange"
  />
</template>

<script>
import { departmentListService } from '@/api/department.js'
import { transListToTreeData } from '@/utils/transListToTreeData.js'

export default {
  name: 'SelectTree',
  props: {
    value: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      // 部门数据
      options: [],
      // 设置数据源的字段
      props: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    // 获取部门数据
    async getDepartmentList() {
      const res = await departmentListService()
      this.options = transListToTreeData(res.data, 0)
    },

    // 部门变化时触发
    handleChange(value) {
      // 取最后一个id
      if (value.length > 0) {
        // *1 转换为数字
        this.$emit('input', value[value.length - 1] * 1)
      } else {
        // 长度为0，什么值为空
        this.$emit('input', null)
      }
    }
  }
}
</script>

<style>

</style>
