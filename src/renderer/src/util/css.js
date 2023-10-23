/*
 * @Descripttion:提供工共的函数
 * @version:
 * @Author: wwy
 * @Date: 2022-07-14 23:07:11
 * @LastEditors: wwy
 * @LastEditTime: 2022-08-08 16:03:20
 */

/**
 * @name: wwy
 * @msg: 全局的设置html下的css变量
 * @return {*}
 */
export class cssVarUtils {
  constructor() {
    this.root = document.querySelector(':root')
  }

  getVar(ver) {
    let allStyle = getComputedStyle(this.root)
    return allStyle.getPropertyValue(ver)
  }

  setVar(ver, val) {
    this.root.style.setProperty(ver, val)
  }
}
