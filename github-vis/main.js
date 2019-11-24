const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/access' },

    { path: '/access', component: Vue.component('Access') },
    { path: '/access/:username', component: Vue.component('Access') },

    { path: '/graph', component: Vue.component('DependencyGraph') },
    { path: '/graph/:username/:repo', component: Vue.component('DependencyGraph') },

    { path: '*', component: Vue.component('NotFound') }
  ]
});

const vm = new Vue({
  el: '#app',
  router
});
