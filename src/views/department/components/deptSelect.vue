<template>
  <div class="dept-select">
    <el-select :value="value" placeholder="请选择负责人" @change="onChange">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.username"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
import { departLeaderListService } from '@/api/department'

export default {
  name: 'DeptSelect',
  props: {
    value: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      options: []
    }
  },
  created() {
    this.getLeaderList()
  },
  methods: {
    // 获取负责人列表
    async getLeaderList() {
      const res = await departLeaderListService()
      this.options = res.data
    },
    // 选择负责人
    onChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">
.el-select {
  width: 100%;
}

</style>
