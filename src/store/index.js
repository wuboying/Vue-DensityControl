import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	ashData:'',
	densityData:'',
	valveData:''
	  
  },
  getters: {
    getAshData(state){
      return state.ashData
    },
	getDensityData(state){
	  return state.densityData
	},
	getValveData(state){
	  return state.valveData
	}
  },
  mutations: {
	  getAshDataWeb:(state, menu)=>{
	    state.ashData = menu
	  },
	  getDensityDataWeb:(state, menu)=>{
	    state.densityData = menu
	  },
	  getvalveDataWeb:(state, menu)=>{
	    state.valveData = menu
	  }
	  
  },
  actions: {
	  
	  setAshDataWeb({commit}, data){
	    commit('getAshDataWeb', data) 
	  },
	  setDensityDataWeb({commit}, data){
	    commit('getDensityDataWeb', data) 
	  },
	  setvalveDataWeb({commit}, data){
	    commit('getvalveDataWeb', data) 
	  }
	  
  },
})
