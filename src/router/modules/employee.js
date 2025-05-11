import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: 'detail/:id?', // 动态路由 传递参数
    component: () => import('@/views/employee/detail'),
    name: 'employeeDetail', // 可以用来跳转 也可以标记路由
    hidden: true, // 隐藏在左侧菜单中
    meta: {
      // 路由元信息 存储数据的
      title: '员工详情' // 标题
    }
  }]
}
