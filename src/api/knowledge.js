import request from '@/utils/request'
/**
 * @function 知识库列表
 * @description 搜索知识库
 */
export function searchKnowledge(params) {
  return request({
    url: '/knowledge/search',
    method: 'get',
    params
  })
}

//添加知识条目
export function addKnowledge(data) {
  return request({
    url: '/knowledge/add',
    method: 'post',
    data
  })
}

//删除知识条目
export function deleteKnowledge(id) {
  return request({
    url: `/knowledge/${id}`,
    method: 'delete'
  })
}

//获取所有分类
export function getAllCategory() {
  return request({
    url: '/knowledge/categories',
    method: 'get'
  })
}

//获取所有漏洞类型
export function getAllVulType() {
  return request({
    url: '/knowledge/vulnTypes',
    method: 'get'
  })
}
