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
      <input class="form-control" type="text" :placeholder="placeholder"
             :value="value" @input="emitValue($event.target.value)" />
    </div>
  `,
  props: {
    prepend: String,
    placeholder: String,
    debounce: {
      type: Number,
      required: true
    },
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

function paramSync(path, name, uriEncode = false) {
  const e = function(v) {
    return uriEncode ? encodeURIComponent(v) : v;
  };
  const d = function(v) {
    return uriEncode ? decodeURIComponent(v || '') : v;
  };

  return {
    data() {
      return {
        [name]: ''
      };
    },
    created() {
      this[name] = d(this.$route.params[name]);
    },
    watch: {
      $route(to, from) {
        this[name] = d(to.params[name]);
      },
      [name](n, o) {
        if (d(this.$route.params[name]) == n) {
          return;
        }

        this.$router.push(`${path}/${e(n)}`);
      }
    }
  };
}

Vue.component('DependencyGraph', {
  props: ['repo'],
  template: `
    <svg width="100%" height="720"></svg>
  `,
  watch: {
    repo(n) {
      this.reloadData(n);
    }
  },
  mounted() {
    this.svg = d3
      .select(this.$el);

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

    if (this.repo) {
      this.reloadData();
    }
  },
  methods: {
    applyDependencyIndicator(d) {
      let vx = d.target.x - d.source.x;
      let vy = d.target.y - d.source.y;
      const mag = Math.sqrt(vx*vx + vy*vy);
      vx /= mag;
      vy /= mag;

      const dist = this.radiusScale(d.target.stars);
      d.px = d.source.x + vx * (mag - dist);
      d.py = d.source.y + vy * (mag - dist);
    },
    async reloadData() {
      //const data = await githubNLDependencyGraph('REDACTED', this.repo, 4);
      const data = JSON.parse('{"nodes":[{"stars":2,"name":"netsoc/webspace-ng","fx":0,"fy":0},{"stars":5,"name":"joubin/DNSPython"},{"stars":1063,"name":"PythonCharmers/python-future"},{"stars":25,"name":"ThomasWaldmann/argparse"},{"stars":1,"name":"simplegeo/importlib"},{"stars":3,"name":"calvinchengx/python-unittest2"},{"stars":4,"name":"palaviv/eventfd"},{"stars":166,"name":"xolox/python-humanfriendly"},{"stars":2,"name":"onlytiancai/flake8"},{"stars":35,"name":"PyCQA/flake8-docstrings"},{"stars":587,"name":"PyCQA/pydocstyle"},{"stars":371,"name":"snowballstem/snowball"},{"stars":810,"name":"PyCQA/pyflakes"},{"stars":0,"name":"scooterman/pymunch"},{"stars":1056,"name":"Lawouach/WebSocket-for-Python"},{"stars":1098,"name":"cherrypy/cherrypy"},{"stars":90,"name":"cherrypy/cheroot"},{"stars":1115,"name":"erikrose/more-itertools"},{"stars":1,"name":"jaraco/portend"},{"stars":8,"name":"zopefoundation/zc.lockfile"},{"stars":1,"name":"Distrotech/setuptools"},{"stars":4693,"name":"cython/cython"},{"stars":8959,"name":"jupyter/jupyter"},{"stars":281,"name":"ipython/ipykernel"},{"stars":1628,"name":"jupyter-widgets/ipywidgets"},{"stars":133,"name":"jupyter/jupyter_console"},{"stars":797,"name":"jupyter/nbconvert"},{"stars":6559,"name":"jupyter/notebook"},{"stars":197,"name":"jupyter/qtconsole"},{"stars":3174,"name":"rkern/line_profiler"},{"stars":13897,"name":"ipython/ipython"},{"stars":2337,"name":"zeromq/pyzmq"},{"stars":4940,"name":"gevent/gevent"},{"stars":5138,"name":"pytest-dev/pytest"},{"stars":18568,"name":"tornadoweb/tornado"},{"stars":1095,"name":"python-greenlet/greenlet"},{"stars":157,"name":"pypa/wheel"},{"stars":7,"name":"calvinchengx/python-mock"}],"links":[{"source":"netsoc/webspace-ng","target":"joubin/DNSPython"},{"source":"joubin/DNSPython","target":"PythonCharmers/python-future"},{"source":"PythonCharmers/python-future","target":"ThomasWaldmann/argparse"},{"source":"PythonCharmers/python-future","target":"simplegeo/importlib"},{"source":"PythonCharmers/python-future","target":"calvinchengx/python-unittest2"},{"source":"netsoc/webspace-ng","target":"palaviv/eventfd"},{"source":"netsoc/webspace-ng","target":"xolox/python-humanfriendly"},{"source":"xolox/python-humanfriendly","target":"onlytiancai/flake8"},{"source":"xolox/python-humanfriendly","target":"PyCQA/flake8-docstrings"},{"source":"PyCQA/flake8-docstrings","target":"onlytiancai/flake8"},{"source":"PyCQA/flake8-docstrings","target":"PyCQA/pydocstyle"},{"source":"PyCQA/pydocstyle","target":"snowballstem/snowball"},{"source":"xolox/python-humanfriendly","target":"PyCQA/pyflakes"},{"source":"netsoc/webspace-ng","target":"scooterman/pymunch"},{"source":"netsoc/webspace-ng","target":"Lawouach/WebSocket-for-Python"},{"source":"Lawouach/WebSocket-for-Python","target":"cherrypy/cherrypy"},{"source":"cherrypy/cherrypy","target":"cherrypy/cheroot"},{"source":"cherrypy/cherrypy","target":"erikrose/more-itertools"},{"source":"cherrypy/cherrypy","target":"jaraco/portend"},{"source":"cherrypy/cherrypy","target":"zopefoundation/zc.lockfile"},{"source":"zopefoundation/zc.lockfile","target":"Distrotech/setuptools"},{"source":"Lawouach/WebSocket-for-Python","target":"cython/cython"},{"source":"cython/cython","target":"jupyter/jupyter"},{"source":"jupyter/jupyter","target":"ipython/ipykernel"},{"source":"jupyter/jupyter","target":"jupyter-widgets/ipywidgets"},{"source":"jupyter/jupyter","target":"jupyter/jupyter_console"},{"source":"jupyter/jupyter","target":"jupyter/nbconvert"},{"source":"jupyter/jupyter","target":"jupyter/notebook"},{"source":"jupyter/jupyter","target":"jupyter/qtconsole"},{"source":"cython/cython","target":"rkern/line_profiler"},{"source":"rkern/line_profiler","target":"cython/cython"},{"source":"rkern/line_profiler","target":"ipython/ipython"},{"source":"cython/cython","target":"zeromq/pyzmq"},{"source":"zeromq/pyzmq","target":"gevent/gevent"},{"source":"zeromq/pyzmq","target":"pytest-dev/pytest"},{"source":"zeromq/pyzmq","target":"tornadoweb/tornado"},{"source":"zeromq/pyzmq","target":"calvinchengx/python-unittest2"},{"source":"Lawouach/WebSocket-for-Python","target":"gevent/gevent"},{"source":"Lawouach/WebSocket-for-Python","target":"python-greenlet/greenlet"},{"source":"python-greenlet/greenlet","target":"Distrotech/setuptools"},{"source":"python-greenlet/greenlet","target":"pypa/wheel"},{"source":"Lawouach/WebSocket-for-Python","target":"calvinchengx/python-mock"},{"source":"Lawouach/WebSocket-for-Python","target":"pytest-dev/pytest"},{"source":"Lawouach/WebSocket-for-Python","target":"tornadoweb/tornado"}]}');
      if (!data) {
        return;
      }
      await sleep(500);

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
      this.repulsionScale = d3.scaleLog()
        .domain([1, maxStars])
        .clamp(true)
        .range([-200, -1700]);

      this.simulation
        .nodes(nodes)
        .force('link')
          .links(links);
      this.simulation
        .force('repulsion')
          .strength(d => this.repulsionScale(d.name.length));
      this.simulation
        .alphaTarget(0.3)
        .restart();

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
                  .attr('fill', d => d.name == this.repo ? 'green' : 'black')
                  .call(this.drag()))
              .call(enter => enter
                .append('text')
                  .attr('x', d => d.x)
                  .attr('y', d => d.y)
                  .attr('text-anchor', 'middle')
                  .attr('pointer-events', 'none')
                  .style('user-select', 'none')
                  .style('font-size', '0.8rem')
                  .text(d => d.name.split('/')[1])));
    }
  }
});
