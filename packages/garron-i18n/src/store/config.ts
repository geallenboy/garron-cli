import Conf from 'conf';
import { PublicExplorerSync, cosmiconfigSync } from 'cosmiconfig';

import { ConfigSchema } from '@/types/config';

export const schema: ConfigSchema = {
  apiBaseUrl: {
    default: '',
    type: 'string',
  },
  openaiToken: {
    default: '',
    type: 'string',
  },
};
export const config = new Conf({
  projectName: 'garron-i18n',
  schema,
});

class ExplorerConfig {
  explorer: PublicExplorerSync;
  customConfig?: string;
  constructor() {
    this.explorer = cosmiconfigSync('i18n');
  }

  loadCustomConfig(pathToConfig: string) {
    this.customConfig = pathToConfig;
  }

  getConfigFile() {
    if (this.customConfig) return this.explorer.load(this.customConfig)?.config;
    return this.explorer.search()?.config;
  }
}

export const explorer = new ExplorerConfig();
