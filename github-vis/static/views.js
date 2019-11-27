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
  mixins: [paramSync('access', 'username', { fallback: 'accessBlank' })],
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
  mixins: [
    paramSync('graph', 'repo', {
      uriEncode: true,
      fallbackRoute: 'graphBlank'
    }),
    paramSync('graph', 'depth', {
      query: true,
      uriEncode: true,
      fallbackRoute: 'graphBlank'
    })
  ],
  template: `
    <div>
      <h1>Dependency graph</h1>
      <p class="lead">Enter a repo's name to see its dependency graph.</p>

      <dependency-graph :repo="repo" :depth="nDepth" @load-start="loading = true"
                        @load-end="loading = false" @repo-change="repo = $event">
      </dependency-graph>
      <debounced-input v-model="repo" :disabled="loading" :debounce="750" prepend="https://github.com/"
                       placeholder="some-coder/some-repo">
        <div class="input-group-prepend">
          <span class="input-group-text">Max depth</span>
        </div>
        <input v-model="nDepth" :disabled="loading" class="form-control" id="depth-input" type="number" min="1" max="4">
        <div :style="{ visibility: loadingVisible }" class="spinner-border align-middle ml-2 mt-1" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </debounced-input>

      <p>General information:</p>
      <ul>
        <li>Leverages GitHub's GraphQL API to retrieve dependencies scraped by GitHub - this works for a number of
        different depency manifest formats, such as Python <code>requirements.txt</code> and Node.js
        <code>package.json</code></li>
        <li>Only dependencies whose sources are on GitHub will be shown</li>
        <li>The first 10 dependencies will be shown (can be fewer if some of the first 10 dependencies are not listed
        on GitHub)</li>
        <li>This API is rate-limited by GitHub - even though only a single GraphQL call is needed to produce up to 4
        levels of data, the rate-limit cost is based on the complexity of the query (see
        <a target="_blank" href="https://developer.github.com/v4/guides/resource-limitations/#rate-limit">here</a> for
        more details)</li>
      </ul>

      <p>About the visualisation:</p>
      <ul>
        <li>Your selected repo is fixed in the centre and is coloured blue</li>
        <li>The size of the nodes represents (logarithmically) the number of stars a repo has</li>
        <li>The colour of the nodes represents (again logarithmically) the number of forks a repo has, with dark green
        meaning the most forks</li>
        <li>Red circles show the target of a dependency link</li>
        <li>Click and drag on a node to move it around (useful when trying to get a better view at some more dense and
        complex graphs)</li>
        <li>Double-click on a node to switch the current repo (use your browser's navigation buttons to go back and
        forth)</li>
        <li>You can adjust the dependency recursion depth, but using higher depth values on projects with complex
        dependency graphs may cause errors, try lowering this value</li>
      </ul>

      <p>Some repos to try:</p>
      <ul>
        <li v-for="s in samples">
          <router-link :to="{ name: 'graph', params: { repo: s.name }, query: { depth: s.depth } }">
            {{ s.name }}, depth {{ s.depth }} ({{ s.language }})
          </router-link>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      loading: false,
      samples: [
        {
          name: 'netsoc/webspace-ng',
          depth: 4,
          language: 'Python'
        },
        {
          name: 'devplayer0/cs3012',
          depth: 4,
          language: 'Python'
        },
        {
          name: 'devplayer0/distry',
          depth: 4,
          language: 'Python'
        },
        {
          name: 'netsoc/website-ng',
          depth: 3,
          language: 'Python'
        },
        {
          name: 'OpenAPITools/openapi-generator',
          depth: 3,
          language: 'Java'
        },
        {
          name: 'microsoft/vscode',
          depth: 2,
          language: 'JavaScript / TypeScript'
        },
      ]
    };
  },
  computed: {
    loadingVisible() {
      return this.loading ? 'visible' : 'hidden';
    },
    nDepth: {
      get() {
        return parseFloat(this.depth) || 2;
      },
      set(v) {
        this.depth = v;
      }
    }
  }
});
