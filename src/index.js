import {Press} from './press';
import * as datepicker from './components/press/datepicker';
import {logger} from './lib/logger';

const press = new Press({logger});
performance.mark('press:register:components:start');
press.registerComponent(datepicker);
performance.mark('press:register:components:end');

press.run();
