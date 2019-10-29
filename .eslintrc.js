module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',

    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    __static: true
  },
  extends: [
    "plugin:vue/recommended",
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard'
  ],
  plugins: [
    'html', 'vue'
  ],
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
