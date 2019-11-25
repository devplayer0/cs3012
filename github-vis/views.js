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

      <debounced-input v-model="repo" :debounce="750" prepend="https://github.com/" placeholder="some-coder/some-repo">
      </debounced-input>
      <dependency-graph :repo="repo"></dependency-graph>
    </div>
  `
});
