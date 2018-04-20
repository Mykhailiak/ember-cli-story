/* jshint node: true */
'use strict';

const watch = require('node-watch');
const path = require('path');
const { exec } = require('child_process');

const statuses = { CHANGE: 'change', ERROR: 'error' };
const pathToComponent = path.join(__dirname, '/app/pods/components/');
const watcher = watch(pathToComponent, { recursive: true, filter: /story\.js$/gi });

watcher.on(statuses.CHANGE, async () => {
  console.info('Updating stories...');

  try {
    await exec('node buildStories.js')

    console.info('Stories has been updated successfully!');
  } catch (e) {
    console.error('Error: ', e);
  }
});

watcher.on(statuses.ERROR, (e) => console.error('Error: ', e));

module.exports = {
  name: 'ember-cli-story'
};
