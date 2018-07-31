declare namespace NodeJS {
  interface Global {
    capabilities: Capabilities;
  }
}

declare interface Capabilities {
  nojs: Boolean;
  [key: string]: any;
}
