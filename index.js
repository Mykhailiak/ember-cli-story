/* jshint node: true */
'use strict';

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
      components: path.join(root, '/app/pods/components/'),
    };
  },
  async changeHandler() {
    this.ui.writeLine('Updating stories...');

    try {
      await exec('node buildStories.js')

      this.ui.writeLine('Stories has been updated successfully!');
    } catch (e) {
      console.error('Error: ', e);
    }
  },
  errorHandler(e) {
    this.ui.writeLine('Error: ', e);
  },
  setupSubscribers() {
    const { CHANGE, ERROR } = this.states;

    this.watcher.on(CHANGE, (...args) => this.changeHandler(...args));
    this.watcher.on(ERROR, (e) => this.errorHandler(e));
  },
  setup() {
    this.watcher = watch(this.paths.components, {
      recursive: true,
      filter: /story\.js$/,
    });

    this.setupSubscribers();
  },
  included() {
    this._super.included(...arguments);

    this.setup();
  },
  setupPreprocessorRegistry(type, registry) {
    this.initializeSystemPaths(registry.app);
  },
};
