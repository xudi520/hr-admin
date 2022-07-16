import request from '@/utils/request'

/**
 *获取企业的部门列表
 * @returns
 */
export const getDepartmenstList = () => {
  return request({
    url: '/company/department'
  })
}

// 根据部门id删除
export const delDepartment = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
