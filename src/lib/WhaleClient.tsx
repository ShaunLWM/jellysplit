
import { WhaleApiClient } from '@defichain/whale-api-client';

class WhaleClient {
  _client;

  constructor() {
    this._client = new WhaleApiClient({
      url: 'https://ocean.defichain.com',
      network: 'mainnet',
      version: 'v0'
    });
  }

  get client() {
    return this._client;
  }
}

export const Whale = new WhaleClient().client;