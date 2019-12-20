# Vault Action

Install the dependencies

```bash
yarn install
```

Build the typescript

```bash
yarn build
```

Run the tests :heavy_check_mark:

```bash
yarn test
```

## Usage

Import vault secrets with the KV2 engine and Github authentication.

Secrets can be loaded as environment variables with the `env` key, or can be
stored as a file with the `file` config.

```yaml
- name: Import Secrets
  uses: minddocdev/vault-action@v1
  with:
    url: https://vault.mycompany.fake
    token: ${{ secrets.GITHUB_TOKEN }}
    secrets: |
      - path: mygroup1/mygroup2
        key: mykey1
        env: MY_KEY
      - path: mygroup1/mygroup2
        key: mykey2
        file: mypath/myfile.txt
    secretsEngine: |
      name: kv
      config:
        path: /secret
        version: 2
```
