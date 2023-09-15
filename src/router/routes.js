const routes = [
  {
    path: '/',
    component: () => import('src/layouts/RootLyo.vue'),
    children: [
      {
        path: '',
        name: 'SelectCountry',
        component: () => import('src/pages/SelectCountry.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('src/pages/SettingsPage.vue')
      }
    ]
  },
  {
    path: '/:country',
    component: () => import('layouts/MainLyo.vue'),
    children: [
      {
        path: ':filter',
        name: 'Home',
        component: () => import('src/pages/HomePage.vue')
      },
      {
        path: ':slug',
        name: 'Post',
        component: () => import('src/pages/PostPage.vue')
      }
      // {
      //   path: 'post',
      //   name: 'Post',
      //   component: () => import('src/pages/Post.vue')
      // }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/pgError404.vue')
  }
]

export default routes
