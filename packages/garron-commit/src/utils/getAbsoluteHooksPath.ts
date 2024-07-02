import { alert } from '@garron/cli-ui';
import { execaSync } from 'execa';
import path from 'node:path';

export const ERROR_CODE = 'not git';

export default (hookName: string): string => {
  try {
    try {
      const { stdout: coreHooksPath }: any = execaSync('git', [
        'config',
        '--get',
        'core.hooksPath',
      ]);

      return path.resolve(coreHooksPath, hookName);
    } catch {
      const { stdout: gitDirectoryPath } = execaSync('git', ['rev-parse', '--absolute-git-dir']);

      return path.resolve(gitDirectoryPath + '/hooks', hookName);
    }
  } catch {
    alert.error('请检查这是否是一个git文件夹', true);
    return ERROR_CODE;
  }
};
