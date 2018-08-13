import {Press} from './press';
import * as autocomplete from './components/autocomplete';
import * as datepicker from './components/datepicker';
import * as daterangepicker from './components/daterangepicker';
import {logger} from './lib/logger';

const press = new Press({logger});
performance.mark('press:register:components:start');
press.registerComponent(autocomplete);
press.registerComponent(datepicker);
press.registerComponent(daterangepicker);
performance.mark('press:register:components:end');

press.run();
