import './style.css';

import {Press} from './press';
// PLOP: START COMPONENT IMPORT
import Autocomplete from './components/press-autocomplete';
import Datepicker from './components/press-datepicker';
import Daterangepicker from './components/press-daterangepicker';
import Noscript from './components/press-noscript';
import StaticValue from './components/press-static-value';
// PLOP: END COMPONENT IMPORT
import {logger} from './lib/logger';

export const press = new Press({logger});

performance.mark('press:register:components:start');
// PLOP: START COMPONENT REGISTRATION
press.registerComponent(new Autocomplete({logger}));
press.registerComponent(new Datepicker({logger}));
press.registerComponent(new Daterangepicker({logger}));
press.registerComponent(new Noscript({logger}));
press.registerComponent(new StaticValue({logger}));
// PLOP: END COMPONENT REGISTRATION

performance.mark('press:register:components:end');

if (process.env.BUILD_TARGET === 'cdn' || process.env.AUTORUN) {
  press.run();
}

if (process.env.BUILD_TARGET === 'cdn') {
  //@ts-ignore
  window.press = press;
}
