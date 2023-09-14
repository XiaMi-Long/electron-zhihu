const Store = require('electron-store')
const store = new Store()

const setStore = function (event, key, value) {
  store.set(key, value)
}

const getStore = function (event, key) {
  return store.get(key)
}

const delStore = function (event, key) {
  store.delete(key)
}

const hasStore = function (event, key) {
  return store.has(key)
}

export { setStore, getStore, delStore, hasStore }
