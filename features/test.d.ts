declare namespace NodeJS {
  interface Global {
    capabilities: Capabilities;
  }
}

declare interface Capabilities {
  nojs: Boolean;
  [key: string]: any;
}

declare namespace WebdriverIO {
  interface Client<T> {
    actions: (action?: ActionContainer) => void;
  }

  interface ActionContainer {
    type: 'key' | 'pointer' | 'none';
    id: string;
    parameters?: {
      pointerType: 'mouse' | 'pen' | 'touch';
    };
    actions: Action[];
  }

  interface Action {
    type: string;
    duration: number;
    [key: string]: any;
  }
}
