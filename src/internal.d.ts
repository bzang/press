declare interface HTMLElement {
  getAttributeNames: () => string[];
}

declare interface HTMLElement {
  after<T extends Node>(...nodes: T[]): void;
}

declare namespace Press {
  interface PressComponent {
    name: string;
    infer?: Inferer;
    enhance: Enhancer;
  }

  /**
   * An Enhancer receives a node identified by `data-press-component` and
   * adds additional attributes, children, or siblings to it. Typically, this
   * means adding Vue directives.
   */
  type Enhancer = (el: Element | HTMLElement) => void;

  /**
   * An Inferer receives a node (typically `document`) and searches its children
   * for nodes of particular criteria, then adds the appropriate `data-press`
   * attributes to those nodes.
   */
  type Inferer = (el: Document | Element | HTMLElement) => void;
}
