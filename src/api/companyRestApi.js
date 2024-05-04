import { __authenticatedRequest, __get } from "./_restApi"

export const findAllCompaniesByName = name => {
  if(!name) {
    return Promise.reject(new Error("Name is not valid"))
  }
  return __get('/data/company/find-by/name', { filter: name })
}

export const findOrCreateCompanyByName = (name, login) => {
  if(!name) {
    return Promise.reject(new Error("Name is not valid"))
  }
  if(!login) {
    return Promise.reject(new Error("Login is not defined"))
  }
  return __authenticatedRequest('/data/company/find-or-create', login, {
    options: { method: 'GET' },
    queryParams: { name }
  })
}