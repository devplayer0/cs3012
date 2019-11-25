const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/access' },

    { path: '/access', component: Vue.component('AccessView') },
    { path: '/access/:username', component: Vue.component('AccessView') },

    { path: '/graph', component: Vue.component('GraphView') },
    { path: '/graph/:repo', component: Vue.component('GraphView') },

    { path: '*', component: Vue.component('NotFound') }
  ]
});

const vm = new Vue({
  el: '#app',
  router
});
