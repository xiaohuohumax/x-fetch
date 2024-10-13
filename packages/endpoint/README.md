# x-fetch-endpoint

[![Version](https://img.shields.io/npm/v/@xiaohuohumax/x-fetch-endpoint.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch-endpoint)
[![License](https://img.shields.io/npm/l/@xiaohuohumax/x-fetch-endpoint.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch-endpoint)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/xiaohuohumax/x-fetch/release-publish.yaml)](https://github.com/xiaohuohumax/x-fetch/actions/workflows/release-publish.yaml)

一个简单、轻量级 HTTP 请求参数处理工具。

> [!NOTE]
> 此项目由 [octokit - endpoint.js](https://github.com/octokit/endpoint.js) [[MIT](https://github.com/xiaohuohumax/x-fetch/blob/main/licenses/octokit.js/LICENSE)] 项目修改而来。

## 🚀 快速开始

**安装：**

```shell
npm install @xiaohuohumax/x-fetch-endpoint
```

**使用：**

```typescript
// ESM / Typescript
import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"
// or

// CommonJS
const { endpoint } = require("@xiaohuohumax/x-fetch-endpoint")
```

## 📖 基本用法

```typescript
import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"

const e = endpoint({
  baseUrl: "https://example.com/api",
  method: "POST",
  url: "/users",
  headers: {
    "user-agent": "x-fetch"
  },
  body: {
    name: "xiaohuohumax"
  }
})

console.log(e)
// {
//   method: 'POST',
//   url: 'https://example.com/api/users',
//   headers: { 'user-agent': 'x-fetch' },
//   body: { name: 'xiaohuohumax' }
// }

const e2 = endpoint("GET /users", {
  baseUrl: "https://example.com/api",
  headers: {
    "user-agent": "x-fetch"
  },
  params: {
    name: "xiaohuohumax"
  }
})

console.log(e2)
// {
//   method: 'GET',
//   url: 'https://example.com/api/users?name=xiaohuohumax',
//   headers: { 'user-agent': 'x-fetch' }
// }
```

## 🔗 URI模板

> [!NOTE]
> URI 模板规则参考 [RFC 6570](https://datatracker.ietf.org/doc/html/rfc6570) 规则。

```typescript
import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"

// 用户设置模板规则
// owner, repo => {owner}, {repo}
// page, per_page => {?page,per_page}
const e1 = endpoint("GET /repos/{owner}/{repo}/issues{?page,per_page}", {
  params: {
    owner: "octokit",
    repo: "request.js",
    page: 1,
    per_page: 1,
  }
})
console.log(e1.url) // /repos/octokit/request.js/issues?page=1&per_page=1

// 用户未设置模板规则，那么额外的参数会使用默认规则
// 规则如下：
// 数组：hobby => {hobby*} => hobby=1&hobby=2&hobby=3
// 非数组：name => {name} => name=value
const e2 = endpoint("GET /users", {
  params: {
    hobby: [1, 2, 3],
  }
})
console.log(e2.url) // /users?hobby=1&hobby=2&hobby=3

// 其他扩展规则
// 自动将路径中的 :id 格式转换为 {id}格式
const e3 = endpoint("GET /users/:id", {
  params: {
    id: 123,
  }
})
console.log(e3.url) // /users/123
```

## 📚 带有默认值的 endpoint 实例

```typescript
import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"

const newEndpoint = endpoint.defaults({
  baseUrl: "https://example.com",
  headers: {
    "user-agent": "x-fetch"
  },
})

const e = newEndpoint({
  url: "/api/test",
  method: "GET",
})

console.log(e)
// {
//   method: 'GET',
//   url: 'https://example.com/api/test',
//   headers: { 'user-agent': 'x-fetch' }
// }
```

## 📄 License

[MIT](LICENSE)

最后：玩的开心 🎉🎉🎉🎉
