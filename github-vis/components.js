// why doesn't this just exist...
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Vue.component('DebouncedInput', {
  template: `
    <div class="input-group mb-3">
      <div v-if="prepend" class="input-group-prepend">
        <span class="input-group-text">{{ prepend }}</span>
      </div>
      <input class="form-control" type="text" :placeholder="placeholder" :disabled="disabled"
             :value="value" @input="emitValue($event.target.value)" />
      <slot></slot>
    </div>
  `,
  props: {
    prepend: String,
    placeholder: String,
    debounce: {
      type: Number,
      required: true
    },
    disabled: Boolean,
    value: String
  },
  created() {
    this.emitValue = _.debounce(this._emitValue, this.debounce);
  },
  methods: {
    _emitValue(value) {
      this.$emit('input', value);
    }
  },
  watch: {
    value(n, o) {
      this.emitValue(n);
    }
  }
});

Vue.component('UserInfo', {
  props: ['username'],
  template: `
    <div>
      <div v-show="info == 'error'" class="alert alert-danger" role="alert">
        Failed to retrieve info for '{{ username }}'
      </div>
      <div v-if="info && info != 'error'" class="user-card card">
        <div class="row no-gutters">
          <div class="col-md-5">
            <a :href="info.html_url">
              <img class="card-img" :alt="userAlt" :src="info.avatar_url">
            </a>
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h4 class="card-title">
                {{ username }}
                <span class="badge badge-secondary">{{ info.public_repos }} repos</span>
              </h4>
              <h6 class="card-subtitle mb-2 text-muted">{{ info.name }}</h6>
                <p class="card-text">
                  <template v-if="info.location">Location: {{ info.location }} <br /></template>
                  Followers: {{ info.followers }}, Following: {{ info.following }}
                </p>
                <a class="card-link" v-if="info.blog" :href="info.blog">{{ info.blog }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  computed: {
    userAlt() {
      return `${this.username}'s avatar`;
    }
  },
  asyncComputed: {
    async info() {
      if (!this.username) {
        return;
      }

      const user = await githubUserInfo(this.username);
      if (!user) {
        return 'error';
      }

      return user;
    }
  }
});

function paramSync(route, name, options = {}) {
  const o = _.defaults(options, {
    query: false,
    uriEncode: false
  });

  const e = function(v) {
    return o.uriEncode ? encodeURIComponent(v) : v;
  };
  const d = function(v) {
    return o.uriEncode ? decodeURIComponent(v || '') : v;
  };
  const k = o.query ? 'query' : 'params';
  const kN = o.query ? 'params' : 'query';

  return {
    data() {
      return {
        [name]: ''
      };
    },
    created() {
      this[name] = d(this.$route[k][name]);
    },
    watch: {
      $route(to, from) {
        this[name] = d(to[k][name]);
      },
      [name](new_, old) {
        if (d(this.$route[k][name]) == new_) {
          return;
        }

        this.$router.push({
          name: new_ ? route : o.fallbackRoute,
          [kN]: this.$route[kN],
          [k]: {
            [name]: e(new_)
          }
        });
      }
    }
  };
}

Vue.component('DependencyGraph', {
  props: {
    repo: {
      type: String,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  template: `
    <div>
      <div v-show="error" class="alert alert-danger" role="alert">
        Failed to retrieve dependency graph for '{{ repo }}'
      </div>
      <svg width="100%" height="720"></svg>
    </div>
  `,
  data() {
    return {
      error: false
    };
  },
  watch: {
    repo(n) {
      this.reloadData(n);
    },
    depth(n) {
      this.reloadData(this.repo);
    }
  },
  mounted() {
    this.svg = d3
      .select(this.$el)
      .select('svg');

    const w = 600;
    const h = 600;
    this.svg
      .attr('viewBox', [-w/2, -h/2, w, h]);

    this.simulation = d3.forceSimulation()
      .force('link',d3.forceLink()
        .id(d => d.name)
        .distance(0)
        .strength(1))
      .force('repulsion', d3.forceManyBody()
        .strength(-700))
      .force('cx', d3.forceX())
      .force('cy', d3.forceY())
      .on('tick', this.tick);

    this.reloadData(this.repo);
  },
  methods: {
    applyDependencyIndicator(d) {
      let vx = d.target.x - d.source.x;
      let vy = d.target.y - d.source.y;
      const mag = Math.sqrt(vx*vx + vy*vy) || 1;
      vx /= mag;
      vy /= mag;

      const dist = this.radiusScale(d.target.stars);
      d.px = d.source.x + vx * (mag - dist);
      d.py = d.source.y + vy * (mag - dist);
    },
    async reloadData(repo) {
      this.error = false;
      if (!this.repo) {
        return;
      }

      this.$emit('load-start');
      const data = await githubNLDependencyGraph('REDACTED', repo, this.depth);
      //const data = JSON.parse('{"nodes":[{"stars":0,"forks":0,"fx":0,"fy":0,"name":"devplayer0/cs3012"},{"stars":962,"forks":102,"name":"nedbat/coveragepy"},{"stars":5142,"forks":1225,"name":"pytest-dev/pytest"},{"stars":180,"forks":20,"name":"untitaker/python-atomicwrites"},{"stars":2866,"forks":203,"name":"python-attrs/attrs"},{"stars":1811,"forks":139,"name":"tartley/colorama"},{"stars":7,"forks":0,"name":"calvinchengx/python-mock"},{"stars":1117,"forks":111,"name":"erikrose/more-itertools"},{"stars":137,"forks":93,"name":"pypa/packaging"},{"stars":496,"forks":104,"name":"pyparsing/pyparsing"},{"stars":586,"forks":137,"name":"benjaminp/six"},{"stars":55,"forks":12,"name":"mcmtroffaes/pathlib2"},{"stars":445,"forks":57,"name":"benhoyt/scandir"},{"stars":363,"forks":57,"name":"pytest-dev/pluggy"},{"stars":29,"forks":43,"name":"pytest-dev/py"},{"stars":146,"forks":24,"name":"jquast/wcwidth"},{"stars":901,"forks":227,"name":"yaml/pyyaml"},{"stars":250,"forks":130,"name":"PyCQA/astroid"},{"stars":281,"forks":24,"name":"jquast/blessed"},{"stars":6873,"forks":522,"name":"docopt/docopt"},{"stars":69,"forks":12,"name":"landscapeio/dodgy"},{"stars":5,"forks":0,"name":"certik/enum34"},{"stars":251,"forks":23,"name":"timothycrosley/deprecated.frosted"},{"stars":77,"forks":39,"name":"phihag/ipaddress"},{"stars":658,"forks":119,"name":"pytest-dev/pytest-cov"},{"stars":257,"forks":121,"name":"pytest-dev/pytest-html"},{"stars":13642,"forks":728,"name":"psf/black"},{"stars":8789,"forks":1311,"name":"aio-libs/aiohttp"},{"stars":137,"forks":25,"name":"aio-libs/aiohttp-cors"},{"stars":487,"forks":57,"name":"ActiveState/appdirs"},{"stars":8473,"forks":835,"name":"pallets/click"},{"stars":379,"forks":37,"name":"ericvsmith/dataclasses"},{"stars":2,"forks":11,"name":"onlytiancai/flake8"},{"stars":339,"forks":19,"name":"PyCQA/flake8-bugbear"},{"stars":88,"forks":13,"name":"ambv/flake8-mypy"},{"stars":0,"forks":1,"name":"chriskuehl/pre-commit"},{"stars":2451,"forks":526,"name":"PyCQA/pylint"},{"stars":1,"forks":0,"name":"Distrotech/setuptools"},{"stars":2,"forks":0,"name":"msabramo/tox"},{"stars":2,"forks":0,"name":"cheshire/virtualenv"}],"links":[{"source":"devplayer0/cs3012","target":"nedbat/coveragepy"},{"source":"devplayer0/cs3012","target":"pytest-dev/pytest"},{"source":"pytest-dev/pytest","target":"untitaker/python-atomicwrites"},{"source":"pytest-dev/pytest","target":"python-attrs/attrs"},{"source":"pytest-dev/pytest","target":"tartley/colorama"},{"source":"tartley/colorama","target":"calvinchengx/python-mock"},{"source":"pytest-dev/pytest","target":"erikrose/more-itertools"},{"source":"pytest-dev/pytest","target":"pypa/packaging"},{"source":"pypa/packaging","target":"pyparsing/pyparsing"},{"source":"pypa/packaging","target":"benjaminp/six"},{"source":"pytest-dev/pytest","target":"mcmtroffaes/pathlib2"},{"source":"mcmtroffaes/pathlib2","target":"calvinchengx/python-mock"},{"source":"mcmtroffaes/pathlib2","target":"benhoyt/scandir"},{"source":"mcmtroffaes/pathlib2","target":"benjaminp/six"},{"source":"pytest-dev/pytest","target":"pytest-dev/pluggy"},{"source":"pytest-dev/pytest","target":"pytest-dev/py"},{"source":"pytest-dev/pytest","target":"jquast/wcwidth"},{"source":"jquast/wcwidth","target":"yaml/pyyaml"},{"source":"jquast/wcwidth","target":"PyCQA/astroid"},{"source":"jquast/wcwidth","target":"jquast/blessed"},{"source":"jquast/wcwidth","target":"docopt/docopt"},{"source":"jquast/wcwidth","target":"landscapeio/dodgy"},{"source":"jquast/wcwidth","target":"certik/enum34"},{"source":"jquast/wcwidth","target":"timothycrosley/deprecated.frosted"},{"source":"jquast/wcwidth","target":"phihag/ipaddress"},{"source":"devplayer0/cs3012","target":"pytest-dev/pytest-cov"},{"source":"pytest-dev/pytest-cov","target":"nedbat/coveragepy"},{"source":"pytest-dev/pytest-cov","target":"pytest-dev/pytest"},{"source":"devplayer0/cs3012","target":"pytest-dev/pytest-html"},{"source":"pytest-dev/pytest-html","target":"psf/black"},{"source":"psf/black","target":"aio-libs/aiohttp"},{"source":"psf/black","target":"aio-libs/aiohttp-cors"},{"source":"psf/black","target":"ActiveState/appdirs"},{"source":"psf/black","target":"pallets/click"},{"source":"psf/black","target":"nedbat/coveragepy"},{"source":"psf/black","target":"ericvsmith/dataclasses"},{"source":"psf/black","target":"onlytiancai/flake8"},{"source":"psf/black","target":"PyCQA/flake8-bugbear"},{"source":"psf/black","target":"ambv/flake8-mypy"},{"source":"pytest-dev/pytest-html","target":"onlytiancai/flake8"},{"source":"pytest-dev/pytest-html","target":"chriskuehl/pre-commit"},{"source":"chriskuehl/pre-commit","target":"PyCQA/astroid"},{"source":"chriskuehl/pre-commit","target":"nedbat/coveragepy"},{"source":"chriskuehl/pre-commit","target":"onlytiancai/flake8"},{"source":"chriskuehl/pre-commit","target":"calvinchengx/python-mock"},{"source":"chriskuehl/pre-commit","target":"PyCQA/pylint"},{"source":"chriskuehl/pre-commit","target":"pytest-dev/pytest"},{"source":"chriskuehl/pre-commit","target":"Distrotech/setuptools"},{"source":"pytest-dev/pytest-html","target":"pytest-dev/pytest"},{"source":"pytest-dev/pytest-html","target":"msabramo/tox"},{"source":"msabramo/tox","target":"pytest-dev/py"},{"source":"msabramo/tox","target":"msabramo/tox"},{"source":"msabramo/tox","target":"cheshire/virtualenv"}]}');
      if (!data) {
        this.$emit('load-end');
        this.error = true;
        this.updateData([], []);
        return;
      }
      //await sleep(500);
      this.$emit('load-end');

      this.updateData(data.nodes, data.links);
    },

    tick() {
      this.svg
        .selectAll('.node')
          .call(node => node
            .select('circle')
              .attr('cx', d => d.x)
              .attr('cy', d => d.y))
          .call(node => node
            .select('text')
              .attr('x', d => d.x)
              .attr('y', d => d.y - this.radiusScale(d.stars) - 4));

      this.svg
        .selectAll('.link')
          .call(link => link
            .select('line')
              .attr('x1', d => d.source.x)
              .attr('y1', d => d.source.y)
              .attr('x2', d => d.target.x)
              .attr('y2', d => d.target.y))
          .call(link => link
            .select('circle')
              .each(this.applyDependencyIndicator)
              .attr('cx', d => d.px)
              .attr('cy', d => d.py));
    },
    drag() {
      return d3.drag()
        .on('start', d => {
          if (d.name == this.repo) {
            return;
          }
          if (!d3.event.active) {
            this.simulation
              .alphaTarget(0.3)
              .restart();
          }

          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', d => {
          if (d.name == this.repo) {
            return;
          }

          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', d => {
          if (d.name == this.repo) {
            return;
          }
          if (!d3.event.active) {
            this.simulation
              .alphaTarget(0);
          }

          d.fx = null;
          d.fy = null;
        });
    },
    updateData(nodes, links) {
      const maxStars = _.max(_.map(nodes, n => n.stars));
      this.radiusScale = d3.scaleLog()
        .domain([1, maxStars])
        .clamp(true)
        .range([5, 13]);

      const repulsionScale = d3.scaleLog()
        .domain([1, maxStars])
        .clamp(true)
        .range([-400, -2300]);
      this.simulation
        .nodes(nodes)
        .force('link')
          .links(links);
      this.simulation
        .force('repulsion')
          .strength(d => repulsionScale(d.name.length));
      this.simulation
        .alphaTarget(0.3)
        .restart();
      setTimeout(() => this.simulation.alphaTarget(0), 500);

      this.svg
        .selectAll('.link')
          .data(links)
          .join(enter => enter
            .append('g')
              .attr('class', 'link')
            .call(enter => enter
              .append('line')
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.7))
            .call(enter => enter
              .append('circle')
                .each(this.applyDependencyIndicator)
                .attr('cx', d => d.px)
                .attr('cy', d => d.py)
                .attr('r', 2.5)
                .attr('fill', 'red')));

      const repoDisplay = d => d.name.split('/')[1];
      const forkScale = d3.scaleLog()
        .domain([1, _.max(_.map(nodes, n => n.forks))])
        .clamp(true)
        .range([0, 1]);
      const forkColor = d => d.name == this.repo ? 'blue' : d3.interpolateYlGn(forkScale(d.forks));
      this.svg
        .selectAll('.node')
          .data(nodes)
          .join(enter => enter
            .append('g')
              .attr('class', 'node')
            .call(enter => enter
              .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => this.radiusScale(d.stars))
                .attr('fill', forkColor)
                .call(this.drag())
                .on('dblclick', d => this.$emit('repo-change', d.name)))
            .call(enter => enter
              .append('text')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('text-anchor', 'middle')
                .attr('pointer-events', 'none')
                .style('user-select', 'none')
                .style('font-size', '0.8rem')
                .text(repoDisplay)),
            update => update
              .raise()
              .call(update => update
                .select('circle')
                  .attr('r', d => this.radiusScale(d.stars))
                  .attr('fill', forkColor))
              .call(update => update
                .select('text')
                  .text(repoDisplay)));
    }
  }
});
