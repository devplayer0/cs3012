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
      <svg width="100%" height="680"></svg>
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
      // Force linking everything together
      .force('link',d3.forceLink()
        .id(d => d.name)
        // Using a separate repulsion force
        .distance(0)
        .strength(1))
      .force('repulsion', d3.forceManyBody()
        .strength(-700))
      // Push everything towards the centre
      .force('cx', d3.forceX())
      .force('cy', d3.forceY())
      .on('tick', this.tick);

    this.reloadData(this.repo);
  },
  methods: {
    // Find the point of intersection between the edge of the target dependency's circle and the link
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
      const data = await githubNLDependencyGraph(GRAPHQL_TOKEN, repo, this.depth);
      if (!data) {
        this.$emit('load-end');
        this.error = true;
        this.updateData([], []);
        return;
      }
      this.$emit('load-end');

      this.updateData(data.nodes, data.links);
    },

    // Update values necessary for simulation ticks (aka just positional stuff)
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
    // Handle node drag events
    drag() {
      return d3.drag()
        .on('start', d => {
          if (d.name == this.repo) {
            return;
          }
          if (!d3.event.active) {
            // Give the simulation a kick when we've just started dragging
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

          // Temporarily assigning a fixed position will force the simulation to move everything else
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on('end', d => {
          if (d.name == this.repo) {
            return;
          }
          if (!d3.event.active) {
            // Let the simulation rest after drag is finished
            this.simulation
              .alphaTarget(0);
          }

          // Hand control of the node's position back to the simulation by unfixing it
          d.fx = null;
          d.fy = null;
        });
    },
    updateData(nodes, links) {
      // Logarithmically scale the radius of the nodes based on stars
      const maxStars = _.max(_.map(nodes, n => n.stars));
      this.radiusScale = d3.scaleLog()
        .domain([1, maxStars])
        .clamp(true)
        .range([5, 13]);

      // Logarithmically scale the repulsion of the nodes based on radius (so also stars)
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

      // We've just updated the data, give the simulation a kick
      this.simulation
        .alphaTarget(0.3)
        .restart();
      // Calm everything down after a short while
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

      // Only display the repo's name (not the owner) to reduce clutter
      const repoDisplay = d => d.name.split('/')[1];
      // Logarithmically scale the colour of each node based on forks with a GitHub-style pale yellow -> dark green
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
            // We can re-use SVG elements for perfomance when the data changes - only need to float the nodes to the top
            // and update values depending on the data
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
