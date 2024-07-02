import gitmojis from '@/constants/gitmojis';
import { selectors } from '@/store';

const typesExample = gitmojis.map((item) => `- ${item.type}: ${item.desc}`).join('\n');

const custionPrompt = selectors.getConfig('prompt');
const locale = selectors.getConfig('locale');
const maxLength = selectors.getConfig('maxLength');

export const BASE_PROMPT = `你需要扮演 Git 提交信息的作者角色。你的任务是按照约定性提交规范创建清晰且全面的提交信息，解释修改了什么以及为何进行这些修改。我会输入一个 Git 差异摘要，你的工作是将其转换为有用的提交信息。在提交信息后添加对修改的简短描述。不要以"This commit"开头，只需描述修改。使用现在时态。每行字符数不能超过74个字符。`;

let prompt: string = custionPrompt ? custionPrompt : BASE_PROMPT;

const template: string = [
  prompt,
  `从下面要描述的类型中只选择一种类型：`,
  typesExample,
  `提交消息的长度不能超过  ${maxLength} 个字符.`,
  locale && `提交消息语言: ${locale}`,
]
  .filter(Boolean)
  .join('\n');

export default template;
