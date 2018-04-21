/* jshint node: true */
'use strict';

const watch = require('node-watch');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
  name: 'ember-cli-story',
  app: {
    project: {
      root: __dirname,
    }
  },
  states: {
    CHANGE: 'change',
    ERROR: 'error',
  },
  paths: function() {
    console.log(this.app.project.root);

    return {
      components: path.join(this.app.project.root, '/app/pods/components/'),
    };
  },
  async changeHandler() {
    console.info('========================================= stories =================');
    console.info('Updating stories...');

    try {
      await exec('node buildStories.js')

      console.info('Stories has been updated successfully!');
    } catch (e) {
      console.error('Error: ', e);
    }

    console.info('========================================= stories =================');
  },
  errorHandler(e) {
    console.log('Error: ', e);
  },
  setupSubscribers() {
    const { CHANGE, ERROR } = this.states;

    this.watcher.on(CHANGE, (...args) => this.changeHandler(...args));
    this.watcher.on(ERROR, (e) => this.errorHandler(e));
  },
  setup() {
    this.watcher = watch(this.paths().components, {
      recursive: true,
      filter: /story\.js$/gi,
      delay: 5000,
    });

    console.log('setup');

    this.setupSubscribers();
  },
  included() {
    // this._super.included(...arguments);

    this.setup();
  },
};

module.exports.included();
