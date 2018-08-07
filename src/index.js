import {Press} from './press';
import * as autocomplete from './components/press/autocomplete';
import * as datepicker from './components/press/datepicker';
import * as daterangepicker from './components/press/daterangepicker';
import {logger} from './lib/logger';

const press = new Press({logger});
performance.mark('press:register:components:start');
press.registerComponent(autocomplete);
press.registerComponent(datepicker);
press.registerComponent(daterangepicker);
performance.mark('press:register:components:end');

press.run();
