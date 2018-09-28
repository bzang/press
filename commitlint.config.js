const path = require('path');

const glob = require('glob');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async (context = {}) => {
      const components = await listComponents(context);
      return [
        2,
        'always',
        components.concat([
          // build
          'babel',
          'npm',
          'webpack',

          // chores
          'deps',
          'deps-dev',

          // all
          'core',

          // ci
          'circle',
          'github',
          'now',
          'sauce'
        ])
      ];
    }
  }
};

/**
 * @param {Object} context
 * @returns {string[]}
 */
async function listComponents(context) {
  const cwd = context.cwd || process.cwd();
  const components = glob.sync('*/', {
    cwd: path.resolve(cwd, 'src', 'components')
  });
  // remove the `press-` prefix since we expect all components to have it and
  // we're limited to 72 character first-lines.
  return components.map((c) => c.replace(/^press-/, '').replace(/\/$/, ''));
}
