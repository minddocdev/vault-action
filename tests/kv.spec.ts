import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

describe('kv', () => {
  test('dumps yaml string correctly', () => {
    const raw = 'secret:\n  key1: value1\n  key2: value2\n';
    const value = yaml.safeDump(raw, { skipInvalid: true }).replace(/^\|+|\|+$/g, '');
    const dump = yaml.safeDump(
      fs.readFileSync(path.resolve(__dirname, 'dump.yaml'), 'utf8'),
    ).replace(/^\|+|\|+$/g, '');
    expect(value).toEqual(dump);
  });
});
