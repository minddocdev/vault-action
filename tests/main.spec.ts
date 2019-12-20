import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

describe('run', () => {
  const mainJsPath = path.join(__dirname, '..', 'lib', 'main.js');

  beforeEach(() => {
    process.env['INPUT_URL'] = 'fakeurl';
    process.env['INPUT_TOKEN'] = 'faketoken';
    process.env['INPUT_SECRETS'] = '';

  });

  test('with required variables', () => {
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log(cp.execSync(`node ${mainJsPath}`, options).toString());
  });
});
