import { AxiosInstance } from 'axios';
import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';
import * as fs from 'fs';

import { Input } from './types';

export async function importKV2Secrets(
  client: AxiosInstance,
  secrets: Input.Secrets,
) {
  secrets.forEach(async ({ path, key, env, file, unmask }) => {
    const url = `/data/${path}`;
    const res = await client.get(url);
    core.debug('✔ Secret received successfully');
    const value = res.data.data.data[key];
    if (env) {
      // Export secret as environment variable
      if (!unmask) {
        // Mask all lines by default
        value.split('\n').forEach(line => command.issue('add-mask', line));
      }
      core.exportVariable(env, value);
      core.debug(`✔ ${path} => ${env}`);
    }
    if (file) {
      fs.writeFileSync(file, value);
    }
  });
}
