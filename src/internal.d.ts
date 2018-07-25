declare interface HTMLElement {
  getAttributeNames: () => string[];
}

declare interface HTMLElement {
  after<T extends Node>(...nodes: T[]): void;
}
