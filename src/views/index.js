import MkModular from './MkModular.vue'

const mK = {
  install (Vue, options) { 
    Vue.component('mk-modular', MkModular);
  }
}

export default mK