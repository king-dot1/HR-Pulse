// 员工管理 api 模块
import request from '@/utils/request'

// 获取 -员工列表
export const employeeListService = (params) => request.get('/sys/user', { params })

// 批量导出员工excel
export const employeeExportService = () => request.get('/sys/user/export', { responseType: 'blob' // 指定响应的数据类型
})

// 批量-下载导入员工模板
export const employeeTmplateService = () => request.get('/sys/user/import/template', {
  responseType: 'blob' // 指定响应的数据类型
})

// 批量-导入员工(上传excel)
export const employeeImportService = (file) => request.post('/sys/user/import', file, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 删除-员工
export const employeeDeleteService = (id) => request.delete(`/sys/user/${id}`)

// 获取-员工-基础信息
export const employeeInfoService = (id) => request.get(`/sys/user/${id}`)

// 修改-员工-基本信息
export const employeeUpdateService = (data) => request.put(`/sys/user/${data.id}`, data)

// 新增-员工
export const employeeAddService = (data) => request.post('/sys/user', data)

// 分配-员工-角色
export const employeeRoleService = (id, roleIds) => request.put('/sys/user/assignRoles', { id, roleIds })
