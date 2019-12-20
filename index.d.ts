declare namespace VaultAction {
  enum AuthMethods {
    github = 'github',
  }

  enum SecretsEngines {
    KV = 'kv',
  }

  namespace KV {
    interface Config {
      path: string;
      version: 1 | 2;
    }

    interface Request {
      path: string;
      key: string;
      env: string;
    }
  }

  namespace Input {
    interface SecretsEngine {
      name: SecretsEngines;
      config: KV.Config;
    }
    type Secrets = KV.Request[];
  }

}
