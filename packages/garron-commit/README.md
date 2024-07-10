<div align="center"><a name="readme-top"></a>

<h1>garron Commit</h1>

使用 GPT 生成基于 Gitmoji 的 CLick 提交工具

</div>
##  特性

- [x] 🤯 支持使用 ChatGPT 根据 git diffs 自动生成提交信息
- [x] 🛠️ 流畅的提交信息编辑流程
- [x] 😜 支持添加 Gitmoji
- [x] 📝 支持 Conventional Commits 规范
- [x] ⚡️ 支持拉取 issues 列表并便捷绑定
- [x] 💄 支持自定义 Prompt
- [x] 🗺️ 支持多语言提交信息

## 安装

```bash
npm install -g @garron/commit-cli
```

## 使用

使用 `garron-commit` 命令为暂生成提交信息信息：

```shell
$ git add <files...>
$ garron-commit
```

## 本地运行

```bash
$ git clone https://github.com/geallenboy/garron-cli.git
$ cd garron-cli
$ pnpm install
$ cd packages/garron-i18n
$ pnpm dev
```
