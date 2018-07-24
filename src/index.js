import {enhanceComponent, registerComponent} from './press';
import * as datepicker from './components/press/datepicker';
import {vueify} from './lib/vueify';
import {logger} from './lib/logger';

performance.mark('press:register:components:start');
registerComponent(datepicker);
performance.mark('press:register:components:end');

performance.mark('press:infer:components:start');
logger.info('Inferring component types');
datepicker.infer(document);
logger.info('Inferred component types');
performance.mark('press:infer:components:end');

performance.mark('press:enhance:components:start');
logger.info('Enhancing components');
Array.from(document.querySelectorAll('[data-press-component]')).forEach(
  enhanceComponent
);
logger.info('Enhanced components');
performance.mark('press:enhance:components:end');

logger.info('Vueifying non-apped PRESS component');
Array.from(document.querySelectorAll('[data-press-app]')).forEach((root) => {
  vueify(root);
});
logger.info('Vueified non-apped PRESS component');

if (process.env.NODE_ENV !== 'production' && logger.table) {
  logger.table(
    performance
      .getEntriesByType('mark')
      .map(({name, startTime}) => [name, startTime])
  );
}
