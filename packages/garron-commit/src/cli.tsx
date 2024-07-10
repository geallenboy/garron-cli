import { render } from '@garron/cli-ui';
import { Command, Option } from 'commander';
import updateNotifier from 'update-notifier';

import packageJson from '@/../package.json';
import { Ai, Commit, Config, HookCreate, HookRemove, List } from '@/commands';

const notifier = updateNotifier({
  pkg: packageJson,
  shouldNotifyInNpmScript: true,
});

notifier.notify({ isGlobal: true });

const program = new Command();

program
  .name('garron-commit')
  .description(packageJson.description)
  .version(packageJson.version)
  .addOption(new Option('--hook', '使用提示交互提交'))
  .addOption(new Option('-a, --ai', '通过ChatGPT生成提示'))
  .addOption(new Option('-o, --option', '设置garron-commit提交首选项'))
  .addOption(new Option('-i, --init', '将garron-commit初始化为提交挂钩'))
  .addOption(new Option('-r, --remove', '删除以前初始化的提交挂钩'))
  .addOption(new Option('-l, --list', '列出支持的所有提交类型'))
  .parse();

interface Flags {
  ai?: boolean;
  hook?: boolean;
  init?: boolean;
  list?: boolean;
  option?: boolean;
  remove?: boolean;
}

const options: Flags = program.opts();

if (options.ai) {
  render(<Ai />);
} else if (options.option) {
  render(<Config />);
} else if (options.init) {
  render(<HookCreate />);
} else if (options.remove) {
  render(<HookRemove />);
} else if (options.list) {
  render(<List />);
} else if (options.hook) {
  render(<Commit hook />);
} else {
  render(<Commit />);
}
