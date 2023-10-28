import { constantRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state) => {
    state.routes = constantRoutes
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES')
      resolve(constantRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
