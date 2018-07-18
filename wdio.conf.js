const debug = require('debug')('press:test');
const path = require('path');
const mkdirp = require('mkdirp');
const stoppable = require('stoppable');
const {app} = require('./features/server');

const CI = !!process.env.CI;

const firefoxProfileWithJavaScriptDisabled =
  'UEsDBBQACAAIAIMA8kwAAAAAAAAAAAAAAAAHAAAAdXNlci5qc5VWPW/bMBDd+ysKTy1QE22CLO3UJh0KFMgQBB0JijpJjCiSII9W/O97lKxEsmTZ3mjhvfu+d44BPHceik8b4RyLLhcITES0my8fC6EDfP7xIS6CwIhMQ76My7xticVy2xptRc4aYURJH0Jl238VmCcUHpUp1+m/n//+ZHYH3qscCIo+HgU0OOqQt0xICQ67qE5jtTI1sw4Mh1cEb4Qm0zfTRAe771gDbasMJXQabIuC8CnQhdINFoMooHtT9uyiIgYQXlaH5iwbT4mYoKwJLNNW1loFvNR46HhoPTAPITbAC28bLr0I1bK3t1Qq0JrJCmT9AIWIGn/1fV+nocgCa4U3j+Ze23CmXiP0I/Vs3XRIYxUdczRshPy63NRJCxqhKRZYr9Zgt7INJNu8BS3pzaNPw7MRmY34PdPC1Jupzxx2aK0OjIbYekkdsnrsbD6muW1YrkLaLt5NaR49zQpPe7Sc/aj7aXUfevKTJHYgxrejMozg2pbldA7n8YzgB31Yndo53FhUxf6Z9GA5fAPYWl8fNGJ72KIt1Rxjin9hmQZKheiI97qlwhqQmDZg68BvyRnJxkLyE6arVKj22yRwToSw1WBKTEN/c3c3beMQFKlkYEJr2/Jsz/N+6okwL5ujJXIYGM0vb2wu9JkJA0ltxj0rlAZ6MesVtYY7q5Xck4fbaUDhGB/QK4n8mLZQvDdq2kEOhjQwzVf3+cQyrlI6UefWyOvILYia8ro8wES4zpcGsbsutSnjOm8hZo1CrszlldwpoKNS8ka9njql09JPCGfDU6WxhlS9gSYD/9T9PLFRSaRqheywH8O9PgjR4oQPFARNHtDv1yd8Du9XpEv86PzOsR5eaL9PXPYXsRNBeuWQ7nonAl1p/pj7Xm8Xwx+uWNLb/rKzPDZulMR8qVvIcq9IWXj/T4NHQ6BAcXEJHlNt10i9cHIjkGxw2NHunaOQLKWT/O5H0YdO2eaOUiYkhrwvBffRcFRN2srboxMwKthczP8DUEsHCE73SUHzAgAAFQoAAFBLAQItAxQACAAIAIMA8kxO90lB8wIAABUKAAAHAAAAAAAAAAAAIACkgQAAAAB1c2VyLmpzUEsFBgAAAAABAAEANQAAACgDAAAAAA==';

let server;

exports.config = {
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: ['./features/**/*.feature'],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [
    {
      // maxInstances can get overwritten per capability. So if you have an in-house Selenium
      // grid with only 5 firefox instances available you can make sure that not more than
      // 5 instances get started at a time.
      maxInstances: 5,
      //
      browserName: 'firefox'
    },
    {
      maxInstances: 5,
      browserName: 'firefox',
      nojs: true,
      'moz:firefoxOptions': {
        profile: firefoxProfileWithJavaScriptDisabled
      }
    }
  ],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Warns when a deprecated command is used
  deprecationWarnings: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: './reports/screenshots',
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: 'http://localhost:4000',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Initialize the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as properties. Make sure you have
  // the plugin installed before running any tests. The following plugins are currently
  // available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //     webdrivercss: {
  //         screenshotRoot: 'my-shots',
  //         failedComparisonsRoot: 'diffs',
  //         misMatchTolerance: 0.05,
  //         screenWidth: [320,480,640,1024]
  //     },
  //     webdriverrtc: {},
  //     browserevent: {}
  // },
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    CI && 'sauce',
    CI || 'selenium-standalone',
    'screenshots-cleanup'
  ].filter(Boolean),
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'cucumber',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/reporters/dot.html
  reporters: [CI && 'dot', !CI && 'spec', CI && 'junit'].filter(Boolean),
  //
  // If you are using Cucumber you need to specify the location of your step definitions.
  cucumberOpts: {
    require: ['./features/steps/*'], // <string[]> (file/dir) require files before executing features
    backtrace: false, // <boolean> show full backtrace for errors
    compiler: [], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
    dryRun: false, // <boolean> invoke formatters without executing steps
    failFast: false, // <boolean> abort the run on first failure
    format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    colors: true, // <boolean> disable colors in formatter output
    snippets: true, // <boolean> hide step definition snippets for pending steps
    source: true, // <boolean> hide source uris
    profile: [], // <string[]> (name) specify the profile to use
    strict: false, // <boolean> fail if there are any undefined or pending steps
    tags: [], // <string[]> (expression) only execute the features or scenarios with tags matching the expression
    timeout: 20000, // <number> timeout for step definitions
    ignoreUndefinedDefinitions: false // <boolean> Enable this config to treat undefined definitions as warnings.
  },

  cleanScreenshotsFolder: {
    folder: path.resolve(__dirname, 'reports', ' screenshots')
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @returns {Promise<void>}
   */
  onPrepare() {
    mkdirp.sync(path.resolve(__dirname, 'reports', 'screenshots'));

    return new Promise((resolve) => {
      const PORT = Number(process.env.PORT) || 4000;
      debug(`starting test server on port ${PORT}`);
      server = stoppable(
        app.listen(PORT, () => {
          debug(`started test server on port ${PORT}`);
          resolve();
        }),
        100
      );
    });
  },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  // beforeSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<string>} specs List of spec file paths that are to be run
   */
  before(capabilities) {
    // Ideally, these would be actual require statements in the files that use
    // them, but this is how
    // https://github.com/webdriverio/cucumber-boilerplate/ does it and fixing
    // it will be timeconsuming
    const chai = require('chai');

    global.expect = chai.expect;
    global.assert = chai.assert;
    global.capabilities = capabilities;
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },

  /**
   * Runs before a Cucumber feature
   * @param {Object} feature feature details
   */
  // beforeFeature: function (feature) {
  // },
  /**
   * Runs before a Cucumber scenario
   * @param {Object} scenario scenario details
   */
  // beforeScenario: function (scenario) {
  // },
  /**
   * Runs before a Cucumber step
   * @param {Object} step step details
   */
  // beforeStep: function (step) {
  // },
  /**
   * Runs after a Cucumber step
   * @param {Object} stepResult step result
   */
  // afterStep: function (stepResult) {
  // },
  /**
   * Runs after a Cucumber scenario
   * @param {Object} scenario scenario details
   */
  // afterScenario: function (scenario) {
  // },
  /**
   * Runs after a Cucumber feature
   * @param {Object} feature feature details
   */
  // afterFeature: function (feature) {
  // },

  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @returns {Promise<void>}
   */
  onComplete() {
    return new Promise((resolve) => {
      debug('stopping test server');
      const start = Date.now();
      server.stop(() => {
        debug(`stopped test server in ${(Date.now() - start) / 1000} seconds`);
        resolve();
      });
    });
  }
};
