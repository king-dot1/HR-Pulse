// 组织模块；api
import request from '@/utils/request' // 导入请求模块

// 获取-部门列表
export const departmentListService = () => request.get('/company/department')

// 获取-部门负责人列表
export const departLeaderListService = () => request.get('/sys/user/simple')

// 新增-部门
export const departAddService = (data) => request.post('/company/department', data)

// 编辑-部门
export const departEditService = (data) => request.put(`/company/department/${data.id}`, data)

// 删除-部门
export const departDelService = (id) => request.delete(`/company/department/${id}`)
