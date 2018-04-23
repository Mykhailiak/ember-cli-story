const watch = require('node-watch');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: 'ember-cli-story',
  states: {
    CHANGE: 'change',
    ERROR: 'error',
  },
  initializeSystemPaths(appInstance) {
    const { root } = appInstance.project;

    this.paths = {
      root,
      components: path.join(root, '/app/pods/components/'),
    };
  },
  async changeHandler() {
    this.ui.writeLine('Updating stories...');

    try {
      exec(`node ${path.join(__dirname, 'buildStories.js')}`, {
        env: { PROJECT_ROOT: this.paths.root },
      });

      this.ui.writeLine('Stories has been updated successfully!');
    } catch (e) {
      this.ui.writeLine('Error: ', e);
    }
  },
  errorHandler(e) {
    this.ui.writeLine('Error: ', e);
  },
  setupSubscribers() {
    const { CHANGE, ERROR } = this.states;

    this.watcher.on(CHANGE, (...args) => this.changeHandler(...args));
    this.watcher.on(ERROR, e => this.errorHandler(e));
  },
  setup() {
    this.watcher = watch(this.paths.components, {
      recursive: true,
      filter: /story\.js$/,
    });

    this.setupSubscribers();
  },
  included(...params) {
    this._super.included(...params);

    this.setup();
  },
  setupPreprocessorRegistry(type, registry) {
    this.initializeSystemPaths(registry.app);
  },
};
