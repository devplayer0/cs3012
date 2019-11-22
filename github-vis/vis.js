Vue.component('UsernameEntry', {
  template: `
    <input type="text" :placeholder="placeholder" v-model="value" />
  `,
  props: {
    placeholder: String,
    debounce: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      value: ''
    };
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
      <h2>{{ username }}</h2>
      <div v-if="info && info != 'error'">
        <a :href="info.html_url">
          <img class="avatar" :alt="userAlt" :src="info.avatar_url">
        </a>
        <p>Name: {{ info.name }}</p>
        <p>Repos: {{ info.public_repos }}</p>
        <p v-if="info.location">Location: {{ info.location }}</p>
        <p>Followers: {{ info.followers }}, Following: {{ info.following }}</p>
        <a v-if="info.blog" :href="info.blog">{{ info.blog }}</a>
      </div>
      <p v-show="info == 'error'" class="error">Error: failed to retrieve info for '{{ username }}'</p>
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
      console.log(info);
      return info;
    }
  }
});

const vm = new Vue({
  el: '#app',
  data: {
    username: ''
  }
});
