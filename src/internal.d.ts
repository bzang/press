declare interface HTMLElement {
  after<T extends Node>(...nodes: T[]): void;
}

declare interface Logger
  extends Pick<Console, 'error' | 'warn' | 'info' | 'debug'> {
  table?: Console['table'];
}

interface IPressComponent {
  name: string;
  infer?: PressComponentInferrer;
  enhance?: PressComponentEnhancer;
}

/**
 * An Enhancer receives a node identified by `data-press-component` and
 * adds additional attributes, children, or siblings to it. Typically, this
 * means adding Vue directives.
 */
type PressComponentEnhancer = (el: HTMLElement) => void;

/**
 * An Inferer receives a node (typically `document`) and searches its children
 * for nodes of particular criteria, then adds the appropriate `data-press`
 * attributes to those nodes.
 */
type PressComponentInferrer = (el: Document | HTMLElement) => void;

interface StringMap {
  [key: string]: string;
}
