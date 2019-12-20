import { AxiosInstance } from 'axios';
import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';

export async function importKV2Secrets(
  client: AxiosInstance,
  secrets: VaultAction.Input.Secrets,
  token: string,
) {
  secrets.forEach(async ({ path, key, env }) => {
    const res = await client.post(`/data/${path}`, { token });
    const value = res.data.data[key];
    // Export secret as environment variable and mask it
    command.issue('add-mask', value);
    core.exportVariable(env, `${value}`);
    core.debug(`✔ ${path} => ${env}`);
  });
}
