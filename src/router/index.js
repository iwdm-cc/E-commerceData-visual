import Vue from 'vue'
import VueRouter from 'vue-router'
import EnrollmentScreen from '../views/EnrollmentScreen'
import RefundScreen from '../views/RefundScreen'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/refund'
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
