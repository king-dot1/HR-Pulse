// 角色管理 api 模块
import request from '@/utils/request'

// 分页查询角色列表
export const roleGetPageService = (params) => request.get('/sys/role', { params })

// 新增 -角色
export const roleAddService = (data) => request.post('/sys/role', data)

// 修改 -角色
export const roleUpdateService = (data) => request.put(`/sys/role/${data.id}`, data)

// 删除 -角色
export const roleDeleteService = (id) => request.delete(`/sys/role/${id}`)

// 获取 -角色详情
export const roleGetDetailService = (id) => request.get(`/sys/role/${id}`)

// 获取 -已开启的角色列表
export const roleGetAllService = () => request.get('/sys/role/list/enabled')

// 分配权限-角色
export const roleAssignPermsService = (data) => request.put('/sys/role/assignPrem', data)
