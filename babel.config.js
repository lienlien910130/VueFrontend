module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset','@babel/preset-env'
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
