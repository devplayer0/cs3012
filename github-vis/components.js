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
              <h4 class="card-title">{{ username }} <span class="badge badge-secondary">{{ info.public_repos }} repos</span></h4>
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

      const res = await fetch(`https://api.github.com/users/${this.username}`);
      if (!res.ok) {
        return 'error';
      }

      const info = await res.json();
      return info;
    }
  }
});
