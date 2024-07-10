export interface GimojiItem {
  code: string;
  desc: string;
  emoji: string;
  name: string;
  type: string;
}

const gimojis: GimojiItem[] = [
  {
    code: ':sparkles:',
    desc: '引入新功能',
    emoji: '✨',
    name: 'sparkles',
    type: 'feat',
  },
  {
    code: ':bug:',
    desc: '修复一个错误',
    emoji: '🐛',
    name: 'bug',
    type: 'fix',
  },
  {
    code: ':recycle:',
    desc: '重构既不修复错误也不添加功能的代码',
    emoji: '♻️',
    name: 'recycle',
    type: 'refactor',
  },
  {
    code: ':zap:',
    desc: '提高性能的代码更改',
    emoji: '⚡',
    name: 'zap',
    type: 'perf',
  },
  {
    code: ':lipstick:',
    desc: '添加或更新不影响代码含义的样式文件',
    emoji: '💄',
    name: 'lipstick',
    type: 'style',
  },
  {
    code: ':white_check_mark:',
    desc: '添加缺失的测试或更正现有测试',
    emoji: '✅',
    name: 'white-check-mark',
    type: 'test',
  },
  {
    code: ':memo:',
    desc: '仅文档更改',
    emoji: '📝',
    name: 'memo',
    type: 'docs',
  },
  {
    code: ':construction_worker:',
    desc: '更改CI配置文件和脚本',
    emoji: '👷',
    name: 'construction-worker',
    type: 'ci',
  },
  {
    code: ':wrench:',
    desc: '其他不修改src或测试文件的更改',
    emoji: '🔧',
    name: 'wrench',
    type: 'chore',
  },
  {
    code: ':package:',
    desc: '进行架构更改',
    emoji: '📦',
    name: 'package',
    type: 'build',
  },
];

export default gimojis;
