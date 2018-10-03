module.exports = function(plop) {
  // create your generators here
  plop.setGenerator('component', {
    actions: [
      {
        path: 'src/components/press-{{kebabCase name}}/index.js',
        templateFile: 'plop-templates/components/js.hbs',
        type: 'add'
      },
      {
        path:
          'src/components/press-{{kebabCase name}}/press-{{kebabCase name}}.vue',
        templateFile: 'plop-templates/components/vue.hbs',
        type: 'add'
      },
      {
        path: 'features/server/views/pages/{{snakeCase name}}.ejs',
        templateFile: 'plop-templates/components/page.hbs',
        type: 'add'
      },
      {
        path: 'features/{{snakeCase name}}.feature',
        templateFile: 'plop-templates/components/feature.hbs',
        type: 'add'
      },
      {
        path: 'src/index.js',
        pattern: /(\/\/ PLOP: END COMPONENT REGISTRATION)/gi,
        template:
          'press.registerComponent(new {{pascalCase name}}({logger}));\n$1',
        type: 'modify'
      },
      {
        path: 'src/index.js',
        pattern: /(\/\/ PLOP: END COMPONENT IMPORT)/gi,
        template:
          "import {{pascalCase name}} from './components/press-{{kebabCase name}}';\n$1",
        type: 'modify'
      }
    ],
    description: 'Create a new PRESS component',
    prompts: [
      {
        message: 'What would you like to call your component',
        name: 'name',
        type: 'input'
      }
    ]
  });
};
