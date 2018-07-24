import {enhanceComponent, registerComponent} from './press';
import * as datepicker from './components/press/datepicker';
import {vueify} from './lib/vueify';

performance.mark('press:register:components:start');
registerComponent(datepicker);
performance.mark('press:register:components:end');

performance.mark('press:infer:components:start');
console.info('Inferring component types');
datepicker.infer(document);
console.info('Inferred component types');
performance.mark('press:infer:components:end');

performance.mark('press:enhance:components:start');
console.info('Enhancing components');
Array.from(document.querySelectorAll('[data-press-component]')).forEach(
  enhanceComponent
);
console.info('Enhanced components');
performance.mark('press:enhance:components:end');

console.info('Vueifying non-apped PRESS component');
Array.from(document.querySelectorAll('[data-press-app]')).forEach((root) => {
  vueify(root);
});
console.info('Vueified non-apped PRESS component');

if (process.env.NODE_ENV !== 'production' && console && console.table) {
  console.table(
    performance
      .getEntriesByType('mark')
      .map(({name, startTime}) => [name, startTime])
  );
}
