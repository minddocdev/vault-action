import { AxiosInstance } from 'axios';
import * as core from '@actions/core';
import * as command from '@actions/core/lib/command';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { Input } from './types';

export async function importKV2Secrets(
  client: AxiosInstance,
  secrets: Input.Secrets,
) {
  secrets.forEach(async ({ path, key, env, file }) => {
    const url = `/data/${path}`;
    const res = await client.get(url);
    core.debug('✔ Secret received successfully');
    if (env) {
      const value = res.data.data.data[key];
      // Export secret as environment variable and mask all lines
      value.split('\n').forEach(line => command.issue('add-mask', line));
      core.exportVariable(env, value);
      core.debug(`✔ ${path} => ${env}`);
    }
    if (file) {
      const value = yaml.safeDump(
        res.data.data.data.file, { skipInvalid: true },
      ).replace(/^\|+|\|+$/g, '');
      fs.writeFileSync(file, value);
    }
  });
}
