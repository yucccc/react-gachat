/**
 * 存储localStorage
 */
export const setStore = (name, content, type) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  // 没传类型就默认sessionStorage
  return type ? window.localStorage.setItem(name, content)
    : window.sessionStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = (name, type) => {
  if (!name) return
  return type ? window.localStorage.getItem(name)
    : window.sessionStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = (name, type) => {
  if (!name) return
  return type ? window.localStorage.removeItem(name)
    : window.sessionStorage.removeItem(name)
}
