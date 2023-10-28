import tab from './tab'
import download from './download'

export default {
  install(Vue) {
    // 页签操作
    Vue.prototype.$tab = tab
    // 下载文件
    Vue.prototype.$download = download
  }
}
