/* jshint node:true */
const fs = require('fs');
const path = require('path');

const isExist = p => fs.existsSync(p);

module.exports = {
  description: 'Create component story for combook',
  fileMapTokens() {
    return {
      __componentName__(options) {
        return options.dasherizedModuleName;
      },
      __name__() {
        return 'story';
      },
    };
  },
  beforeInstall(options) {
    const { entity: { name } } = options;
    const pilotPath = path.join(__dirname, `../../app/pods/components/${name}`);

    if (!isExist(pilotPath)) {
      throw new Error('Component doesn\'t exist yet.');
    }
  },
  locals(options) {
    return {
      componentName: options.entity.name,
    };
  },
};
