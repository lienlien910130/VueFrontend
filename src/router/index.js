import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../layout'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登入'},
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: '首頁', icon: 'dashboard', needLogin: true }
    }],
    hidden: true
  },
  {
    path: '/Graphic_equipmentType',
    name: 'Graphic_equipmentType',
    meta: { title: '圖例', needLogin: true},
    component: () => import('@/views/graphic/components/EquipmentType.vue'),
    hidden: true
  },
  {
    path: '/graphic',
    component: Layout,
    redirect: '/graphic/index',
    children: [
      {
        path: 'index',
        name: 'Graphic',
        component: () => import('@/views/graphic/index.vue'),
        meta: { title: '圖控系統', icon: 'icon', needLogin: true }
      }
    ]
  },
  {
    path: '/membersetting',
    component: Layout,
    redirect: '/membersetting/index',
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/membersetting/index.vue'),
        meta: { title: '設定', icon: 'icon', needLogin: true }
      }
    ],
    hidden: true
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/index',
    children: [
      {
        path: 'index',
        name: 'Equipment',
        component: () => import('@/views/equipment/index.vue'),
        meta: { title: '設備管理', icon: 'icon', needLogin: true }
      }
    ]
  },
  {
    path: '/normal',
    component: Layout,
    redirect: '/normal/basic',
    name: 'Normal',
    meta: { title: '平時管理', icon: 'icon', needLogin: true  },
    children: [
      {
        path: 'basic',
        name: 'Basic',
        component: () => import('@/views/normal/basicinfor/index.vue'),
        meta: { title: '基本資料', icon: 'one', needLogin: true }
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('@/views/normal/maintenance/index.vue'),
        meta: { title: '維護保養', icon: 'two', needLogin: true }
      },
      {
        path: 'maintenancereport',
        name: 'Maintenancereport',
        component: () => import('@/views/normal/maintenancereport/index.vue'),
        meta: { title: '檢修申報', icon: 'icon', needLogin: true }
      },
      {
        path: 'publicreport',
        name: 'Publicreport',
        component: () => import('@/views/normal/publicreport/index.vue'),
        meta: { title: '公安申報', icon: 'icon', needLogin: true }
      }
    ]
  },
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/fire',
    name: 'Analysis',
    meta: { title: '歷史分析', icon: 'icon', needLogin: true  },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/analysis/index.vue'),
        meta: { title: '總覽', icon: 'icon', needLogin: true }
      },
      {
        path: 'fire',
        name: 'Fire',
        component: () => import('@/views/analysis/fireana/index.vue'),
        meta: { title: '消防設備', icon: 'icon', needLogin: true }
      },
      {
        path: 'prevention',
        name: 'Prevention',
        component: () => import('@/views/analysis/preventionana/index.vue'),
        meta: { title: '防火設備', icon: 'icon', needLogin: true }
      },
      {
        path: 'safety',
        name: 'Safety',
        component: () => import('@/views/analysis/safety/index.vue'),
        meta: { title: '安全維護', icon: 'icon', needLogin: true }
      },
      {
        path: 'environmental',
        name: 'Environmental',
        component: () => import('@/views/analysis/envircontrol/index.vue'),
        meta: { title: '水電環控', icon: 'icon', needLogin: true }
      },
      {
        path: 'other',
        name: 'Other',
        component: () => import('@/views/analysis/otherana/index.vue'),
        meta: { title: '其他', icon: 'icon', needLogin: true }
      }
    ]
  },
  {
    path: '/emergency',
    component: Layout,
    redirect: '/emergency/aaa',
    name: 'Emergency',
    meta: { title: '緊急應變', icon: 'icon', needLogin: true  },
    children: [
      {
        path: 'aaa',
        name: 'Aaa',
        component: () => import('@/views/emergency/aaa/index.vue'),
        meta: { title: 'aaa', icon: 'icon', needLogin: true  }
      },
      {
        path: 'bbb',
        name: 'Bbb',
        component: () => import('@/views/emergency/bbb/index.vue'),
        meta: { title: 'bbb', icon: 'icon', needLogin: true  }
      }
    ]
  },
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/roles',
    name: 'Roles',
    meta: { title: '權限設定', icon: 'icon', needLogin: true  },
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/authority/menu/index.vue'),
        meta: { title: '選單管理', icon: 'icon', needLogin: true  }
      },
      {
        path: 'auth',
        name: 'Auth',
        component: () => import('@/views/authority/auth/index.vue'),
        meta: { title: '權限管理', icon: 'icon', needLogin: true  }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/authority/roles/index.vue'),
        meta: { title: '角色管理', icon: 'icon', needLogin: true  }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/authority/users/index.vue'),
        meta: { title: '帳號管理', icon: 'icon', needLogin: true  }
      }
    ]
  }
]

export const mercuryfireRoutes = [
  {
    path: '/building',
    component: Layout,
    redirect: '/building/index',
    children: [
      {
        path: 'index',
        name: 'Building',
        component: () => import('@/views/building/index.vue'),
        meta: { title: '建築物總覽', icon: 'icon', needLogin: true }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
