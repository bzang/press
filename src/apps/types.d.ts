import {generateModel} from './form';

declare interface PressApp<State extends Object, Option extends Object> {
  annotate: (root: HTMLElement, options?: Options) => void;
  generateModel: (root: HTMLElement, data: State, options?: Options) => void;
  extend: (options?: Options) => Object;
}

declare namespace Press {
  regiest();
}

data - api;

data - press - app;

data - press - component;
