import request from '@/utils/request'
/**
 * 获取员工列表
 * page 页码
 * size每页条数
 * @param {*} params
 * @returns
 */
export const getEmployee = ({ page, size }) => {
  return request({
    url: '/sys/user',
    params: { page, size }
  })
}

// 给员工分配角色
export const assignRoles = ({ id, roleIds }) => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data: { id, roleIds }
  })
}
