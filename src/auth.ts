import { AxiosInstance } from 'axios';
import * as core from '@actions/core';

import { AuthMethods } from './types';

export async function login(
  client: AxiosInstance, authMethod: AuthMethods, token: string,
) {
  if (authMethod === AuthMethods.github) {
    const url = '/github/login';
    core.debug(`POST login ${url}...`);
    const res = await client.post(url, { token });
    core.debug('✔ Token generated successfully');
    return res.data.auth.client_token;
  }
  throw new Error(`Unsupported auth method: ${authMethod}`);
}
