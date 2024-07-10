declare enum LanguageModel {
    /**
     * GPT 3.5 Turbo
     */
    GPT3_5 = "gpt-3.5-turbo",
    GPT3_5_0125 = "gpt-3.5-turbo-0125",
    GPT3_5_1106 = "gpt-3.5-turbo-1106",
    GPT3_5_16K = "gpt-3.5-turbo-16k",
    /**
     * GPT 4
     */
    GPT4 = "gpt-4",
    GPT4_0125_PREVIEW = "gpt-4-0125-preview",
    GPT4_32K = "gpt-4-32k",
    GPT4_PREVIEW = "gpt-4-1106-preview",
    GPT4_VISION_PREVIEW = "gpt-4-vision-preview"
}

interface I18nConfigLocale {
    /**
     * @description Number of concurrently pending promises returned
     */
    concurrency?: number;
    /**
     * @description The entry file or folder
     */
    entry: string;
    /**
     * @description The language that will use as translation ref
     */
    entryLocale: string;
    /**
     * @description ChatGPT model name to use
     */
    modelName?: LanguageModel;
    /**
     * @description Where you store your locale files
     */
    output: string;
    /**
     * @description All languages that need to be translated
     */
    outputLocales: string[];
    /**
     * @description Provide some context for a more accurate translation
     */
    reference?: string;
    /**
     * @description Split locale JSON by token
     */
    splitToken?: number;
    /**
     * @description Sampling temperature to use
     */
    temperature?: number;
}
declare enum MarkdownModeType {
    MDAST = "mdast",
    STRING = "string"
}
type MarkdownMode = MarkdownModeType;
type MarkdownModeFunction = (config: {
    fileContent: string;
    filePath: string;
}) => MarkdownModeType;
interface MarkdownConfig {
    /**
     * @description The entry file or folder, support glob
     */
    entry: string[];
    /**
     * @description Markdown extension
     */
    entryExtension?: string;
    /**
     * @description The language that will use as translation ref
     */
    entryLocale?: string;
    /**
     * @description The markdown that will ignore, support glob
     */
    exclude?: string[];
    /**
     * @description Whether to include matter in the translation
     */
    includeMatter?: boolean;
    /**
     * @description Markdown translate mode
     */
    mode?: MarkdownMode | MarkdownModeFunction;
    /**
     * @description Markdown extension generator function
     */
    outputExtensions?: (locale: string, config: {
        fileContent: string;
        filePath: string;
        getDefaultExtension: (locale: string) => string;
    }) => string;
    /**
     * @description All languages that need to be translated
     */
    outputLocales?: string[];
    /**
     * @description In Mdast mode, whether to translate code block
     */
    translateCode?: boolean;
}
interface I18nConfig extends I18nConfigLocale {
    experimental?: {
        jsonMode?: boolean;
    };
    markdown?: MarkdownConfig;
}

type Config = I18nConfig;
declare const defineConfig: (config: Partial<Config>) => Config;

export { type Config, defineConfig };
