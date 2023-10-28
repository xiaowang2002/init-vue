import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import plugins from './plugins' // plugins
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import directive from './directive/clipboard' // directive
import * as filters from './filters' // global filters
import { parseTime, resetForm, handleTree, addDateRange } from "@/utils/common";
import { getDicts } from "@/api/system/dict/data";
// 分页组件
import Pagination from "@/components/Pagination";
// 字典数据组件
import DictData from '@/components/DictData'
// 字典标签组件
import DictTag from '@/components/DictTag'
// echarts
import * as echarts from 'echarts'

import { download } from '@/utils/request'

Vue.prototype.getDicts = getDicts
Vue.prototype.$echarts = echarts
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
Vue.prototype.resetForm = resetForm
// 全局方法挂载
Vue.prototype.handleTree = handleTree
Vue.prototype.download = download
Vue.prototype.addDateRange = addDateRange
Vue.prototype.parseTime = parseTime
DictData.install()
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('ImageUpload', ImageUpload)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
Vue.use(directive)
Vue.use(plugins)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
