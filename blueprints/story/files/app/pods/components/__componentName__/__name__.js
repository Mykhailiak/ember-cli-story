/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import hbs from 'htmlbars-inline-precompile';

const tplDesc = '{{<%= componentName %>}}';
const template = hbs`{{<%= componentName %>}}`;

export default {
  name: '<%= componentName %>',
  props: {},
  options: [
    {
      tplDesc,
      template,
      title: '',
      args: {},
    },
  ],
};
