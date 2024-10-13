# x-fetch

[![Version](https://img.shields.io/npm/v/@xiaohuohumax/x-fetch.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch)
[![License](https://img.shields.io/npm/l/@xiaohuohumax/x-fetch.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/xiaohuohumax/x-fetch/release-publish.yaml)](https://github.com/xiaohuohumax/x-fetch/actions/workflows/release-publish.yaml)

一个基于 fetch API 的简单、轻量级的 HTTP 请求库。

> [!NOTE]
> 此项目由 [octokit](https://github.com/octokit) [[MIT](https://github.com/xiaohuohumax/x-fetch/blob/main/licenses/octokit.js/LICENSE)] 项目修改而来，移除了对 Github API 相关的支持，只保留了通用的 fetch 功能。

## 📖 详细文档

[**详细文档**](./packages/x-fetch/README.md)

## 🚀 快速开始

**安装：**

```shell
npm install @xiaohuohumax/x-fetch
```

**使用：**

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch"

const xFetch = new XFetch({
  baseUrl: "https://api.github.com",
  params: {
    owner: "octokit",
    repo: "request.js",
  }
})

// 请求 Hook 示例
xFetch.request.hook.before("request", (options) => {
  console.log("before request", options)
})

// 方式一
xFetch.request({
  url: "/repos/{owner}/{repo}/issues{?page,per_page}",
  method: "GET",
  params: {
    page: 1,
    per_page: 1,
  }
}).then(console.log).catch(console.error)

// 方式二
xFetch.request("GET /repos/{owner}/{repo}/issues{?page,per_page}", {
  params: {
    page: 1,
    per_page: 1,
  }
}).then(console.log).catch(console.error)
```

## 📚 使用示例

+ [x-fetch vue-demo](./examples/vue/)
+ [x-fetch node-demo](./examples/node/)
+ [x-fetch 基本用法](./examples/x-fetch/)
+ [x-fetch 核心功能](./examples/x-fetch-core/)
+ [x-fetch endpoint](./examples/x-fetch-endpoint/)
+ [x-fetch request](./examples/x-fetch-request/)
+ [x-fetch 插件模板](./packages/plugins/plugin-template/)

## 📄 License

[MIT](LICENSE)

最后：玩的开心 🎉🎉🎉🎉
