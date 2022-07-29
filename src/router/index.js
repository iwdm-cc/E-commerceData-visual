import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '../views/ScreenPage'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/screen'
  },
  {
    path:'/screen',
    name:'screen',
    component:ScreenPage
  },


]

const router = new VueRouter({
  routes
})

export default router
