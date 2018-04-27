/* jshint node:true */

const helpers = {
  getType(type) {
    if (!type) {
      console.warn('Please, set type parameter. Example: ember g style <name> --type=components');

      throw new Error('type parameter should not be blank');
    }

    return type.split('=')[1];
  },
};

module.exports = {
  description: 'Create styles',
  type: process.argv.find(k => k.includes('--type=')),
  fileMapTokens() {
    return {
      __name__(options) {
        return options.dasherizedModuleName;
      },
      __type__() {
        return helpers.getType(this.type);
      },
    };
  },
};
