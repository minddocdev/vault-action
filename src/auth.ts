import { AxiosInstance } from 'axios';

export async function login(
  client: AxiosInstance, authMethod: VaultAction.AuthMethods, token: string,
) {
  if (authMethod === VaultAction.AuthMethods.github) {
    const res = await client.post('/github/login', { token });
    return res.data.auth.client_token;
  }
  throw new Error(`Unsupported auth method: ${authMethod}`);
}
