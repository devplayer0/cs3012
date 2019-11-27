Vue.component('NotFound', {
  template: `
    <div>
      <h1>Not Found</h1>
      <p class="lead">Couldn't find a matching visualization, sorry.</p>
      <code>¯\\_(ツ)_/¯</code>
    </div>
  `
});

Vue.component('AccessView', {
  mixins: [paramSync('/access', 'username')],
  template: `
    <div>
      <h1>Basic API access</h1>
      <p class="lead">Enter your GitHub username to retrieve some information about your profile.</p>

      <debounced-input v-model="username" :debounce="750" prepend="https://github.com/" placeholder="some-coder">
      </debounced-input>
      <user-info v-show="username" :username="username"></user-info>
    </div>
  `
});

Vue.component('GraphView', {
  mixins: [paramSync('/graph', 'repo', true)],
  template: `
    <div>
      <h1>Dependency graph</h1>
      <p class="lead">Enter a repo's name to see its dependency graph.</p>

      <debounced-input v-model="repo" :disabled="loading" :debounce="750" prepend="https://github.com/" placeholder="some-coder/some-repo">
        <div :style="{ visibility: loadingVisible }" class="spinner-border align-middle ml-2 mt-1" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </debounced-input>
      <dependency-graph :repo="repo" @load-start="loading = true" @load-end="loading = false"></dependency-graph>
    </div>
  `,
  data() {
    return {
      loading: false
    };
  },
  computed: {
    loadingVisible() {
      return this.loading ? 'visible' : 'hidden';
    }
  }
});
