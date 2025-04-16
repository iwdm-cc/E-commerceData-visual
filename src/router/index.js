import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '../views/ScreenPage'
import RevenueScreen from '../views/RevenueScreen'
import EnrollmentScreen from '../views/EnrollmentScreen'
import RefundScreen from '../views/RefundScreen'
import TestPage from '../views/TestPage'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/revenue'
  },
  {
    path:'/revenue',
    name:'revenue',
    component:RevenueScreen
  },
  {
    path:'/enrollment',
    name:'enrollment',
    component:EnrollmentScreen
  },
  {
    path:'/refund',
    name:'refund',
    component:RefundScreen
  }
]

const router = new VueRouter({
  routes
})

export default router
