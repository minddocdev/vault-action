import * as core from '@actions/core';
import * as yaml from 'js-yaml';
import axios from 'axios';

import { login } from './auth';
import { importKV2Secrets } from './kv';
import { AuthMethods, Input, KV, SecretsEngines } from './types';

const loadYaml = (name: string, options?: core.InputOptions | undefined) => {
  const rawValue = core.getInput(name, options);
  try {
    const value = yaml.safeLoad(rawValue);
    core.debug(`Loaded YAML string: ${value}`);
    return value;
  } catch (err) {
    throw new Error(`Expecting YAML string for: ${name}`);
  }
};

const vaultClient = (url: string, headers) => {
  return axios.create({
    headers,
    baseURL: url,
  });
};

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const token = core.getInput('token', { required: true });
    const secrets = loadYaml('secrets', {
      required: true,
    }) as Input.Secrets;
    const namespace = core.getInput('namespace', { required: false });
    const authMethod = AuthMethods.github; // TODO - Support other auth methods
    const secretsEngine: Input.SecretsEngine = loadYaml('secretEngine', { required: false }) || {
      name: SecretsEngines.KV,
      config: {
        path: '/kv',
        version: 2,
      } as KV.Config,
    };

    if (secretsEngine.name !== SecretsEngines.KV) {
      // TODO - Support other secret engines
      throw new Error(`Unsupported secret engine: ${secretsEngine}`);
    } else if (secretsEngine.config.version !== 2) {
      // TODO - Support KV1 secret engine
      throw new Error(`Unsupported KV engine version ${secretsEngine.config.version}`);
    }

    core.debug('Loaded variables:');
    core.debug(`- url: ${url}`);
    core.debug(`- token: ${token}`);
    core.debug(`- secrets: ${secrets}`);
    core.debug(`- namespace: ${namespace}`);
    core.debug(`- auth method: ${authMethod}`);
    core.debug(`- secrets engine: ${secretsEngine}`);

    const headers = {};
    if (namespace != null) {
      headers['X-Vault-Namespace'] = namespace;
    }
    const vaultToken = await core.group(`Login using ${authMethod}`, () =>
      login(vaultClient(`${url}/v1/auth`, headers), authMethod, token),
    );
    headers['X-Vault-Token'] = vaultToken;
    await core.group(`Retrieve Vault Secrets using ${secretsEngine.name} engine`, () =>
      importKV2Secrets(
        vaultClient(`${url}/v1${secretsEngine.config.path}`, headers),
        secrets,
      ),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
