import Vue from 'vue'

import App from './App'
// import materialize from 'materialize';
import 'materialize-css/dist/css/materialize.css';
import '../../static/assets/loading.css';
import '../../static/font/iconfont.css';



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')
