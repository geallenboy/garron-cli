<div align="center"><a name="readme-top"></a>


<h1>Garron CLI </h1>

Garron CLI 提供了一种将添加到目标文件的简单方法

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

<details>
<summary><kbd>目录</kbd></summary>

#### TOC

- [安装](#-安装)
- [使用](#-使用)
  - [Custom Shebang](#custom-garron)
- [⌨️ 本地开发](#️-local-development)


####

</details>

## 安装

To install garron, run the following command:

```bash
npm install -g @garron/garron-cli
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 使用

Add `#!/usr/bin/env node` to target file

```shell
$ garron-cli -t ./dist/cli.js
# or
$ cli -t ./dist/cli.js
```

### Custom garron

```
$ garron -t ./dist/cli.js -s "#!/usr/bin/env bun"
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ 本地开发


```bash
$ git clone https://github.com/geallenboy/garron-toolbox.git
$ cd garron-toolbox
$ bun install
$ cd packages/geallenboy-cli
$ bun dev
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>





### Credits

- **ink** - <https://github.com/vadimdemedes/ink>

---

#### 📝 License

Copyright © 2024 [Garron][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

