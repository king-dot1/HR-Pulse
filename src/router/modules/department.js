import layout from '@/layout'
export default {
  path: '/department',
  component: layout,
  children: [
    {
      path: '',
      name: 'department',
      component: () => import('@/views/department'),
      meta: { title: '组织', icon: 'tree' }
    }
  ]
}

