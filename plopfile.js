module.exports = function(plop) {
  // create your generators here
  plop.setGenerator('component', {
    description: 'Create a new PRESS component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What would you like to call your component'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{name}}/index.js',
        templateFile: 'plop-templates/components/js.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{name}}/{{name}}.vue',
        templateFile: 'plop-templates/components/vue.hbs'
      }
    ]
  });
};
