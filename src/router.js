import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

let router = new Router({
  mode: "history",
  options: {
    hashbang: false
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: false
      },
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/resolved",
      name: "resolved",
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "resolvedCords" */ "./views/ResolvedCords.vue")
    },
    {
      path: "/cord/:id",
      name: "cordView",
      props: true,
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "selectedCord" */ "./views/SelectedCord.vue")
    },
    {
      path: "/login",
      name: "login",
      meta: {
        guest: true,
        requiresAuth: false,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "profile" */ "./views/Profile.vue")
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: true
      },
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/Admin.vue")
    },
    {
      path: "/metrics",
      name: "metrics",
      meta: {
        guest: false,
        requiresAuth: true,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "metrics" */ "./views/Metrics.vue")
    },
    {
      path: "/resetPassword",
      name: "resetPassword",
      meta: {
        guest: true,
        requiresAuth: false,
        isAdmin: false
      },
      component: () =>
        import(/* webpackChunkName: "resetPassword" */ "./views/ResetPassword.vue")
    },
    {
      path: "/404",
      name: "404",
      meta: {
        guest: true,
        requiresAuth: false,
        admin: false
      },
      component: () =>
        import(/* webpackChunkName: "notFound" */ "./views/NotFound.vue")
    },
    { path: "*", redirect: "/404" }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("user") == null
    ) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (user.isAdmin) {
          next();
        } else {
          next({
            path: "/login",
            params: { nextUrl: to.fullPath }
          });
        }
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
