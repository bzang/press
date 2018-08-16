import {Press} from './press';
import * as autocomplete from './components/autocomplete';
import * as datepicker from './components/datepicker';
import * as daterangepicker from './components/daterangepicker';
import {logger} from './lib/logger';

export const press = new Press({logger});

performance.mark('press:register:components:start');
press.registerComponent(autocomplete);
press.registerComponent(datepicker);
press.registerComponent(daterangepicker);
performance.mark('press:register:components:end');

if (process.env.BUILD_TARGET === 'cdn' || process.env.AUTORUN) {
  press.run();
}

if (process.env.BUILD_TARGET === 'cdn') {
  //@ts-ignore
  window.press = press;
}
