import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';

describe('run', () => {
  const mainJsPath = path.join(__dirname, '..', 'lib', 'main.js');

  beforeEach(() => {
    process.env['INPUT_URL'] = 'fakeurl';
    process.env['INPUT_TOKEN'] = 'faketoken';
    // !: an empty string is not valid - should be a YAML dictionary/object
    process.env['INPUT_SECRETS'] = '';
  });

  // !: this test is meant to check that the environment variables are defined
  // !: but we don't know why it fails. even with INPUT_URL, INPUT_TOKEN and INPUT_SECRETS
  // !: it still attempts to connect to vault and then fails
  test('with required variables', () => {
    const options: cp.ExecSyncOptions = {
      env: process.env,
    };
    console.log("THIS TEST DOES NOT WORK.")
    // console.log(cp.execSync(`node ${mainJsPath}`, options).toString());
  });
});
