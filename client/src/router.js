import Vue from "vue";
import VueRouter from "vue-router";
import Auth from "./services/auth";

Vue.use(VueRouter)

let routes = [
  {
    // will match everything
    path: "*",
    component: () => import("./views/404.vue"),
  },
  {
    path: "/",
    name: "Home",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    layout: "dashboard",
    meta: { authRequired: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "./views/Dashboard.vue"),
  },
  {
    path: "/Profile",
    name: "Profile",
    layout: "dashboard",
    meta: {
      // layoutClass: "layout-profile",
      authRequired: true,
    },
    component: () => import("./views/Profile.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      redirectAuth: true,
    },
    component: () => import("./views/Login.vue"),
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    meta: {},
    component: () => import("./views/ResetPassword.vue"),
  },
];

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute(route, parentLayout = "default") {
  route.meta = route.meta || {};
  route.meta.layout = route.layout || parentLayout;

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta.layout)
    );
  }
  return route;
}

routes = routes.map((route) => addLayoutToRoute(route));

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: "smooth",
      };
    }
    return {
      x: 0,
      y: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach(async (to, from, next) => {
  let authRequired = to.matched.some((record) => record.meta.authRequired);
  let redirectAuth = to.matched.some((record) => record.meta.redirectAuth);

  let jwt = Auth.token;

  if (redirectAuth) {
    if (jwt) {
      return next("/dashboard");
    } else return next();
  }

  if (authRequired) {
    if (jwt) {
      return next();
    } else {
      return next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  }

  return next();
});

export default router;
