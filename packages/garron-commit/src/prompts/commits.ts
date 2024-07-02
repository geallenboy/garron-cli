import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';

import gitmojis from '@/constants/gitmojis';
import { selectors } from '@/store';

const BASE_PROMPT = `你要扮演 Git 提交信息的作者角色。你的任务是按照常规提交约定创建清晰且全面的提交消息，解释修改了什么以及为何进行这些修改。我将输入一个 Git 差异摘要，你的工作是将其转换为有用的提交消息。在提交消息后添加对修改的简短描述，不要以"This commit"开头，只需描述修改。使用现在时态，每行字符数不能超过74个字符。`;

const TYPES_EXAMPLE = gitmojis.map((item) => `- ${item.type}: ${item.desc}`).join('\n');

const PROMPT = selectors.getConfig('prompt') || BASE_PROMPT;
const LOCALE = selectors.getConfig('locale');
const MAX_LENGTH = selectors.getConfig('maxLength');

export const promptCommits = () => {
  return ChatPromptTemplate.fromMessages<{
    summary: string;
  }>([
    [
      'system',
      [
        PROMPT,
        `## 规则`,
        `- 从下面要描述的类型中只选择一种类型: <${TYPES_EXAMPLE}>`,
        `- 提交消息的长度不能超过 ${MAX_LENGTH} 个字符.`,
        LOCALE && `- 提交消息语言: ${LOCALE}`,
      ]
        .filter(Boolean)
        .join('\n'),
    ],
    ['human', '只返回一个类型的提交消息描述 Git 差异摘要: {summary}'],
  ]);
};

const summaryTemplate = [
  `您将充当git中提交消息的作者。你的任务是在传统的承诺公约中创建干净、全面的承诺信息，并解释这些变化是什么以及为什么要做这些变化，我将输入一个gitdiff摘要，您的工作是将其转换为有用的提交消息。`,
  `--------`,
  `{text}`,
  `--------`,
  `添加提交消息后所做更改的简短描述。不要以“This commit”开头，只返回描述git diff摘要的1种类型的commit消息。`,
]
  .filter(Boolean)
  .join('\n');

const summaryRefineTemplate = [
  summaryTemplate,
  `## 规则`,
  `- 从下面要描述的类型中只选择一种类型: <${TYPES_EXAMPLE}>`,
  `- 提交消息的长度不能超过 ${MAX_LENGTH} 个字符.`,
  LOCALE && `- 提交消息语言: ${LOCALE}`,
]
  .filter(Boolean)
  .join('\n');

export const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);
export const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(summaryRefineTemplate);
