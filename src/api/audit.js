import request from '@/utils/request'

//获取审计列表
export function getAuditList(params) {
    return request({
      url: '/audit/tasks',
      method: 'get',
      params
    })
}

//获取审计详情
export function getAuditDetail(id) {
    return request({
      url: `/audit/task/${id}`,
      method: 'get',
    })
}

//启动审计
export function startAudit(projectName, data) {
    return request({
      url: '/audit/start',
      method: 'post',
      params: { projectName },
      data
    })
}

//删除任务
export function deleteTask(id) {
    return request({
      url: `/audit/task/${id}`,
      method: 'delete',
    })
}

//获取审计报告
export function getAuditReport(id) {
    return request({
      url: `/audit/task/${id}/report`,
      method: 'get',
    })
}

//下载HTML报告
export function downloadHtmlReport(id) {
    return request({
      url: `/audit/task/${id}/report/html`,
      method: 'get',
    })
}

//获取漏洞列表
export function getVulnerabilityList(id) {
    return request({
      url: `/audit/task/${id}/vulnerabilities`,
      method: 'get',
    })
}

//获取漏洞统计
export function getVulnerabilityStatistics(id) {
    return request({
      url: `/audit/task/${id}/statistics`,
      method: 'get',
    })
}
