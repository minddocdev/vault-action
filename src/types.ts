export enum AuthMethods {
  github = 'github',
}

export enum SecretsEngines {
  KV = 'kv',
}

export namespace KV {
  export interface Config {
    path: string;
    version: 1 | 2;
  }

  export interface Request {
    path: string;
    key: string;
    env?: string;
    file?: string;
    unmask?: boolean;
  }
}

export namespace Input {
  export interface SecretsEngine {
    name: SecretsEngines;
    config: KV.Config;
  }
  export type Secrets = KV.Request[];
}
