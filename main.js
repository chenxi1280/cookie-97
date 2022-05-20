import Vue from 'vue'
import App from './App'
import { myRequest } from 'common/js/util/index.js'
import uView from 'uview-ui'
Vue.prototype.$myRequest = myRequest
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)

// const THREE = require('three')
const app = new Vue({
    ...App
})
app.$mount()
