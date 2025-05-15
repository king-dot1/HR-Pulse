// 权限管理 api 模块
import request from '@/utils/request'

// 获取-权限列表
export const permissionListService = () => request.get('/sys/permission')

// 新增-权限点
export const permissionAddService = (data) => request.post('/sys/permission', data)

// 编辑-权限点
export const permissionEditService = (data) => request.put(`/sys/permission/${data.id}`, data)

// 删除-权限点
export const permissionDeleteService = (id) => request.delete(`/sys/permission/${id}`)

// 获取-权限详情
export const permissionDetailService = (id) => request.get(`/sys/permission/${id}`)
