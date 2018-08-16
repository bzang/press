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
        path: 'src/components/{{kebabCase name}}/index.js',
        templateFile: 'plop-templates/components/js.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.vue',
        templateFile: 'plop-templates/components/vue.hbs'
      },
      {
        type: 'modify',
        path: 'src/index.js',
        pattern: /(\/\/ PLOP: END COMPONENT REGISTRATION)/gi,
        template:
          'press.registerComponent(new {{pascalCase name}}({logger}));\n$1'
      },
      {
        type: 'modify',
        path: 'src/index.js',
        pattern: /(\/\/ PLOP: END COMPONENT IMPORT)/gi,
        template:
          "import {{pascalCase name}} from './components/{{kebabCase name}};\n$1"
      }
    ]
  });
};
