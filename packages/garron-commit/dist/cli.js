#!/usr/bin/env node
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { alert, useTheme, Panel, SelectInput, SplitView, ConfigPanel, render } from '@garron/cli-ui';
import { Command, Option } from 'commander';
import updateNotifier from 'update-notifier';
import { Spinner, Badge, TextInput, MultiSelect, Alert } from '@inkjs/ui';
import { Text, useInput, Box } from 'ink';
import { useRef, useState, useCallback, memo, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import { loadSummarizationChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { execSync } from 'node:child_process';
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';
import { kebabCase, upperFirst, debounce } from 'lodash-es';
import { createWithEqualityFn } from 'zustand/traditional';
import pangu from 'pangu';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';
import Conf from 'conf';
import gitconfig from 'gitconfig';
import { encode } from 'gpt-tokenizer';
import fs from 'node:fs';
import * as process$1 from 'node:process';
import process__default from 'node:process';
import { shallow } from 'zustand/shallow';
import { execaSync } from 'execa';
import path from 'node:path';
import isEqual from 'fast-deep-equal';

var name = "@garron/commit-cli";
var version = "0.0.6";
var description = "garron Commit是一个CLI工具，使用ChatGPT生成基于Gitmoji的提交消息";
var keywords = [
	"ai",
	"git",
	"commit",
	"openai",
	"gpt",
	"gitmoji-cli",
	"git-commits",
	"chatgpt",
	"aicommit",
	"ai-commit"
];
var homepage = "https://github.com/geallenboy/garron-cli/tree/master/packages/garron-commit";
var bugs = {
	url: "https://github.com/geallenboy/garron-cli/issues/new"
};
var repository = {
	type: "git",
	url: "https://github.com/geallenboy/garron-cli.git"
};
var license = "MIT";
var author = "gejialun88@gmail.com";
var type = "module";
var imports = {
	"@": "./src"
};
var bin = {
	garron: "dist/cli.js",
	"garron-commit": "dist/cli.js"
};
var files = [
	"dist"
];
var scripts = {
	build: "npm run type-check && pkgroll --minify -p tsconfig.prod.json --env.NODE_ENV=production && npm run shebang",
	dev: "pkgroll -p tsconfig.prod.json --env.NODE_ENV=development --watch",
	link: "npm run build && npm link -f",
	shebang: "garron-shebang -t ./dist/cli.js",
	start: "node ./dist/cli.js",
	test: "vitest --passWithNoTests",
	"test:coverage": "vitest run --coverage --passWithNoTests",
	"type-check": "tsc --noEmit"
};
var dependencies = {
	"@garron/cli-ui": "0.0.4",
	"@inkjs/ui": "^1",
	"@langchain/core": "latest",
	"@langchain/openai": "latest",
	chalk: "^5",
	commander: "^11",
	conf: "^12",
	dotenv: "^16",
	execa: "^8",
	"fast-deep-equal": "^3",
	gitconfig: "^2",
	"gpt-tokenizer": "^2",
	ink: "^4.2",
	langchain: "latest",
	"lodash-es": "^4",
	octokit: "^3",
	pangu: "^4",
	"path-exists": "^5",
	react: "^18",
	swr: "^2",
	"update-notifier": "^7",
	zustand: "^4"
};
var peerDependencies = {
	ink: ">=4",
	react: ">=18"
};
var engines = {
	node: ">=18"
};
var publishConfig = {
	access: "public",
	registry: "https://registry.npmjs.org/"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	keywords: keywords,
	homepage: homepage,
	bugs: bugs,
	repository: repository,
	license: license,
	author: author,
	type: type,
	imports: imports,
	bin: bin,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	peerDependencies: peerDependencies,
	engines: engines,
	publishConfig: publishConfig
};

const gimojis = [
  {
    code: ":sparkles:",
    desc: "\u5F15\u5165\u65B0\u529F\u80FD",
    emoji: "\u2728",
    name: "sparkles",
    type: "feat"
  },
  {
    code: ":bug:",
    desc: "\u4FEE\u590D\u4E00\u4E2A\u9519\u8BEF",
    emoji: "\u{1F41B}",
    name: "bug",
    type: "fix"
  },
  {
    code: ":recycle:",
    desc: "\u91CD\u6784\u65E2\u4E0D\u4FEE\u590D\u9519\u8BEF\u4E5F\u4E0D\u6DFB\u52A0\u529F\u80FD\u7684\u4EE3\u7801",
    emoji: "\u267B\uFE0F",
    name: "recycle",
    type: "refactor"
  },
  {
    code: ":zap:",
    desc: "\u63D0\u9AD8\u6027\u80FD\u7684\u4EE3\u7801\u66F4\u6539",
    emoji: "\u26A1",
    name: "zap",
    type: "perf"
  },
  {
    code: ":lipstick:",
    desc: "\u6DFB\u52A0\u6216\u66F4\u65B0\u4E0D\u5F71\u54CD\u4EE3\u7801\u542B\u4E49\u7684\u6837\u5F0F\u6587\u4EF6",
    emoji: "\u{1F484}",
    name: "lipstick",
    type: "style"
  },
  {
    code: ":white_check_mark:",
    desc: "\u6DFB\u52A0\u7F3A\u5931\u7684\u6D4B\u8BD5\u6216\u66F4\u6B63\u73B0\u6709\u6D4B\u8BD5",
    emoji: "\u2705",
    name: "white-check-mark",
    type: "test"
  },
  {
    code: ":memo:",
    desc: "\u4EC5\u6587\u6863\u66F4\u6539",
    emoji: "\u{1F4DD}",
    name: "memo",
    type: "docs"
  },
  {
    code: ":construction_worker:",
    desc: "\u66F4\u6539CI\u914D\u7F6E\u6587\u4EF6\u548C\u811A\u672C",
    emoji: "\u{1F477}",
    name: "construction-worker",
    type: "ci"
  },
  {
    code: ":wrench:",
    desc: "\u5176\u4ED6\u4E0D\u4FEE\u6539src\u6216\u6D4B\u8BD5\u6587\u4EF6\u7684\u66F4\u6539",
    emoji: "\u{1F527}",
    name: "wrench",
    type: "chore"
  },
  {
    code: ":package:",
    desc: "\u8FDB\u884C\u67B6\u6784\u66F4\u6539",
    emoji: "\u{1F4E6}",
    name: "package",
    type: "build"
  }
];

const commitMessageToObj = (msg) => {
  const emojiReg = /^(\S+)\s/;
  const typeReg = /\s(\w+)(?=\(|:)/;
  const scopeReg = /\(([^)]+)\)/;
  const subjectReg = /:\s([^\n:]+)/s;
  return {
    body: msg.indexOf("\n") > 0 ? msg.slice(Math.max(0, msg.indexOf("\n") + 1)).trim() : void 0,
    emoji: emojiReg.test(msg) ? msg.match(emojiReg)?.[1] || "\u{1F527}" : "\u{1F527}",
    scope: scopeReg.test(msg) ? msg.match(scopeReg)?.[1] : void 0,
    subject: subjectReg.test(msg) ? msg.match(subjectReg)?.[1] || "Nothing" : "Nothing",
    type: typeReg.test(msg) ? msg.match(typeReg)?.[1] || "chore" : "chore"
  };
};
const commotObjToMessage = ({
  emoji,
  type,
  scope,
  subject,
  issues,
  body,
  issuesType
}) => {
  if (!type)
    return "waiting for selection...";
  const formateType = type.toLowerCase();
  const formateScope = scope && kebabCase(scope).replaceAll(/\s+/g, " ");
  const formateSubject = upperFirst(pangu.spacing(subject).replaceAll(/\s+/g, " "));
  const formateIssues = issues && issues.replace("#", "").replaceAll(/\s+/g, " ").replaceAll(/[ ./|，]/g, ",").split(",").filter(Boolean).map((num) => `${issuesType ? `${issuesType} ` : ""}#${num}`);
  return `${emoji} ${formateType}${formateScope ? `(${formateScope})` : ""}: ${formateSubject}${formateIssues && formateIssues?.length > 0 ? ` (${formateIssues.join(",")})` : ""}${body ? `

${body}` : ""}`;
};
const addEmojiToMessage = (message) => {
  const [type, ...rest] = message.split(": ");
  let emoji = "\u{1F527}";
  for (const item of gimojis) {
    if (type.includes(item.type))
      emoji = item.emoji;
  }
  return `${emoji} ${type}: ${rest.join(": ")}`;
};

const gitHubRepoRegEx = /^https?:\/\/github\.com\/(.+?)\/(.+?)\.git$|^git@github\.com:(.+?)\/(.+?)\.git$/;
var getRepo = async () => {
  try {
    const config = await gitconfig.get({ location: "local" });
    const repoUrl = config?.remote?.origin?.url;
    if (!repoUrl)
      return;
    const match = gitHubRepoRegEx.exec(repoUrl);
    const [owner, repoName] = match.slice(3);
    return {
      owner,
      repoName
    };
  } catch {
    return;
  }
};

var getIssuesList = async () => {
  try {
    const repoInfo = await getRepo();
    if (!repoInfo)
      return;
    const octokit = new Octokit({
      auth: selectors.getGithubToken()
    });
    const { data } = await octokit.rest.issues.listForRepo({
      owner: repoInfo.owner,
      repo: repoInfo.repoName,
      state: "open"
    });
    return data;
  } catch {
    return;
  }
};

const useCommitStore = createWithEqualityFn((set, get) => ({
  body: "",
  emoji: "",
  fetchIssuesList: async () => {
    const data = await getRepo();
    if (data) {
      set({ isGithubRepo: true, issuesLoading: true });
      const issuesData = await getIssuesList();
      const issueList = issuesData?.filter((item) => item.state === "open") || [];
      if (issueList?.length > 0) {
        set({ issueList, issuesLoading: false });
      } else {
        set({ isGithubRepo: false, issuesLoading: false });
      }
    }
  },
  isGithubRepo: false,
  issueList: [],
  issues: "",
  issuesLoading: false,
  issuesType: "",
  message: "",
  refreshMessage: () => {
    const { issues, scope, subject, type, emoji, body, issuesType } = get();
    const message = commotObjToMessage({ body, emoji, issues, issuesType, scope, subject, type });
    set({ message });
  },
  scope: "",
  setEmoji: (emoji) => {
    set({ emoji });
    get().refreshMessage();
  },
  setIssues: (issues) => {
    set({ issues });
    get().refreshMessage();
  },
  setIssuesType: (issuesType) => {
    set({ issuesType });
    get().refreshMessage();
  },
  setMessage: (message) => {
    const obj = commitMessageToObj(message);
    set({ ...obj });
    get().refreshMessage();
  },
  setScope: (scope) => {
    set({ scope: kebabCase(scope) });
    get().refreshMessage();
  },
  setStep: (step) => {
    set({ step });
    get().refreshMessage();
  },
  setSubject: (subject) => {
    set({ subject });
    get().refreshMessage();
  },
  setType: (type) => {
    set({ type });
    get().refreshMessage();
  },
  step: "type",
  subject: "",
  type: ""
}));

var LanguageModel = /* @__PURE__ */ ((LanguageModel2) => {
  LanguageModel2["GPT3_5"] = "gpt-3.5-turbo";
  LanguageModel2["GPT3_5_0125"] = "gpt-3.5-turbo-0125";
  LanguageModel2["GPT3_5_1106"] = "gpt-3.5-turbo-1106";
  LanguageModel2["GPT3_5_16K"] = "gpt-3.5-turbo-16k";
  LanguageModel2["GPT4"] = "gpt-4";
  LanguageModel2["GPT4_0125_PREVIEW"] = "gpt-4-0125-preview";
  LanguageModel2["GPT4_32K"] = "gpt-4-32k";
  LanguageModel2["GPT4_PREVIEW"] = "gpt-4-1106-preview";
  LanguageModel2["GPT4_VISION_PREVIEW"] = "gpt-4-vision-preview";
  return LanguageModel2;
})(LanguageModel || {});
const ModelTokens = {
  ["gpt-3.5-turbo" /* GPT3_5 */]: 4096,
  ["gpt-3.5-turbo-1106" /* GPT3_5_1106 */]: 16385,
  ["gpt-3.5-turbo-16k" /* GPT3_5_16K */]: 16385,
  ["gpt-3.5-turbo-0125" /* GPT3_5_0125 */]: 16385,
  ["gpt-4" /* GPT4 */]: 8196,
  ["gpt-4-1106-preview" /* GPT4_PREVIEW */]: 128e3,
  ["gpt-4-vision-preview" /* GPT4_VISION_PREVIEW */]: 128e3,
  ["gpt-4-0125-preview" /* GPT4_0125_PREVIEW */]: 128e3,
  ["gpt-4-32k" /* GPT4_32K */]: 32768
};
const defaultModel = "gpt-3.5-turbo-0125" /* GPT3_5_0125 */;

const schema = {
  apiBaseUrl: {
    default: "",
    type: "string"
  },
  diffChunkSize: {
    default: ModelTokens[defaultModel] - 512,
    type: "number"
  },
  emoji: {
    default: "emoji",
    type: "string"
  },
  githubToken: {
    default: "",
    type: "string"
  },
  locale: {
    default: "",
    type: "string"
  },
  maxLength: {
    default: 100,
    type: "number"
  },
  modelName: {
    default: defaultModel,
    type: "string"
  },
  openaiToken: {
    default: "",
    type: "string"
  },
  prompt: {
    default: "",
    type: "string"
  }
};
const config = new Conf({
  projectName: "garron-commit",
  schema
});

dotenv.config();
const getConfig = (key) => config.get(key);
const getDefulatConfig = (key) => schema[key].default;
const setConfig = (key, value) => config.set(key, value);
const getOpenAIApiKey = () => process.env.OPENAI_API_KEY || getConfig("openaiToken");
const getOpenAIProxyUrl = () => process.env.OPENAI_PROXY_URL || getConfig("apiBaseUrl");
const getGithubToken = () => process.env.GITHUB_TOKEN || process.env.GH_TOKEN || getConfig("githubToken");
const getModelMaxToken = () => ModelTokens[getConfig("modelName")];
const getDiffChunkSize = () => {
  let defaultDiffChunkSize = getModelMaxToken() - 512;
  const diffChunkSize = getConfig("diffChunkSize");
  return defaultDiffChunkSize > diffChunkSize ? defaultDiffChunkSize : diffChunkSize;
};
const getCommitConfig = () => ({
  ...config.store,
  apiBaseUrl: getOpenAIProxyUrl(),
  diffChunkSize: getDiffChunkSize(),
  githubToken: getGithubToken(),
  openaiToken: getOpenAIApiKey()
});
var selectors = {
  getCommitConfig,
  getConfig,
  getDefulatConfig,
  getGithubToken,
  getOpenAIApiKey,
  getOpenAIProxyUrl,
  setConfig
};

const useConfStore = () => {
  return {
    get: selectors.getConfig,
    getDefault: selectors.getDefulatConfig,
    set: selectors.setConfig,
    store: selectors.getCommitConfig()
  };
};

const BASE_PROMPT$1 = `\u4F60\u8981\u626E\u6F14 Git \u63D0\u4EA4\u4FE1\u606F\u7684\u4F5C\u8005\u89D2\u8272\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u6309\u7167\u5E38\u89C4\u63D0\u4EA4\u7EA6\u5B9A\u521B\u5EFA\u6E05\u6670\u4E14\u5168\u9762\u7684\u63D0\u4EA4\u6D88\u606F\uFF0C\u89E3\u91CA\u4FEE\u6539\u4E86\u4EC0\u4E48\u4EE5\u53CA\u4E3A\u4F55\u8FDB\u884C\u8FD9\u4E9B\u4FEE\u6539\u3002\u6211\u5C06\u8F93\u5165\u4E00\u4E2A Git \u5DEE\u5F02\u6458\u8981\uFF0C\u4F60\u7684\u5DE5\u4F5C\u662F\u5C06\u5176\u8F6C\u6362\u4E3A\u6709\u7528\u7684\u63D0\u4EA4\u6D88\u606F\u3002\u5728\u63D0\u4EA4\u6D88\u606F\u540E\u6DFB\u52A0\u5BF9\u4FEE\u6539\u7684\u7B80\u77ED\u63CF\u8FF0\uFF0C\u4E0D\u8981\u4EE5"This commit"\u5F00\u5934\uFF0C\u53EA\u9700\u63CF\u8FF0\u4FEE\u6539\u3002\u4F7F\u7528\u73B0\u5728\u65F6\u6001\uFF0C\u6BCF\u884C\u5B57\u7B26\u6570\u4E0D\u80FD\u8D85\u8FC774\u4E2A\u5B57\u7B26\u3002`;
const TYPES_EXAMPLE = gimojis.map((item) => `- ${item.type}: ${item.desc}`).join("\n");
const PROMPT = selectors.getConfig("prompt") || BASE_PROMPT$1;
const LOCALE = selectors.getConfig("locale");
const MAX_LENGTH = selectors.getConfig("maxLength");
const promptCommits = () => {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        PROMPT,
        `## \u89C4\u5219`,
        `- \u4ECE\u4E0B\u9762\u8981\u63CF\u8FF0\u7684\u7C7B\u578B\u4E2D\u53EA\u9009\u62E9\u4E00\u79CD\u7C7B\u578B: <${TYPES_EXAMPLE}>`,
        `- \u63D0\u4EA4\u6D88\u606F\u7684\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7 ${MAX_LENGTH} \u4E2A\u5B57\u7B26.`,
        LOCALE && `- \u63D0\u4EA4\u6D88\u606F\u8BED\u8A00: ${LOCALE}`
      ].filter(Boolean).join("\n")
    ],
    ["human", "\u53EA\u8FD4\u56DE\u4E00\u4E2A\u7C7B\u578B\u7684\u63D0\u4EA4\u6D88\u606F\u63CF\u8FF0 Git \u5DEE\u5F02\u6458\u8981: {summary}"]
  ]);
};
const summaryTemplate = [
  `\u60A8\u5C06\u5145\u5F53git\u4E2D\u63D0\u4EA4\u6D88\u606F\u7684\u4F5C\u8005\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u5728\u4F20\u7EDF\u7684\u627F\u8BFA\u516C\u7EA6\u4E2D\u521B\u5EFA\u5E72\u51C0\u3001\u5168\u9762\u7684\u627F\u8BFA\u4FE1\u606F\uFF0C\u5E76\u89E3\u91CA\u8FD9\u4E9B\u53D8\u5316\u662F\u4EC0\u4E48\u4EE5\u53CA\u4E3A\u4EC0\u4E48\u8981\u505A\u8FD9\u4E9B\u53D8\u5316\uFF0C\u6211\u5C06\u8F93\u5165\u4E00\u4E2Agitdiff\u6458\u8981\uFF0C\u60A8\u7684\u5DE5\u4F5C\u662F\u5C06\u5176\u8F6C\u6362\u4E3A\u6709\u7528\u7684\u63D0\u4EA4\u6D88\u606F\u3002`,
  `--------`,
  `{text}`,
  `--------`,
  `\u6DFB\u52A0\u63D0\u4EA4\u6D88\u606F\u540E\u6240\u505A\u66F4\u6539\u7684\u7B80\u77ED\u63CF\u8FF0\u3002\u4E0D\u8981\u4EE5\u201CThis commit\u201D\u5F00\u5934\uFF0C\u53EA\u8FD4\u56DE\u63CF\u8FF0git diff\u6458\u8981\u76841\u79CD\u7C7B\u578B\u7684commit\u6D88\u606F\u3002`
].filter(Boolean).join("\n");
const summaryRefineTemplate = [
  summaryTemplate,
  `## \u89C4\u5219`,
  `- \u4ECE\u4E0B\u9762\u8981\u63CF\u8FF0\u7684\u7C7B\u578B\u4E2D\u53EA\u9009\u62E9\u4E00\u79CD\u7C7B\u578B: <${TYPES_EXAMPLE}>`,
  `- \u63D0\u4EA4\u6D88\u606F\u7684\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7 ${MAX_LENGTH} \u4E2A\u5B57\u7B26.`,
  LOCALE && `- \u63D0\u4EA4\u6D88\u606F\u8BED\u8A00: ${LOCALE}`
].filter(Boolean).join("\n");
const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);
const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(summaryRefineTemplate);

const calcToken = (str) => {
  return encode(String(str)).length;
};

class Commits {
  model;
  config;
  textSplitter;
  prompt;
  constructor() {
    this.config = selectors.getCommitConfig();
    if (!this.config.openaiToken) {
      alert.error(
        `Please set the OpenAI Token by ${chalk.bold.yellow("garron-commit --config")}`,
        true
      );
    }
    this.model = new ChatOpenAI({
      configuration: {
        baseURL: this.config.apiBaseUrl
      },
      maxRetries: 10,
      modelName: this.config.modelName,
      openAIApiKey: this.config.openaiToken,
      temperature: 0.5
    });
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: 0,
      chunkSize: this.config.diffChunkSize,
      lengthFunction: (text) => calcToken(text)
    });
    this.prompt = promptCommits();
  }
  async genCommit({ setLoadingInfo, setSummary, cacheSummary }) {
    setLoadingInfo(" Generating...");
    const summary = cacheSummary || await this.genSummary({ setLoadingInfo, setSummary });
    const formattedPrompt = await this.prompt.formatMessages({
      summary
    });
    const res = await this.model.call(formattedPrompt);
    if (!res["text"])
      alert.error("Diff summary failed, please check your network or try again...", true);
    return addEmojiToMessage(
      res["text"].replace(/\((.*?)\):/, (match, p1) => match && `(${p1.toLowerCase()}):`)
    );
  }
  async checkDiffMaxToken(diff) {
    const prompt = await this.prompt.formatMessages({ summary: diff });
    const token = calcToken(JSON.stringify(prompt));
    return token > ModelTokens[this.config.modelName] - 1024;
  }
  async genSummary({
    setLoadingInfo,
    setSummary
  }) {
    let summary;
    const diff = this.getDiff();
    const needSummary = await this.checkDiffMaxToken(diff);
    if (needSummary) {
      if (!diff)
        alert.warn("No changes to commit", true);
      const diffDocument = await this.textSplitter.createDocuments([diff]);
      summary = diff;
      setLoadingInfo(
        ` [1/3] Split diff info to (${diffDocument.length}) by ${this.config.diffChunkSize} chunk size...`
      );
      const chain = loadSummarizationChain(this.model, {
        questionPrompt: SUMMARY_PROMPT,
        refinePrompt: SUMMARY_REFINE_PROMPT,
        type: "refine"
      });
      setLoadingInfo(
        ` [2/3] Split diff info to (${diffDocument.length} * ${this.config.diffChunkSize} chunk-size), generate summary...`
      );
      const diffSummary = await chain.call({
        input_documents: diffDocument
      });
      if (!diffSummary["text"])
        alert.error("Diff summary failed, please check your network or try again...", true);
      summary = String(diffSummary["text"]);
      setLoadingInfo(` [3/3] Generate commit message...`);
      setSummary(summary);
    } else {
      summary = diff;
    }
    return summary;
  }
  getDiff() {
    return execSync(
      "git diff --staged --ignore-all-space --diff-algorithm=minimal --function-context --no-ext-diff --no-color",
      {
        maxBuffer: 1024 ** 6
      }
    ).toString();
  }
}

const useCommits = ({ setMessage, onSuccess, onError, ...config } = {}) => {
  const commits = useRef(new Commits());
  const [summary, setSummary] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(" Generating...");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [key, setKey] = useState(Date.now().toString());
  const { data, isLoading } = useSWR(
    shouldFetch ? key : null,
    async () => commits.current.genCommit({
      cacheSummary: summary,
      setLoadingInfo,
      setSummary
    }),
    {
      onError: (err, ...rest) => {
        onError?.(err, ...rest);
        alert.error(err, true);
      },
      onErrorRetry: () => false,
      onSuccess: (data2, ...rest) => {
        setShouldFetch(false);
        if (data2)
          setMessage?.(data2);
        onSuccess?.(data2, ...rest);
        setIsGlobalLoading(false);
      },
      ...config
    }
  );
  const start = useCallback(() => {
    setKey(Date.now().toString());
    setIsGlobalLoading(true);
    setShouldFetch(true);
  }, []);
  const restart = useCallback(() => {
    setSummary("");
    setKey(Date.now().toString());
    setIsGlobalLoading(true);
    setShouldFetch(true);
  }, []);
  const stop = useCallback(() => {
    setIsGlobalLoading(false);
    setShouldFetch(false);
  }, []);
  return {
    loading: isLoading || isGlobalLoading,
    loadingInfo,
    message: data,
    restart,
    start,
    stop,
    summary
  };
};

const Ai = memo(() => {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const { summary, start, loadingInfo, loading } = useCommits({ setMessage });
  useEffect(() => {
    start();
  }, [start]);
  return /* @__PURE__ */ jsx(
    Panel,
    {
      footer: summary && /* @__PURE__ */ jsxs(Text, { color: theme.colorTextDescription, children: [
        /* @__PURE__ */ jsx(Text, { bold: true, children: `\u{1F449} \u4E0D\u540C\u4FE1\u606F: ` }),
        summary
      ] }),
      reverse: true,
      title: `AI\u63D0\u4EA4\u751F\u6210\u5668`,
      children: !loading && message ? /* @__PURE__ */ jsx(Text, { children: message }) : /* @__PURE__ */ jsx(Spinner, { label: loadingInfo })
    }
  );
});

const HOOK = {
  CONTENTS: '#!/usr/bin/env sh\n# garron-commit as a commit hook\nif npx -v >&/dev/null\nthen\n  exec < /dev/tty\n  npx -c "garron-commit --hook $1 $2"\nelse\n  exec < /dev/tty\n  garron-commit --hook $1 $2\nfi',
  FILENAME: "prepare-commit-msg",
  PERMISSIONS: 509
};

const ERROR_CODE = "not git";
var getAbsoluteHooksPath = (hookName) => {
  try {
    try {
      const { stdout: coreHooksPath } = execaSync("git", [
        "config",
        "--get",
        "core.hooksPath"
      ]);
      return path.resolve(coreHooksPath, hookName);
    } catch {
      const { stdout: gitDirectoryPath } = execaSync("git", ["rev-parse", "--absolute-git-dir"]);
      return path.resolve(gitDirectoryPath + "/hooks", hookName);
    }
  } catch {
    alert.error("Please check if this is a git folder", true);
    return ERROR_CODE;
  }
};

const AiCommit = memo(() => {
  const { message, setMessage, setStep } = useCommitStore((st) => ({
    message: st.message,
    setMessage: st.setMessage,
    setStep: st.setStep
  }));
  useInput(useCallback((_, key) => key.tab && setStep("type"), []));
  const theme = useTheme();
  const { summary, start, loadingInfo, loading, restart } = useCommits({ setMessage });
  const handleSelect = useCallback(
    (item) => {
      switch (item.value) {
        case "reloadFromSummary": {
          start();
          break;
        }
        case "reload": {
          restart();
          break;
        }
        case "edit": {
          setStep("type");
          break;
        }
        case "confirm": {
          setStep("commit");
          break;
        }
      }
    },
    [start, restart]
  );
  useEffect(() => {
    start();
  }, [start]);
  const items = useMemo(
    () => [
      summary && {
        label: "\u{1F504}\uFE0F \u4ECE\u6458\u8981\u4E2D\u91CD\u65B0\u751F\u6210\u63D0\u4EA4\u6D88\u606F[FAST]",
        value: "reloadFromSummary"
      },
      { label: "\u{1F504}\uFE0F \u91CD\u65B0\u751F\u6210\u5B8C\u6574\u63D0\u4EA4\u6D88\u606F[SLOW]", value: "reload" },
      { label: "\u270F\uFE0F  \u7F16\u8F91\u6D88\u606F", value: "edit" },
      { label: "\u2705  \u4F7F\u7528\u6B64\u6D88\u606F", value: "confirm" }
    ].filter(Boolean),
    [summary]
  );
  return /* @__PURE__ */ jsxs(
    Panel,
    {
      footer: !loading && message && /* @__PURE__ */ jsx(SelectInput, { items, onSelect: handleSelect }),
      title: `\u{1F92F} AI\u63D0\u4EA4\u751F\u6210\u5668`,
      children: [
        summary && /* @__PURE__ */ jsx(SplitView, { direction: "bottom", children: /* @__PURE__ */ jsxs(Text, { color: theme.colorTextDescription, children: [
          /* @__PURE__ */ jsx(Text, { bold: true, children: `\u{1F449} DIFF SUMMARY: ` }),
          summary
        ] }) }),
        !loading && message ? /* @__PURE__ */ jsx(Text, { children: message }) : /* @__PURE__ */ jsx(Spinner, { label: loadingInfo })
      ]
    }
  );
});

const Header = memo(({ step, steps, title }) => {
  const theme = useTheme();
  return /* @__PURE__ */ jsxs(Text, { children: [
    /* @__PURE__ */ jsx(Badge, { color: theme.colorText, children: `${step}/${steps}` }),
    /* @__PURE__ */ jsx(Text, { bold: true, children: ` ${title.toUpperCase()}` })
  ] });
});

const InputIssues$1 = memo(() => {
  const { message, setIssues, setStep, issues, fetchIssuesList, isGithubRepo, issuesLoading } = useCommitStore(
    (st) => ({
      fetchIssuesList: st.fetchIssuesList,
      isGithubRepo: st.isGithubRepo,
      issues: st.issues,
      issuesLoading: st.issuesLoading,
      message: st.message,
      refreshMessage: st.refreshMessage,
      setIssues: st.setIssues,
      setStep: st.setStep
    }),
    shallow
  );
  const issueList = useCommitStore((st) => st.issueList, isEqual);
  useInput(useCallback((_, key) => key.tab && setStep("subject"), []));
  const [keywords, setKeywords] = useState("");
  const theme = useTheme();
  useEffect(() => {
    fetchIssuesList();
  }, []);
  const options = useMemo(() => {
    let localIssueList = issueList;
    if (keywords) {
      localIssueList = localIssueList.filter(
        (item) => item.title.toLowerCase().includes(keywords) || String(item.number).includes(keywords)
      );
    }
    return localIssueList.map((item) => ({
      label: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Text,
          {
            backgroundColor: theme.colorBgLayout,
            color: theme.colorText,
            children: ` #${item.number} `
          }
        ),
        ` ${item.title}`
      ] }),
      value: String(item.number)
    }));
  }, [keywords, issueList]);
  const handleKeywords = useCallback((v) => {
    setKeywords(v.replaceAll(" ", ""));
  }, []);
  const handleSelect = useCallback((v) => {
    setIssues(v.join(","));
    setKeywords("");
  }, []);
  const InputKeywords = useCallback(
    () => /* @__PURE__ */ jsx(
      TextInput,
      {
        defaultValue: keywords,
        onChange: debounce(handleKeywords, 100),
        placeholder: "\u8F93\u5165\u5173\u952E\u8BCD\u8FC7\u6EE4\u95EE\u9898\uFF0C\u6309[Space]\u591A\u9009..."
      }
    ),
    [issues]
  );
  const handleSubmit = useCallback(() => {
    setStep(issues ? "issuesType" : "commit");
  }, [issues]);
  return /* @__PURE__ */ jsx(
    Panel,
    {
      footer: /* @__PURE__ */ jsx(Text, { children: message }),
      header: /* @__PURE__ */ jsx(Header, { step: 4, steps: 4, title: "\u94FE\u63A5\u95EE\u9898\uFF08\u53EF\u9009\uFF09" }),
      children: isGithubRepo ? issuesLoading ? /* @__PURE__ */ jsx(Spinner, { label: " Loading issues..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(InputKeywords, {}),
        /* @__PURE__ */ jsxs(SplitView, { children: [
          /* @__PURE__ */ jsx(
            MultiSelect,
            {
              defaultValue: issues.split(","),
              onChange: handleSelect,
              onSubmit: handleSubmit,
              options
            }
          ),
          options.length === 0 && /* @__PURE__ */ jsx(Text, { color: theme.colorWarning, children: "\u672A\u53D1\u73B0\u95EE\u9898\uFF0C\u8BF7\u6309[Enter]\u8DF3\u8FC7\u3002\u3002\u3002" })
        ] })
      ] }) : /* @__PURE__ */ jsx(
        TextInput,
        {
          defaultValue: issues,
          onChange: debounce(setIssues, 100),
          onSubmit: handleSubmit,
          placeholder: "\u8F93\u5165\u7F16\u53F7\u4EE5\u94FE\u63A5\u95EE\u9898\uFF0C\u6309[Enter]\u786E\u8BA4\u6216\u8DF3\u8FC7\u3002\u3002\u3002"
        }
      )
    }
  );
});

const items$1 = [
  {
    label: "Only link issues",
    value: ""
  },
  {
    label: "close #X",
    value: "close"
  },
  {
    label: "fix #X",
    value: "fix"
  },
  {
    label: "resolve #X",
    value: "resolve"
  }
];
const InputIssues = memo(() => {
  const { message, setIssuesType, setStep } = useCommitStore(
    (st) => ({
      message: st.message,
      setIssuesType: st.setIssuesType,
      setStep: st.setStep
    }),
    shallow
  );
  useInput(useCallback((_, key) => key.tab && setStep("issues"), []));
  return /* @__PURE__ */ jsx(
    Panel,
    {
      footer: /* @__PURE__ */ jsx(Text, { children: message }),
      header: /* @__PURE__ */ jsx(Header, { step: 4, steps: 4, title: "\u94FE\u63A5\u95EE\u9898\uFF08\u53EF\u9009\uFF09" }),
      children: /* @__PURE__ */ jsx(
        SelectInput,
        {
          items: items$1,
          onHighlight: (item) => setIssuesType(item.value),
          onSelect: () => setStep("commit")
        }
      )
    }
  );
});

const ListItem = memo(({ item }) => {
  const theme = useTheme();
  return /* @__PURE__ */ jsxs(Box, { children: [
    /* @__PURE__ */ jsx(Box, { marginRight: 1, width: 20, children: /* @__PURE__ */ jsx(Text, { backgroundColor: theme.colorBgLayout, color: theme.colorText, children: ` ${[item.emoji, item.type].filter(Boolean).join(" ")} ` }) }),
    /* @__PURE__ */ jsx(Text, { color: theme.colorTextDescription, children: `- ${item.desc}` })
  ] }, item.name);
});
const List = memo(() => {
  return /* @__PURE__ */ jsx(Panel, { title: `\u{1F92F} Gitmoji list`, children: gimojis.map((item) => /* @__PURE__ */ jsx(ListItem, { item }, item.name)) });
});

const INPUT_VALUE = "Use Input Value";
const commitScopes = [
  {
    label: "\u8F93\u5165\u63D0\u4EA4\u8303\u56F4",
    value: INPUT_VALUE
  },
  {
    label: "\u5305\u7BA1\u7406\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u66F4\u65B0\u6216\u5220\u9664\u4F9D\u8D56\u9879",
    value: "deps"
  },
  {
    label: "\u914D\u7F6E\u6587\u4EF6\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u66F4\u65B0\u6216\u5220\u9664\u914D\u7F6E\u9009\u9879",
    value: "config"
  },
  {
    label: "\u7528\u6237\u754C\u9762\u66F4\u6539\uFF0C\u5982\u5E03\u5C40\u3001\u6837\u5F0F\u6216\u4EA4\u4E92\u4FEE\u6539",
    value: "ui"
  },
  {
    label: "API\u63A5\u53E3\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664API\u7AEF\u70B9",
    value: "api"
  },
  {
    label: "\u6570\u636E\u5E93\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u8868\u3001\u5B57\u6BB5\u6216\u7D22\u5F15",
    value: "database"
  },
  {
    label: "\u6570\u636E\u6A21\u578B\u66F4\u6539\uFF0C\u4F8B\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u6570\u636E\u6A21\u578B",
    value: "model"
  },
  {
    label: "\u63A7\u5236\u5668\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u63A7\u5236\u5668",
    value: "controller"
  },
  {
    label: "\u89C6\u56FE\u66F4\u6539\uFF0C\u4F8B\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u89C6\u56FE",
    value: "view"
  },
  {
    label: "\u7BA1\u7EBF\u66F4\u6539\uFF0C\u4F8B\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u7BA1\u7EBF",
    value: "route"
  },
  {
    label: "\u6D4B\u8BD5\u66F4\u6539\uFF0C\u5982\u6DFB\u52A0\u3001\u4FEE\u6539\u6216\u5220\u9664\u6D4B\u8BD5\u7528\u4F8B",
    value: "test"
  }
];
const items = commitScopes.map((scope) => ({
  label: /* @__PURE__ */ jsx(
    ListItem,
    {
      item: {
        desc: scope.label,
        name: scope.value,
        type: scope.value
      }
    }
  ),
  value: scope.value
}));
const InputScope$1 = memo(() => {
  const { message, setScope, setStep, scope } = useCommitStore(
    (st) => ({
      message: st.message,
      scope: st.scope,
      setScope: st.setScope,
      setStep: st.setStep
    }),
    shallow
  );
  useInput(useCallback((_, key) => key.tab && setStep("type"), []));
  const [isInput, setIsInput] = useState(true);
  const [input, setInput] = useState("");
  const handleSubmit = useCallback(() => {
    setStep("subject");
  }, []);
  const handleInput = useCallback(
    (e) => {
      if (isInput) {
        setScope(e);
        setInput(e);
      }
    },
    [isInput]
  );
  const handleSelect = useCallback((e) => {
    if (e.value === INPUT_VALUE) {
      setIsInput(true);
      setScope(input);
    } else {
      setIsInput(false);
      setScope(e.value);
    }
  }, []);
  return /* @__PURE__ */ jsxs(
    Panel,
    {
      footer: /* @__PURE__ */ jsx(Text, { children: message }),
      header: /* @__PURE__ */ jsx(Header, { step: 2, steps: 4, title: "\u8F93\u5165\u63D0\u4EA4\u8303\u56F4\uFF08\u53EF\u9009\uFF09" }),
      children: [
        /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: scope,
            onChange: debounce(handleInput, 100),
            onSubmit: handleSubmit,
            placeholder: "\u8F93\u5165commit\uFF1Cscope\uFF1E\uFF0C\u6216\u5728\u4E0B\u9762\u9009\u62E9\uFF0C\u6309[Enter]\u8DF3\u8FC7\u3002\u3002\u3002"
          }
        ),
        /* @__PURE__ */ jsx(SplitView, { children: /* @__PURE__ */ jsx(
          SelectInput,
          {
            itemComponent: ({ label }) => label,
            items,
            onHighlight: handleSelect,
            onSelect: handleSubmit
          }
        ) })
      ]
    }
  );
});

const InputScope = memo(() => {
  const { message, setSubject, setStep, subject } = useCommitStore(
    (st) => ({
      message: st.message,
      setStep: st.setStep,
      setSubject: st.setSubject,
      subject: st.subject
    }),
    shallow
  );
  useInput(useCallback((_, key) => key.tab && setStep("scope"), []));
  return /* @__PURE__ */ jsx(
    Panel,
    {
      footer: /* @__PURE__ */ jsx(Text, { children: message }),
      header: /* @__PURE__ */ jsx(Header, { step: 3, steps: 4, title: "\u8F93\u5165\u63D0\u4EA4\u4E3B\u9898" }),
      children: /* @__PURE__ */ jsx(
        TextInput,
        {
          defaultValue: subject,
          onChange: debounce(setSubject, 100),
          onSubmit: () => subject && setStep("issues"),
          placeholder: "\u8F93\u5165\u63D0\u4EA4<subject>..."
        }
      )
    }
  );
});

const emojiFormatConfig = selectors.getConfig("emoji") === "emoji";
const AI_VALUE = "ai";
const aiItem = {
  label: /* @__PURE__ */ jsx(
    ListItem,
    {
      item: {
        desc: "\u901A\u8FC7ChatGPT\u751F\u6210\u63D0\u4EA4\u6D88\u606F",
        emoji: "\u{1F92F}",
        name: "ai",
        type: "Use AI Commit"
      }
    }
  ),
  value: "ai"
};
const InputType = memo(() => {
  const { setType, setStep, setEmoji, type } = useCommitStore(
    (st) => ({
      setEmoji: st.setEmoji,
      setStep: st.setStep,
      setType: st.setType,
      type: st.type
    }),
    shallow
  );
  const [typeKeywords, setTpeKeywords] = useState(type);
  const items = useMemo(() => {
    let data = gimojis;
    if (typeKeywords) {
      data = data.filter((item) => item.type.includes(typeKeywords));
    } else if (type) {
      data = data.filter((item) => item.type.includes(type));
    }
    return data.map((item) => ({
      label: /* @__PURE__ */ jsx(ListItem, { item }),
      value: `${emojiFormatConfig ? item.emoji : item.code} ${item.type}`
    }));
  }, [typeKeywords, type]);
  const handleSelect = useCallback((e) => {
    if (e.value === AI_VALUE) {
      setStep("ai");
    } else {
      const content = e.value.split(" ");
      setEmoji(content[0]);
      setType(content[1]);
      setStep("scope");
    }
  }, []);
  return /* @__PURE__ */ jsx(
    Panel,
    {
      footer: /* @__PURE__ */ jsx(
        TextInput,
        {
          defaultValue: type,
          onChange: debounce(setTpeKeywords, 100),
          placeholder: "\u641C\u7D22\u63D0\u4EA4<type>..."
        }
      ),
      header: /* @__PURE__ */ jsx(Header, { step: 1, steps: 4, title: "\u9009\u62E9\u63D0\u4EA4\u7C7B\u578B" }),
      reverse: true,
      children: /* @__PURE__ */ jsx(
        SelectInput,
        {
          itemComponent: ({ label }) => label,
          items: [...items, aiItem],
          onSelect: handleSelect
        }
      )
    }
  );
});

const RunGitCommit = memo(({ hook }) => {
  const { message } = useCommitStore(
    (st) => ({
      message: st.message
    }),
    shallow
  );
  const [loading, setLoading] = useState(true);
  try {
    useEffect(() => {
      if (hook) {
        fs.writeFileSync(process.argv[3], message);
        setLoading(false);
      } else {
        execaSync("git", ["add", "--all"]);
        execaSync("git", ["commit", "-m", message], {
          buffer: false,
          stdio: "inherit"
        });
        setLoading(false);
      }
    }, []);
    if (loading)
      return /* @__PURE__ */ jsx(Spinner, { label: " Committing..." });
    return /* @__PURE__ */ jsx(Alert, { variant: "success", children: ` \u5DF2\u6210\u529F\u63D0\u4EA4\uFF01` });
  } catch (error) {
    return /* @__PURE__ */ jsx(Alert, { variant: "error", children: ` ${error.message}` });
  }
});

const Commit = memo(({ hook }) => {
  const [hasHook, setHasHook] = useState(false);
  const { step } = useCommitStore(
    (st) => ({
      step: st.step
    }),
    shallow
  );
  useEffect(() => {
    const hookFile = getAbsoluteHooksPath(HOOK.FILENAME);
    if (hookFile === ERROR_CODE)
      process$1.exit(1);
    const hasHookFile = fs.existsSync(hookFile);
    if (hasHookFile)
      setHasHook(true);
  }, []);
  if (!hook && hasHook) {
    return /* @__PURE__ */ jsx(Alert, { variant: "warning", children: `Garron Commit is in hook mode, use "git commit" instead.` });
  }
  if (step === "type")
    return /* @__PURE__ */ jsx(InputType, {});
  if (step === "scope")
    return /* @__PURE__ */ jsx(InputScope$1, {});
  if (step === "subject")
    return /* @__PURE__ */ jsx(InputScope, {});
  if (step === "issues")
    return /* @__PURE__ */ jsx(InputIssues$1, {});
  if (step === "issuesType")
    return /* @__PURE__ */ jsx(InputIssues, {});
  if (step === "ai")
    return /* @__PURE__ */ jsx(AiCommit, {});
  if (step === "commit")
    return /* @__PURE__ */ jsx(RunGitCommit, { hook });
  return;
});

gimojis.map((item) => `- ${item.type}: ${item.desc}`).join("\n");
selectors.getConfig("prompt");
selectors.getConfig("locale");
selectors.getConfig("maxLength");
const BASE_PROMPT = `\u4F60\u9700\u8981\u626E\u6F14 Git \u63D0\u4EA4\u4FE1\u606F\u7684\u4F5C\u8005\u89D2\u8272\u3002\u4F60\u7684\u4EFB\u52A1\u662F\u6309\u7167\u7EA6\u5B9A\u6027\u63D0\u4EA4\u89C4\u8303\u521B\u5EFA\u6E05\u6670\u4E14\u5168\u9762\u7684\u63D0\u4EA4\u4FE1\u606F\uFF0C\u89E3\u91CA\u4FEE\u6539\u4E86\u4EC0\u4E48\u4EE5\u53CA\u4E3A\u4F55\u8FDB\u884C\u8FD9\u4E9B\u4FEE\u6539\u3002\u6211\u4F1A\u8F93\u5165\u4E00\u4E2A Git \u5DEE\u5F02\u6458\u8981\uFF0C\u4F60\u7684\u5DE5\u4F5C\u662F\u5C06\u5176\u8F6C\u6362\u4E3A\u6709\u7528\u7684\u63D0\u4EA4\u4FE1\u606F\u3002\u5728\u63D0\u4EA4\u4FE1\u606F\u540E\u6DFB\u52A0\u5BF9\u4FEE\u6539\u7684\u7B80\u77ED\u63CF\u8FF0\u3002\u4E0D\u8981\u4EE5"This commit"\u5F00\u5934\uFF0C\u53EA\u9700\u63CF\u8FF0\u4FEE\u6539\u3002\u4F7F\u7528\u73B0\u5728\u65F6\u6001\u3002\u6BCF\u884C\u5B57\u7B26\u6570\u4E0D\u80FD\u8D85\u8FC774\u4E2A\u5B57\u7B26\u3002`;

const Config = memo(() => {
  const [active, setActive] = useState();
  const { store, set, getDefault } = useConfStore();
  const setConfig = (key, value) => {
    set(key, value);
    setActive("");
  };
  const items = useMemo(
    () => [
      {
        children: /* @__PURE__ */ jsx(
          SelectInput,
          {
            items: [
              {
                label: "\u{1F604}",
                value: "emoji"
              },
              {
                label: ":smile:",
                value: "code"
              }
            ],
            onSelect: (item) => setConfig("emoji", item.value)
          }
        ),
        defaultValue: getDefault("emoji"),
        key: "emoji",
        label: "Emoji format",
        value: store.emoji
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: store.locale,
            onSubmit: (v) => setConfig("locale", v),
            placeholder: "Input commit message locale..."
          }
        ),
        defaultValue: getDefault("locale") || "en_US",
        desc: "Commit message locale, default as en_US",
        key: "local",
        label: "AI message locale",
        value: store.locale || "en_US"
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: store.prompt,
            onSubmit: (v) => setConfig("prompt", v),
            placeholder: "Input ChatGPT prompt..."
          }
        ),
        defaultValue: getDefault("prompt") || BASE_PROMPT,
        desc: BASE_PROMPT,
        key: "prompt",
        label: "Custom prompt",
        showValue: false,
        value: store.prompt || BASE_PROMPT
      },
      {
        children: /* @__PURE__ */ jsx(
          SelectInput,
          {
            items: [
              {
                label: LanguageModel.GPT3_5,
                value: LanguageModel.GPT3_5
              },
              {
                label: LanguageModel.GPT3_5_1106,
                value: LanguageModel.GPT3_5_1106
              },
              {
                label: LanguageModel.GPT3_5_16K,
                value: LanguageModel.GPT3_5_16K
              },
              {
                label: LanguageModel.GPT4,
                value: LanguageModel.GPT4
              },
              {
                label: LanguageModel.GPT4_PREVIEW,
                value: LanguageModel.GPT4_PREVIEW
              },
              {
                label: LanguageModel.GPT4_32K,
                value: LanguageModel.GPT4_32K
              }
            ],
            onSelect: (item) => setConfig("modelName", item.value)
          }
        ),
        defaultValue: getDefault("modelName"),
        desc: `Default model as ${getDefault("modelName")}`,
        key: "modelName",
        label: "Model Name",
        value: store.modelName
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: String(store.diffChunkSize),
            onSubmit: (v) => setConfig("diffChunkSize", Number(v)),
            placeholder: `Input diff split chunk size ...`
          }
        ),
        defaultValue: getDefault("diffChunkSize"),
        desc: `Default chunk size as ${getDefault("diffChunkSize")}`,
        key: "diffChunkSize",
        label: "Diff split chunk size",
        value: store.diffChunkSize
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: String(store.maxLength),
            onSubmit: (v) => setConfig("maxLength", Number(v)),
            placeholder: `Input maximum character length of the generated commit message...`
          }
        ),
        defaultValue: getDefault("maxLength"),
        desc: `The maximum character length of the generated commit message, default max-length as ${getDefault(
          "maxLength"
        )}`,
        key: "maxLength",
        label: "Commit message max-length",
        value: store.maxLength
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: store.openaiToken,
            onSubmit: (v) => setConfig("openaiToken", v),
            placeholder: "Input OpenAI token..."
          }
        ),
        defaultValue: getDefault("openaiToken"),
        key: "openaiToken",
        label: "OpenAI token",
        showValue: false,
        value: store.openaiToken
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: store.apiBaseUrl,
            onSubmit: (v) => setConfig("apiBaseUrl", v),
            placeholder: "Set openAI API proxy, default value: https://api.openai.com/v1/..."
          }
        ),
        defaultValue: getDefault("apiBaseUrl"),
        desc: "OpenAI API proxy, default value: https://api.openai.com/v1/",
        key: "apiBaseUrl",
        label: "OpenAI API proxy",
        showValue: false,
        value: store.apiBaseUrl
      },
      {
        children: /* @__PURE__ */ jsx(
          TextInput,
          {
            defaultValue: store.githubToken,
            onSubmit: (v) => setConfig("githubToken", v),
            placeholder: "Input Github token..."
          }
        ),
        defaultValue: getDefault("githubToken"),
        key: "githubToken",
        label: "Github token",
        showValue: false,
        value: store.githubToken
      }
    ],
    [store]
  );
  return /* @__PURE__ */ jsx(
    ConfigPanel,
    {
      active,
      items,
      logo: "\u{1F92F}",
      setActive,
      title: "Garron Commit Config"
    }
  );
});

const HookCreate = memo(() => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  try {
    useEffect(() => {
      const hookFile = getAbsoluteHooksPath(HOOK.FILENAME);
      if (hookFile === ERROR_CODE)
        process__default.exit(1);
      fs.writeFileSync(hookFile, HOOK.CONTENTS, { mode: HOOK.PERMISSIONS });
      setLoading(false);
    }, []);
    if (loading)
      return /* @__PURE__ */ jsx(Spinner, { label: " Loading..." });
    return /* @__PURE__ */ jsxs(Alert, { variant: "success", children: [
      ` garron-commit hook `,
      /* @__PURE__ */ jsx(Text, { color: theme.colorSuccess, children: "created" }),
      ` successfully!`
    ] });
  } catch {
    return /* @__PURE__ */ jsx(Alert, { variant: "error", children: ` garron-commit commit hook is not created` });
  }
});

const HookRemove = memo(() => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  try {
    useEffect(() => {
      const hookFile = getAbsoluteHooksPath(HOOK.FILENAME);
      if (hookFile === ERROR_CODE)
        process__default.exit(1);
      fs.unlinkSync(hookFile);
      setLoading(false);
    }, []);
    if (loading)
      return /* @__PURE__ */ jsx(Spinner, { label: " Loading..." });
    return /* @__PURE__ */ jsxs(Alert, { variant: "success", children: [
      ` garron-commit hook `,
      /* @__PURE__ */ jsx(Text, { color: theme.colorError, children: "removed" }),
      ` successfully!`
    ] });
  } catch {
    return /* @__PURE__ */ jsx(Alert, { variant: "error", children: ` garron-commit commit hook is not found` });
  }
});

const notifier = updateNotifier({
  pkg: packageJson,
  shouldNotifyInNpmScript: true
});
notifier.notify({ isGlobal: true });
const program = new Command();
program.name("garron-commit").description(packageJson.description).version(packageJson.version).addOption(new Option("--hook", "\u4F7F\u7528\u63D0\u793A\u4EA4\u4E92\u63D0\u4EA4")).addOption(new Option("-a, --ai", "\u901A\u8FC7ChatGPT\u751F\u6210\u63D0\u793A")).addOption(new Option("-o, --option", "\u8BBE\u7F6Egarron-commit\u63D0\u4EA4\u9996\u9009\u9879")).addOption(new Option("-i, --init", "\u5C06garron-commit\u521D\u59CB\u5316\u4E3A\u63D0\u4EA4\u6302\u94A9")).addOption(new Option("-r, --remove", "\u5220\u9664\u4EE5\u524D\u521D\u59CB\u5316\u7684\u63D0\u4EA4\u6302\u94A9")).addOption(new Option("-l, --list", "\u5217\u51FA\u652F\u6301\u7684\u6240\u6709\u63D0\u4EA4\u7C7B\u578B")).parse();
const options = program.opts();
if (options.ai) {
  render(/* @__PURE__ */ jsx(Ai, {}));
} else if (options.option) {
  render(/* @__PURE__ */ jsx(Config, {}));
} else if (options.init) {
  render(/* @__PURE__ */ jsx(HookCreate, {}));
} else if (options.remove) {
  render(/* @__PURE__ */ jsx(HookRemove, {}));
} else if (options.list) {
  render(/* @__PURE__ */ jsx(List, {}));
} else if (options.hook) {
  render(/* @__PURE__ */ jsx(Commit, { hook: true }));
} else {
  render(/* @__PURE__ */ jsx(Commit, {}));
}
