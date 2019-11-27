const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/access' },

    { name: 'accessBlank', path: '/access', component: Vue.component('AccessView') },
    { name: 'access', path: '/access/:username', component: Vue.component('AccessView') },

    { name: 'graphBlank', path: '/graph', component: Vue.component('GraphView') },
    { name: 'graph', path: '/graph/:repo', component: Vue.component('GraphView') },

    { path: '*', component: Vue.component('NotFound') }
  ]
});

const vm = new Vue({
  el: '#app',
  router
});
