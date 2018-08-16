import {Press} from './press';
import Autocomplete from './components/autocomplete';
import Datepicker from './components/datepicker';
import Daterangepicker from './components/daterangepicker';
import {logger} from './lib/logger';

export const press = new Press({logger});

performance.mark('press:register:components:start');
press.registerComponent(new Autocomplete({logger}));
press.registerComponent(new Datepicker({logger}));
press.registerComponent(new Daterangepicker({logger}));
performance.mark('press:register:components:end');

if (process.env.BUILD_TARGET === 'cdn' || process.env.AUTORUN) {
  press.run();
}

if (process.env.BUILD_TARGET === 'cdn') {
  //@ts-ignore
  window.press = press;
}
