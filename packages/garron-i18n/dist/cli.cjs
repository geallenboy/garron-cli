'use strict';

var jsxRuntime = require('react/jsx-runtime');
var cliUi = require('@garron/cli-ui');
var commander = require('commander');
var updateNotifier = require('update-notifier');
var Conf = require('conf');
var cosmiconfig = require('cosmiconfig');
var ui = require('@inkjs/ui');
var react = require('react');
var chalk = require('chalk');
var dotenv = require('dotenv');
var lodashEs = require('lodash-es');
var consola = require('consola');
var node_path = require('node:path');
var ink = require('ink');
var pMap = require('p-map');
var text_splitter = require('langchain/text_splitter');
var gptTokenizer = require('gpt-tokenizer');
var remarkFrontmatter = require('remark-frontmatter');
var remarkGfm = require('remark-gfm');
var remarkParse = require('remark-parse');
var remarkStringify = require('remark-stringify');
var unified = require('unified');
var unistUtilVisit = require('unist-util-visit');
var justDiff = require('just-diff');
var openai = require('@langchain/openai');
var prompts = require('@langchain/core/prompts');
var node_fs = require('node:fs');
var stringify = require('json-stable-stringify');
var glob = require('glob');
var process$1 = require('node:process');
var matter = require('gray-matter');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var process__namespace = /*#__PURE__*/_interopNamespaceDefault(process$1);

var name = "@garron/i18n-cli";
var version = "1.18.1";
var description = "garron i18n 是一款使用 ChatGPT 自动化 i18n 的 CLI 流程工具";
var keywords = [
	"ai",
	"i18n",
	"openai",
	"gpt",
	"langchain"
];
var homepage = "https://github.com/geallenboy/garron-cli/tree/master/packages/garron-i18n";
var bugs = {
	url: "https://github.com/geallenboy/garron-cli/issues/new"
};
var repository = {
	type: "git",
	url: "https://github.com/geallenboy/garron-cli.git"
};
var license = "MIT";
var author = "gejialun88@gmail.com";
var sideEffects = false;
var type = "module";
var imports = {
	"@": "./src"
};
var exports$1 = {
	require: {
		types: "./dist/index.d.cts",
		"default": "./dist/index.cjs"
	},
	"import": {
		types: "./dist/index.d.mts",
		"default": "./dist/index.mjs"
	}
};
var main = "./dist/index.cjs";
var module$1 = "./dist/index.mjs";
var types = "./dist/index.d.cts";
var bin = {
	"garron-i18n": "dist/cli.js"
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
	"@inkjs/ui": "^1",
	"@langchain/core": "latest",
	"@langchain/openai": "latest",
	"@garron/cli-ui": "latest",
	chalk: "^5",
	commander: "^11",
	conf: "^12",
	consola: "^3",
	cosmiconfig: "^9",
	dotenv: "^16",
	"fast-deep-equal": "^3",
	glob: "^10",
	"gpt-tokenizer": "^2",
	"gray-matter": "^4",
	ink: "^4.2",
	"json-stable-stringify": "^1",
	"just-diff": "^6",
	langchain: "latest",
	"lodash-es": "^4",
	"p-map": "^7",
	pangu: "^4",
	react: "^18",
	"remark-frontmatter": "^4",
	"remark-gfm": "^3",
	"remark-parse": "^10",
	"remark-stringify": "^10",
	swr: "^2",
	unified: "^11",
	"unist-util-visit": "^5",
	"update-notifier": "^7",
	zustand: "^4"
};
var devDependencies = {
	"@types/json-stable-stringify": "^1"
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
	sideEffects: sideEffects,
	type: type,
	imports: imports,
	exports: exports$1,
	main: main,
	module: module$1,
	types: types,
	bin: bin,
	files: files,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies,
	peerDependencies: peerDependencies,
	engines: engines,
	publishConfig: publishConfig
};

var MarkdownModeType = /* @__PURE__ */ ((MarkdownModeType2) => {
  MarkdownModeType2["MDAST"] = "mdast";
  MarkdownModeType2["STRING"] = "string";
  return MarkdownModeType2;
})(MarkdownModeType || {});

const getDefaultExtension = (locale) => `.${locale}.md`;

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

const DEFAULT_CONFIG = {
  concurrency: 5,
  markdown: {
    entry: [],
    mode: MarkdownModeType.STRING,
    outputExtensions: getDefaultExtension
  },
  modelName: defaultModel,
  temperature: 0
};

const checkOptionKeys = (opt, key) => {
  if (!opt[key]) {
    cliUi.alert.error(`Can't find ${chalk.bold.yellow("outputLocales")} in config`);
  }
};

const schema = {
  apiBaseUrl: {
    default: "",
    type: "string"
  },
  openaiToken: {
    default: "",
    type: "string"
  }
};
const config = new Conf({
  projectName: "lobe-i18n",
  schema
});
class ExplorerConfig {
  explorer;
  customConfig;
  constructor() {
    this.explorer = cosmiconfig.cosmiconfigSync("i18n");
  }
  loadCustomConfig(pathToConfig) {
    this.customConfig = pathToConfig;
  }
  getConfigFile() {
    if (this.customConfig)
      return this.explorer.load(this.customConfig)?.config;
    return this.explorer.search()?.config;
  }
}
const explorer = new ExplorerConfig();

dotenv.config();
const getConfig = (key) => config.get(key);
const getDefulatConfig = (key) => schema[key].default;
const setConfig = (key, value) => config.set(key, value);
const getOpenAIApiKey = () => process.env.OPENAI_API_KEY || getConfig("openaiToken");
const getOpenAIProxyUrl = () => process.env.OPENAI_PROXY_URL || getConfig("apiBaseUrl");
const getConfigFile = () => {
  const config2 = explorer.getConfigFile();
  if (!config2)
    return cliUi.alert.error(`Can't find ${chalk.bold.yellow("config")}`, true);
  return lodashEs.merge(DEFAULT_CONFIG, config2);
};
const getLocaleConfig = () => {
  const config2 = getConfigFile();
  checkOptionKeys(config2, "entry");
  checkOptionKeys(config2, "entryLocale");
  checkOptionKeys(config2, "output");
  checkOptionKeys(config2, "outputLocales");
  return config2;
};
const getMarkdownConfigFile = () => {
  const config2 = getConfigFile();
  if (!config2.markdown) {
    return cliUi.alert.error(`Can't find ${chalk.bold.yellow("config.markdown")}`, true);
  }
  const markdownConfig = lodashEs.merge(config2?.markdown || {}, {
    entryLocale: config2?.markdown?.entryLocale || config2.entryLocale,
    outputLocales: config2?.markdown?.outputLocales || config2.outputLocales
  });
  checkOptionKeys(markdownConfig, "entry");
  checkOptionKeys(markdownConfig, "entryLocale");
  checkOptionKeys(markdownConfig, "outputLocales");
  return markdownConfig;
};
var selectors = {
  getConfig,
  getConfigFile,
  getDefulatConfig,
  getLocaleConfig,
  getMarkdownConfigFile,
  getOpenAIApiKey,
  getOpenAIProxyUrl,
  setConfig
};

const useConfStore = () => {
  const store = config.store;
  return {
    get: selectors.getConfig,
    getDefault: selectors.getDefulatConfig,
    set: selectors.setConfig,
    store
  };
};

const Config = react.memo(() => {
  const [active, setActive] = react.useState();
  const { store, set, getDefault } = useConfStore();
  const setConfig = (key, value) => {
    set(key, value);
    setActive("");
  };
  const items = react.useMemo(
    () => [
      {
        children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
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
        children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
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
      }
    ],
    [store]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    cliUi.ConfigPanel,
    {
      active,
      items,
      logo: "\u{1F92F}",
      setActive,
      title: "Lobe I18N Config"
    }
  );
});

const Progress = react.memo(
  ({ hide, filename, to, from, progress, maxStep, step, isLoading, needToken }) => {
    const theme = cliUi.useTheme();
    if (hide)
      return null;
    return /* @__PURE__ */ jsxRuntime.jsxs(cliUi.SplitView, { flexDirection: "column", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ink.Text, { backgroundColor: theme.colorBgLayout, color: theme.colorText, children: ` \u{1F4DD} ${filename} ` }),
      /* @__PURE__ */ jsxRuntime.jsxs(ink.Text, { color: theme.colorTextDescription, children: [
        `- from `,
        /* @__PURE__ */ jsxRuntime.jsx(ink.Text, { bold: true, color: theme.colorInfo, children: from }),
        ` to `,
        /* @__PURE__ */ jsxRuntime.jsx(ink.Text, { bold: true, color: theme.colorInfo, children: to }),
        /* @__PURE__ */ jsxRuntime.jsx(ink.Text, { color: theme.colorTextDescription, children: ` [Tokens: ${needToken}]` })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntime.jsxs(ink.Box, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { label: ` ${progress}% [${step}/${maxStep} chunks] ` }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.ProgressBar, { value: progress })
      ] }) : /* @__PURE__ */ jsxRuntime.jsx(ui.StatusMessage, { variant: "success", children: "Success" })
    ] });
  }
);

const PRIMITIVE_EXTRA_TOKENS = 3;
const KEY_EXTRA_TOKENS = 2;
const OBJECT_EXTRA_TOKENS = 2;
const calcToken = (str) => {
  return gptTokenizer.encode(str).length;
};
const calcEncodedKeyToken = (key) => gptTokenizer.encode(String(key)).length;
const calcPrimitiveValueToken = (value) => calcEncodedKeyToken(value) + PRIMITIVE_EXTRA_TOKENS;
const calcJsonToken = (object, depth = 0) => lodashEs.sumBy(
  Object.entries(object),
  ([key, value]) => calcEncodedKeyToken(key) + KEY_EXTRA_TOKENS + (lodashEs.isPlainObject(value) ? calcJsonToken(value, depth + 1) : calcPrimitiveValueToken(value))
) + OBJECT_EXTRA_TOKENS + depth;

const IGNORE_LIST = /* @__PURE__ */ new Set([
  "\n",
  "\r\n",
  "[!NOTE]",
  "[!IMPORTANT]",
  "[!WARNING]",
  "[!CAUTION]",
  "\\[!NOTE]",
  "\\[!IMPORTANT]",
  "\\[!WARNING]",
  "\\[!CAUTION]",
  "\\[!NOTE]\\",
  "\\[!IMPORTANT]\\",
  "\\[!WARNING]\\",
  "\\[!CAUTION]\\"
]);
const checkMdString = (str) => {
  if (IGNORE_LIST.has(str))
    return true;
  let regex = /^[\s\p{P}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}]*$/u;
  return regex.test(str.replaceAll(" ", ""));
};

const convertMarkdownToMdast = async (md) => {
  return unified.unified().use(remarkParse).use(remarkGfm).use(remarkFrontmatter).parse(md.trim());
};
const convertMdastToMdastObj = (mdast, check) => {
  const obj = {};
  let index = 0;
  unistUtilVisit.visit(mdast, check || "text", (node) => {
    obj[index] = node.value;
    index++;
  });
  return obj;
};
const pickMdastObj = (entry) => {
  const obj = {};
  for (const [key, value] of Object.entries(entry)) {
    if (checkMdString(value))
      continue;
    obj[Number(key)] = value;
  }
  return obj;
};
const mergeMdastObj = ({ mdast, entry, target }, check) => {
  const merged = { ...entry, ...target };
  let index = 0;
  unistUtilVisit.visit(mdast, check || "text", (node) => {
    node.value = merged[index];
    index++;
  });
  return mdast;
};
const convertMdastToMarkdown = async (json) => {
  return unified.unified().use(remarkStringify, {
    bullet: "-",
    emphasis: "*",
    fences: true,
    listItemIndent: 1,
    rule: "-",
    strong: "*",
    tightDefinitions: true
  }).use(remarkFrontmatter).use(remarkGfm).stringify(json);
};

const diff = (entry, target) => {
  const diffResult = justDiff.diff(target, entry);
  const add = diffResult.filter((item) => item.op === "add");
  const remove = diffResult.filter((item) => item.op === "remove");
  const cloneTarget = lodashEs.cloneDeep(target);
  const extra = {};
  for (const item of remove) {
    lodashEs.unset(cloneTarget, item.path);
  }
  for (const item of add) {
    lodashEs.set(extra, item.path, item.value);
  }
  return {
    add,
    entry: extra,
    remove,
    target: cloneTarget
  };
};

const splitJSONtoSmallChunks = (object, splitToken) => lodashEs.reduce(
  Object.entries(object),
  (chunks, [key, value]) => {
    let [chunk, chunkSize] = chunks.pop() || [{}, OBJECT_EXTRA_TOKENS];
    const nextValueSize = lodashEs.isPlainObject(value) ? calcJsonToken(value, 1) : calcPrimitiveValueToken(value);
    if (chunkSize + calcEncodedKeyToken(key) + KEY_EXTRA_TOKENS + nextValueSize <= splitToken) {
      chunk[key] = value;
      chunkSize += calcEncodedKeyToken(key) + KEY_EXTRA_TOKENS + nextValueSize;
      chunks.push([chunk, chunkSize]);
    } else {
      chunks.push(
        [chunk, chunkSize],
        [{ [key]: value }, calcEncodedKeyToken(key) + KEY_EXTRA_TOKENS + nextValueSize]
      );
    }
    return chunks;
  },
  []
).map(([chunk]) => chunk);
const getSplitToken = (config, prompt) => {
  let splitToken = (ModelTokens[config.modelName || defaultModel] - calcToken(prompt)) / 3;
  if (config.splitToken && config.splitToken < splitToken) {
    splitToken = config.splitToken;
  }
  splitToken = Math.floor(splitToken);
  return splitToken;
};
const splitJsonToChunks = (config, entry, target, prompt) => {
  const extraJSON = diff(entry, target).entry;
  const splitToken = getSplitToken(config, prompt);
  const splitObj = splitJSONtoSmallChunks(extraJSON, splitToken);
  return splitObj;
};

let TranslateMarkdown$1 = class TranslateMarkdown {
  mdast;
  entry = {};
  config;
  check;
  definition;
  constructor(config) {
    this.config = config;
    this.check = ["text", "yaml", config?.markdown?.translateCode && "code"].filter(
      Boolean
    );
  }
  async genTarget(md) {
    this.mdast = await convertMarkdownToMdast(md);
    this.entry = convertMdastToMdastObj(this.mdast, this.check);
    return pickMdastObj(this.entry);
  }
  async genMarkdownByMdast(target) {
    if (!target)
      return;
    const translatedMdast = mergeMdastObj(
      { entry: this.entry, mdast: this.mdast, target },
      this.check
    );
    return convertMdastToMarkdown(translatedMdast);
  }
  async clearMarkdownString(md) {
    const definition = [];
    const mdast = await convertMarkdownToMdast(md);
    mdast.children = mdast.children.map((node) => {
      if (node.type === "definition") {
        definition.push(node);
        return false;
      }
      return node;
    }).filter(Boolean);
    return {
      content: await convertMdastToMarkdown(mdast),
      definition: await convertMdastToMarkdown({
        children: definition,
        type: "root"
      })
    };
  }
  async genSplitMarkdown(md, prompt) {
    this.definition = "";
    const { content, definition } = await this.clearMarkdownString(md);
    this.definition = definition;
    const textSplitter = text_splitter.RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkOverlap: 0,
      chunkSize: getSplitToken(this.config, prompt),
      lengthFunction: (text) => calcToken(text)
    });
    return await textSplitter.splitText(content);
  }
  async genMarkdownByString(translatedMarkdown) {
    return [...translatedMarkdown, this.definition].join("\n\n");
  }
};

const mergeJsonFromChunks = (arr) => {
  let result = {};
  for (const obj of arr) {
    result = lodashEs.merge(result, obj);
  }
  return result;
};

const DEFAULT_REFERENCE = "You can adjust the tone and style, taking into account the cultural connotations and regional differences of certain words. As a translator, you need to translate the original text into a translation that meets the standards of accuracy and elegance.";
const promptJsonTranslate = (reference = DEFAULT_REFERENCE) => {
  return prompts.ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        `Translate the i18n JSON file from {from} to {to} according to the BCP 47 standard`,
        `Here are some reference to help with better translation.  ---${reference}---`,
        `Keep the keys the same as the original file and make sure the output remains a valid i18n JSON file.`
      ].filter(Boolean).join("\n")
    ],
    ["human", "{json}"]
  ]);
};
const promptStringTranslate = (reference = DEFAULT_REFERENCE) => {
  return prompts.ChatPromptTemplate.fromMessages([
    [
      "system",
      [
        `Translate the markdown file from {from} to {to} according to the BCP 47 standard`,
        `Here are some reference to help with better translation.  ---${reference}---`,
        `Make sure the output remains a valid markdown file.`
      ].filter(Boolean).join("\n")
    ],
    ["human", "{text}"]
  ]);
};

let TranslateLocale$1 = class TranslateLocale {
  model;
  config;
  isJsonMode;
  promptJson;
  promptString;
  constructor(config, openAIApiKey, openAIProxyUrl) {
    this.config = config;
    this.model = new openai.ChatOpenAI({
      configuration: {
        baseURL: openAIProxyUrl
      },
      maxConcurrency: config.concurrency,
      maxRetries: 4,
      modelName: config.modelName,
      openAIApiKey,
      temperature: config.temperature
    });
    this.promptJson = promptJsonTranslate(config.reference);
    this.promptString = promptStringTranslate(config.reference);
    this.isJsonMode = Boolean(this.config?.experimental?.jsonMode);
  }
  async runByString({
    from,
    to,
    text
  }) {
    try {
      const formattedChatPrompt = await this.promptString.formatMessages({
        from: from || this.config.entryLocale,
        text,
        to
      });
      const res = await this.model.call(formattedChatPrompt);
      const result = res["text"];
      if (!result)
        this.handleError();
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }
  async runByJson({
    from,
    to,
    json
  }) {
    try {
      const formattedChatPrompt = await this.promptJson.formatMessages({
        from: from || this.config.entryLocale,
        json: JSON.stringify(json),
        to
      });
      const res = await this.model.call(
        formattedChatPrompt,
        this.isJsonMode ? {
          response_format: { type: "json_object" }
        } : void 0
      );
      const result = this.isJsonMode ? res["content"] : res["text"];
      if (!result)
        this.handleError();
      const message = JSON.parse(result);
      return message;
    } catch (error) {
      this.handleError(error);
    }
  }
  handleError(error) {
    cliUi.alert.error(`Translate failed, ${error || "please check your network or try again..."}`, true);
  }
};

class I18n {
  config;
  step = 0;
  maxStep = 1;
  translateLocaleService;
  translateMarkdownService;
  constructor({ openAIApiKey, openAIProxyUrl, config }) {
    this.config = config;
    this.translateLocaleService = new TranslateLocale$1(config, openAIApiKey, openAIProxyUrl);
    this.translateMarkdownService = new TranslateMarkdown$1(config);
  }
  async translateMarkdown(options) {
    return options.mode === MarkdownModeType.STRING ? this.translateMarkdownByString(options) : this.translateMarkdownByMdast(options);
  }
  async translateMarkdownByString({
    md,
    to,
    onProgress,
    from
  }) {
    const prompt = await this.translateLocaleService.promptString.formatMessages({
      from,
      text: "",
      to
    });
    const splitString = await this.translateMarkdownService.genSplitMarkdown(
      md,
      JSON.stringify(prompt)
    );
    this.maxStep = splitString.length;
    this.step = 0;
    if (splitString.length === 0)
      return;
    const needToken = splitString.length * calcToken(JSON.stringify(prompt)) + calcToken(JSON.stringify(splitString));
    onProgress?.({
      isLoading: true,
      maxStep: this.maxStep,
      needToken,
      progress: 0,
      step: 0
    });
    const translatedSplitString = await pMap(
      splitString,
      async (text) => {
        onProgress?.({
          isLoading: this.step < this.maxStep,
          maxStep: this.maxStep,
          needToken,
          progress: this.step < this.maxStep ? Math.floor(this.step / this.maxStep * 100) : 100,
          step: this.step
        });
        const result2 = await this.translateLocaleService.runByString({
          from,
          text,
          to
        });
        if (this.step < this.maxStep)
          this.step++;
        return result2;
      },
      { concurrency: this.config?.concurrency }
    );
    onProgress?.({
      isLoading: false,
      maxStep: this.maxStep,
      needToken,
      progress: 100,
      step: this.maxStep
    });
    const result = await this.translateMarkdownService.genMarkdownByString(translatedSplitString);
    return {
      result,
      tokenUsage: needToken + calcToken(JSON.stringify(translatedSplitString))
    };
  }
  async translateMarkdownByMdast({ md, ...rest }) {
    const target = await this.translateMarkdownService.genTarget(md);
    const translatedTarget = await this.translate({
      ...rest,
      entry: target,
      target: {}
    });
    if (!translatedTarget?.result)
      return;
    const result = await this.translateMarkdownService.genMarkdownByMdast(translatedTarget);
    if (!result)
      return;
    return {
      result,
      tokenUsage: translatedTarget.tokenUsage
    };
  }
  async translate({ entry, target, to, onProgress, from }) {
    const prompt = await this.translateLocaleService.promptJson.formatMessages({
      from,
      json: {},
      to
    });
    const splitJson = splitJsonToChunks(this.config, entry, target, JSON.stringify(prompt));
    this.maxStep = splitJson.length;
    this.step = 0;
    if (splitJson.length === 0)
      return;
    const needToken = splitJson.length * calcToken(JSON.stringify(prompt)) + calcToken(JSON.stringify(splitJson));
    onProgress?.({
      isLoading: true,
      maxStep: this.maxStep,
      needToken,
      progress: 0,
      step: 0
    });
    const translatedSplitJson = await pMap(
      splitJson,
      async (json) => {
        onProgress?.({
          isLoading: this.step < this.maxStep,
          maxStep: this.maxStep,
          needToken,
          progress: this.step < this.maxStep ? Math.floor(this.step / this.maxStep * 100) : 100,
          step: this.step
        });
        const result2 = await this.translateLocaleService.runByJson({
          from,
          json,
          to
        });
        if (this.step < this.maxStep)
          this.step++;
        return result2;
      },
      { concurrency: this.config?.concurrency }
    );
    onProgress?.({
      isLoading: false,
      maxStep: this.maxStep,
      needToken,
      progress: 100,
      step: this.maxStep
    });
    const result = await lodashEs.merge(target, mergeJsonFromChunks(translatedSplitJson));
    return {
      result,
      tokenUsage: needToken + calcToken(JSON.stringify(translatedSplitJson))
    };
  }
}

const readJSON = (filePath) => {
  const data = node_fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};
const writeJSON = (filePath, data) => {
  const jsonStr = stringify(data, { space: "  " });
  node_fs.writeFileSync(filePath, jsonStr, "utf8");
};
const readMarkdown = (filePath) => {
  return node_fs.readFileSync(filePath, "utf8");
};
const writeMarkdown = (filePath, data) => {
  node_fs.writeFileSync(filePath, data, "utf8");
};

const checkLocales = (config) => {
  for (const filename of config.outputLocales) {
    const filePath = node_path.resolve(config.output, `${filename}.json`);
    if (!node_fs.existsSync(filePath)) {
      writeJSON(filePath, {});
    }
  }
};
const checkLocaleFolders = (config, filenames) => {
  for (const locale of config.outputLocales) {
    const folderPath = node_path.resolve(config.output, locale);
    if (!node_fs.existsSync(folderPath)) {
      node_fs.mkdirSync(folderPath);
    }
  }
  for (const locale of config.outputLocales) {
    for (const filename of filenames) {
      const filePath = node_path.resolve(config.output, locale, filename);
      try {
        const dirPath = node_path.dirname(filePath);
        node_fs.mkdirSync(dirPath, { recursive: true });
      } catch {
      }
      if (!node_fs.existsSync(filePath)) {
        writeJSON(filePath, {});
      }
    }
  }
};

const getEntryFile = (config) => {
  try {
    const entryPath = node_path.resolve("./", config.entry);
    const isExist = node_fs.existsSync(entryPath);
    if (!isExist) {
      cliUi.alert.error(`Can't find ${chalk.bold.yellow(config.entry)} in dir`, true);
    }
    const entry = readJSON(entryPath);
    return entry;
  } catch {
    process__namespace.exit(1);
  }
};
const getEntryFolderFiles = (config) => {
  const entryPath = config.entry.replaceAll("*", "").replaceAll("*.json", "");
  const files = glob.globSync(node_path.join(entryPath, "**/*.json").replaceAll("\\", "/"), { nodir: true });
  const obj = {};
  for (const file of files) {
    obj[node_path.relative(entryPath, file)] = readJSON(file);
  }
  if (Object.keys(obj).length === 0) {
    cliUi.alert.error(`Can't find .json files in ${chalk.bold.yellow(entryPath)}`, true);
    return;
  }
  return obj;
};

const getLocaleObj = (filename) => {
  const file = readJSON(filename);
  if (!file) {
    writeJSON(filename, {});
    return {};
  }
  return file;
};

const isEqualJsonKeys = (obj1, obj2) => {
  try {
    if (obj1 === obj2)
      return true;
    if (typeof obj1 !== typeof obj2)
      return false;
    if (typeof obj1 === "object" && typeof obj2 === "object") {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length)
        return false;
      for (const key of keys1) {
        if (!keys2.includes(key) || !isEqualJsonKeys(obj1[key], obj2[key])) {
          return false;
        }
      }
    }
    return typeof obj1 === typeof obj2;
  } catch {
    return false;
  }
};

class TranslateLocale {
  config;
  query = [];
  i18n;
  constructor() {
    this.config = selectors.getLocaleConfig();
    this.i18n = new I18n({
      config: this.config,
      openAIApiKey: selectors.getOpenAIApiKey(),
      openAIProxyUrl: selectors.getOpenAIProxyUrl()
    });
  }
  async start() {
    consola.consola.start("Lobe I18N is analyzing your project... \u{1F92F}\u{1F30F}\u{1F50D}");
    const isFolder = !this.config.entry.includes(".json") || this.config.entry.includes("*");
    if (isFolder) {
      this.genFolderQuery();
    } else {
      this.genFlatQuery();
    }
    if (this.query.length > 0) {
      await this.runQuery();
    } else {
      consola.consola.success("No content requiring translation was found.");
    }
    consola.consola.success("All i18n tasks have been completed\uFF01");
  }
  async runQuery() {
    consola.consola.info(
      `Current model setting: ${chalk.cyan(this.config.modelName)} (temperature: ${chalk.cyan(
        this.config.temperature
      )}) ${this.config.experimental?.jsonMode ? chalk.red(" [JSON Mode]") : ""}}`
    );
    let totalTokenUsage = 0;
    for (const item of this.query) {
      const props = {
        filename: item.filename,
        from: item.from || this.config.entryLocale,
        to: item.to
      };
      const { rerender, clear } = cliUi.render(
        /* @__PURE__ */ jsxRuntime.jsx(Progress, { hide: true, isLoading: true, maxStep: 1, progress: 0, step: 0, ...props })
      );
      const data = await this.i18n.translate({
        ...item,
        onProgress: (rest) => {
          if (rest.maxStep > 0) {
            rerender(/* @__PURE__ */ jsxRuntime.jsx(Progress, { ...rest, ...props }));
          } else {
            clear();
          }
        }
      });
      clear();
      const outputPath = node_path.relative(".", item.filename);
      if (data?.result && Object.keys(data.result).length > 0) {
        writeJSON(item.filename, data.result);
        totalTokenUsage += data.tokenUsage;
        consola.consola.success(chalk.yellow(outputPath), chalk.gray(`[Token usage: ${data.tokenUsage}]`));
      } else {
        consola.consola.warn("No translation result was found:", chalk.yellow(outputPath));
      }
    }
    if (totalTokenUsage > 0)
      consola.consola.info("Total token usage:", chalk.cyan(totalTokenUsage));
  }
  genFolderQuery() {
    const config = this.config;
    const entry = getEntryFolderFiles(config);
    const files = Object.keys(entry);
    consola.consola.info(
      `Running in ${chalk.bold.cyan("\u{1F4C2} Folder Mode")} and has found ${chalk.bold.cyan(
        files.length
      )} files.`
    );
    checkLocaleFolders(config, files);
    for (const locale of config.outputLocales) {
      for (const filename of files) {
        consola.consola.info(`${chalk.cyan(locale)}${chalk.gray(" - ")}${chalk.yellow(filename)}`);
        const targetFilename = node_path.resolve(config.output, locale, filename);
        const entryObj = entry[filename];
        const targetObj = diff(entryObj, getLocaleObj(targetFilename)).target;
        writeJSON(targetFilename, targetObj);
        if (isEqualJsonKeys(entryObj, targetObj))
          continue;
        this.query.push({
          entry: entryObj,
          filename: targetFilename,
          from: config.entryLocale,
          target: targetObj,
          to: locale
        });
      }
    }
  }
  genFlatQuery() {
    const config = this.config;
    const entry = getEntryFile(config);
    consola.consola.start(
      `Running in ${chalk.bold.cyan("\u{1F4C4} Flat Mode")}, and translating ${chalk.bold.cyan(
        config.outputLocales.join("/")
      )} locales..`
    );
    checkLocales(config);
    for (const locale of config.outputLocales) {
      const targetFilename = node_path.resolve(config.output, locale) + ".json";
      const entryObj = entry;
      const targetObj = diff(entryObj, getLocaleObj(targetFilename)).target;
      writeJSON(targetFilename, targetObj);
      if (isEqualJsonKeys(entryObj, targetObj))
        continue;
      this.query.push({
        entry: entryObj,
        filename: targetFilename,
        from: config.entryLocale,
        target: targetObj,
        to: locale
      });
    }
  }
}

const matchInputPattern = (filepaths, extention) => {
  return filepaths.map((filepath) => {
    if (filepath.includes("*") || filepath.includes(extention))
      return filepath;
    return node_path.join(filepath, `**/*${extention}`).replaceAll("\\", "/");
  });
};

class TranslateMarkdown {
  config;
  markdownConfig;
  query = [];
  i18n;
  constructor() {
    this.markdownConfig = selectors.getMarkdownConfigFile();
    const defaultConfig = selectors.getConfigFile();
    this.config = {
      ...defaultConfig,
      entryLocale: defaultConfig.entryLocale || this.markdownConfig.entryLocale,
      markdown: this.markdownConfig,
      outputLocales: defaultConfig.outputLocales || this.markdownConfig.outputLocales
    };
    this.i18n = new I18n({
      config: this.config,
      openAIApiKey: selectors.getOpenAIApiKey(),
      openAIProxyUrl: selectors.getOpenAIProxyUrl()
    });
  }
  async start() {
    consola.consola.start("Lobe I18N is analyzing your markdown... \u{1F92F}\u{1F30F}\u{1F50D}");
    const entry = this.markdownConfig.entry;
    if (!entry || entry.length === 0)
      cliUi.alert.error("No markdown entry was found.", true);
    let files = glob.globSync(matchInputPattern(entry, ".md"), {
      ignore: this.markdownConfig.exclude ? matchInputPattern(this.markdownConfig.exclude || [], ".md") : void 0,
      nodir: true
    });
    if (this.markdownConfig.entryExtension)
      files = files.filter((file) => file.includes(this.markdownConfig.entryExtension || ".md"));
    if (!files || files.length === 0)
      cliUi.alert.error("No markdown entry was found.", true);
    this.genFilesQuery(files);
    if (this.query.length > 0) {
      await this.runQuery();
    } else {
      consola.consola.success("No content requiring translation was found.");
    }
    consola.consola.success("All i18n tasks have been completed\uFF01");
  }
  async runQuery() {
    consola.consola.info(
      `Current model setting: ${chalk.cyan(this.config.modelName)} (temperature: ${chalk.cyan(
        this.config.temperature
      )}) ${this.config.experimental?.jsonMode ? chalk.red(" [JSON Mode]") : ""}}`
    );
    let totalTokenUsage = 0;
    for (const item of this.query) {
      const props = {
        filename: item.filename,
        from: item.from || this.markdownConfig.entryLocale || this.config.entryLocale,
        to: item.to
      };
      const { rerender, clear } = cliUi.render(
        /* @__PURE__ */ jsxRuntime.jsx(Progress, { hide: true, isLoading: true, maxStep: 1, progress: 0, step: 0, ...props })
      );
      const data = await this.i18n.translateMarkdown({
        ...item,
        onProgress: (rest) => {
          if (rest.maxStep > 0) {
            rerender(/* @__PURE__ */ jsxRuntime.jsx(Progress, { ...rest, ...props }));
          } else {
            clear();
          }
        }
      });
      clear();
      const outputPath = node_path.relative(".", item.filename);
      if (data?.result && Object.keys(data.result).length > 0) {
        let mdResut = data.result;
        if (!this.markdownConfig.includeMatter) {
          mdResut = matter.stringify(data.result, item.matter);
        }
        writeMarkdown(item.filename, mdResut);
        totalTokenUsage += data.tokenUsage;
        consola.consola.success(chalk.yellow(outputPath), chalk.gray(`[Token usage: ${data.tokenUsage}]`));
      } else {
        consola.consola.warn("No translation result was found:", chalk.yellow(outputPath));
      }
    }
    if (totalTokenUsage > 0)
      consola.consola.info("Total token usage:", chalk.cyan(totalTokenUsage));
  }
  genFilesQuery(files, skipLog) {
    const config = this.markdownConfig;
    if (!skipLog)
      consola.consola.start(
        `Running in ${chalk.bold.cyan(
          `\u{1F4C4} ${files.length} Markdown`
        )}, and translating to ${chalk.bold.cyan(config?.outputLocales?.join("/"))} locales..`
      );
    for (const file of files) {
      try {
        const md = readMarkdown(file);
        for (const locale of config.outputLocales || []) {
          const targetExtension = this.getTargetExtension(locale, file, md);
          const targetFilename = this.getTargetFilename(file, targetExtension);
          if (node_fs.existsSync(targetFilename))
            continue;
          const mode = this.getMode(file, md);
          const { data, content } = matter(md);
          consola.consola.info(`\u{1F4C4} To ${locale}: ${chalk.yellow(targetFilename)}`);
          this.query.push({
            filename: targetFilename,
            from: config.entryLocale,
            matter: data,
            md: this.markdownConfig.includeMatter ? md : content,
            mode,
            to: locale
          });
        }
      } catch {
        cliUi.alert.error(`${file} not found`, true);
      }
    }
  }
  getTargetExtension(locale, filePath, fileContent) {
    return this.markdownConfig.outputExtensions?.(locale, {
      fileContent,
      filePath,
      getDefaultExtension
    }) || getDefaultExtension(locale);
  }
  getTargetFilename(filePath, targetExtension) {
    if (this.markdownConfig.entryExtension) {
      return node_path.resolve(
        ".",
        filePath.replace(this.markdownConfig.entryExtension || ".md", targetExtension)
      );
    } else {
      if (this.markdownConfig.entryLocale && filePath.includes(`.${this.markdownConfig.entryLocale}.`)) {
        const filePaths = filePath.split(`.${this.markdownConfig.entryLocale}.`);
        return [filePaths[0], targetExtension].join("");
      } else {
        const filePaths = filePath.split(".");
        filePaths.pop();
        return [filePaths.join("."), targetExtension].join("");
      }
    }
  }
  getMode(filePath, fileContent) {
    const modeConfig = this.markdownConfig.mode;
    if (!modeConfig)
      return MarkdownModeType.STRING;
    return lodashEs.isString(modeConfig) ? modeConfig : modeConfig({ fileContent, filePath }) || MarkdownModeType.STRING;
  }
}

const notifier = updateNotifier({
  pkg: packageJson,
  shouldNotifyInNpmScript: true
});
notifier.notify({ isGlobal: true });
const program = new commander.Command();
program.name("lobe-i18n").description(packageJson.description).version(packageJson.version).addOption(new commander.Option("-o, --option", "Setup lobe-i18n preferences")).addOption(new commander.Option("-c, --config <string>", "Specify the configuration file")).addOption(
  new commander.Option("-m, --with-md", "Run i18n translation and markdown translation simultaneously")
);
program.command("locale", { isDefault: true }).action(async () => {
  const options = program.opts();
  if (options.option) {
    cliUi.render(/* @__PURE__ */ jsxRuntime.jsx(Config, {}));
  } else {
    if (options.config)
      explorer.loadCustomConfig(options.config);
    await new TranslateLocale().start();
    if (options.withMd)
      await new TranslateMarkdown().start();
  }
});
program.command("md").action(async () => {
  const options = program.opts();
  if (options.config)
    explorer.loadCustomConfig(options.config);
  await new TranslateMarkdown().start();
});
program.parse();
