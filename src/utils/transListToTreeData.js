// 递归转化树形结构
// list 是包含多个对象的数组，每个对象代表一个节点，有 id 和 pid 属性
// rootValue 用于查找当前层级的父节点的值
export const transListToTreeData = (list, rootValue) => {
  // 定义一个空数组，用于存储当前层级的节点
  const arr = []
  // 遍历传入的列表
  list.forEach(item => {
    // 检查当前元素的 pid 是否等于 rootValue
    // 如果相等，说明该元素是当前层级的节点
    if (item.pid === rootValue) {
      // 递归调用 transListToTreeData 函数，以当前节点的 id 作为新的 rootValue
      // 目的是查找当前节点的子节点
      const children = transListToTreeData(list, item.id)
      // 将递归调用得到的子节点数组赋值给当前节点的 children 属性
      // 当前节点没有子节点，不添加children属性
      if (children.length > 0) {
        item.children = children
      }
      // item.children = children
      // 将包含子节点的当前节点添加到结果数组中
      arr.push(item)
    }
  })
  // 返回包含当前层级节点的数组
  return arr
}
