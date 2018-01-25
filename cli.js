function warn() {
  console.log('`react-web-cli` is deprecated, use `create-react-app` and `react-app-rewired` instead.');
}

module.exports = {
  run: warn,
  init: warn,
};
