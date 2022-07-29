import Vue from 'vue'
import VueRouter from 'vue-router'
import ScreenPage from '../views/ScreenPage'
import SellerPage from '../views/SellerPage.vue'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
import RankPage from '../views/RankPage.vue'
import HotPage from '../views/HotPage'
import ScalePage from '../views/ScalePage'
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
  {
    path: '/sellerPage',
    name: 'SellerPage',
    component: SellerPage
  },
  {
    path: '/trendPage',
    name: 'TrendPage',
    component: TrendPage
  },
  {
    path: '/mapPage',
    name: 'MapPage',
    component: MapPage
  },
  {
    path: '/rankPage',
    name: 'RankPage',
    component: RankPage
  },
  {
    path: '/hotPage',
    name: 'HotPage',
    component: HotPage
  },
  {
    path:'/scalePage',
    name:'ScalePage',
    component:ScalePage
  }

]

const router = new VueRouter({
  routes
})

export default router
