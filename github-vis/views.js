Vue.component('NotFound', {
  template: `
    <div>
      <h1>Not Found</h1>
      <p class="lead">Couldn't find a matching visualization, sorry.</p>
      <code>¯\\_(ツ)_/¯</code>
    </div>
  `
});

Vue.component('Access', {
  template: `
    <div>
      <h1>Basic API access</h1>
      <p class="lead">Enter your GitHub username to retrieve some information about your profile.</p>

      <debounced-input v-model="username" :debounce="750" prepend="https://github.com/" placeholder="some-coder">
      </debounced-input>
      <user-info v-show="username" v-bind:username="username"></user-info>
    </div>
  `,
  data() {
    return {
      username: ''
    };
  },
  created() {
    this.username = this.$route.params.username;
  },
  watch: {
    $route(to, from) {
      this.username = to.params.username;
    },
    username(n, o) {
      if (this.$route.params.username == n) {
        return;
      }

      this.$router.push(`/access/${n}`);
    }
  }
});

Vue.component('DependencyGraph', {
  template: `
    <div>
      <h1>Dependency graph</h1>
      <p class="lead">Enter a repo's name to see its dependency graph.</p>

      <debounced-input v-model="repo" :debounce="750" prepend="https://github.com/" placeholder="some-coder/some-repo">
      </debounced-input>
    </div>
  `,
  data() {
    return {
      repo: ''
    };
  }
});