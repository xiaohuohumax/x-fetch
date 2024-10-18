# x-fetch-core

[![Version](https://img.shields.io/npm/v/@xiaohuohumax/x-fetch-core.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch-core)
[![License](https://img.shields.io/npm/l/@xiaohuohumax/x-fetch-core.svg?sanitize=true)](https://www.npmjs.com/package/@xiaohuohumax/x-fetch-core)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/xiaohuohumax/x-fetch/release-publish.yaml)](https://github.com/xiaohuohumax/x-fetch/actions/workflows/release-publish.yaml)

一个基于 fetch API 的简单、轻量级的 HTTP 请求库。

> [!NOTE]
> 此项目由 [octokit - core.js](https://github.com/octokit/core.js) [[MIT](https://github.com/xiaohuohumax/x-fetch/blob/main/licenses/octokit.js/LICENSE)] 项目修改而来，移除了对 Github API 相关的支持, 只保留了通用的 fetch 功能。

## 🚀 快速开始

**安装：**

```shell
npm install @xiaohuohumax/x-fetch
```

**使用：**

```typescript
// ESM / Typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"
// or

// CommonJS
const { XFetch } = require("@xiaohuohumax/x-fetch-core")
```

## 📖 基本用法

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

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

// 方法一
xFetch.request({
  url: "/repos/{owner}/{repo}/issues{?page,per_page}",
  method: "GET",
  params: {
    page: 1,
    per_page: 1,
  }
}).then(console.log).catch(console.error)

// 方法二
xFetch.request("GET /repos/{owner}/{repo}/issues{?page,per_page}", {
  params: {
    page: 1,
    per_page: 1,
  }
}).then(console.log).catch(console.error)
```

<!-- 特点 -->

## ✅ 异步支持

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

const xFetch = new XFetch({/* options */})

// 异步 Promise
xFetch.request({/* options */})
  .then(console.log)
  .catch(console.error)

// 同步 await
const response = await xFetch.request({/* options */})
console.log(response)
```

## ✅ Node.js

```javascript
const { XFetch } = require("@xiaohuohumax/x-fetch-core")

const xFetch = new XFetch({
  baseUrl: "https://example.com",
})

xFetch.request("/api/users")
  .then(console.log)
  .catch(console.error)
```

<!-- 请求前 -->

## ✅ 请求头

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

const xFetch = new XFetch({
  /* XFetch options */
  headers: {
    // 全局请求头
  }
})

// 方式一：简单对象 key-value
xFetch.request({
  /* request options */
  headers: {
    // 局部请求头
  }
}).then(console.log).catch(console.error)

// 或者
// 方式二：Headers 对象
const headers = new Headers()
xFetch.request({
  /* request options */
  // 使用 Headers 对象
  headers
}).then(console.log).catch(console.error)
```

## ✅ URI模板

> [!NOTE]
> URI 模板规则参考 [RFC 6570](https://datatracker.ietf.org/doc/html/rfc6570) 规则。

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

const xFetch = new XFetch({/* options */})

// 用户设置模板规则
// owner, repo => {owner}, {repo}
// page, per_page => {?page,per_page}
// 结果如下：
// GET /repos/octokit/request.js/issues?page=1&per_page=1
xFetch.request("GET /repos/{owner}/{repo}/issues{?page,per_page}", {
  params: {
    owner: "octokit",
    repo: "request.js",
    page: 1,
    per_page: 1,
  }
}).then(console.log).catch(console.error)

// 用户未设置模板规则，那么额外的参数会使用默认规则
// 规则如下：
// 1. 数组：hobby => {hobby*} => hobby=1&hobby=2&hobby=3
// 2. 非数组：name => {name} => name=value
// 结果如下：
// GET /users?hobby=1&hobby=2&hobby=3
xFetch.request("GET /users", {
  params: {
    hobby: [1, 2, 3],
  }
}).then(console.log).catch(console.error)

// 其他扩展规则
// 自动将路径中的 :id 格式转换为 {id}格式
// 结果如下：
// GET /users/123
xFetch.request("GET /users/:id", {
  params: {
    id: 123,
  }
}).then(console.log).catch(console.error)
```

## ✅ 中断请求

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

const abortController = new AbortController()
const xFetch = new XFetch({
  /* XFetch options */
  request: {
    signal: abortController.signal,
  }
})

setTimeout(() => abortController.abort(), 10)

xFetch.request(/* Request options */)
  .then(console.log)
  .catch(console.error) // AbortError
```

## ✅ 钩子方法

目前支持的钩子有：

- `request` 请求钩子：通过 fetch API 发送请求
- `parse-options` 处理请求参数钩子：将请求参数处理成功 fetch API 所需参数
- `parse-error` 处理请求错误钩子：将 fetch API 错误处理成自定义错误
- `parse-response` 处理响应数据钩子：将 fetch API 响应数据处理成自定义数据

**大致流程如下：**

```typescript
// `request`
function request(options: RequestOptions): Promise<XFetchResponse<any>> {
  // `parse-options`
  const fetchOptions = await parseOptions(options)
  let fetchResponse: Response
  try {
    fetchResponse = await fetch(options.url, fetchOptions)
  }
  catch (error) {
    // `parse-error`
    throw await parseError({ error, options })
  }
  // `parse-response`
  return await parseResponse({ fetchResponse, options })
}
```

> [!NOTE]
> 每个钩子都有 `before`、`after`、`error`、`wrap` 四个阶段，分别对应前、后、错误、包装阶段。

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"

const xFetch = new XFetch({/* XFetch options */})

// before
xFetch.request.hook.before("request", (options) => {
  console.log("before request", options)
})

// after
xFetch.request.hook.after("request", (response) => {
  console.log("after request", response)
})

// error
xFetch.request.hook.error("request", (error) => {
  console.log("error request", error)
  throw error
})

// wrap
xFetch.request.hook.wrap("request", async (request, option) => {
  console.log("wrap request before", request, option)
  const response = await request(option)
  console.log("wrap request after", response)
  return response
})
```

<!-- 请求中 -->

## ✅ 使用代理

> [!NOTE]
> Node 环境推荐使用 [undici](https://github.com/nodejs/undici)

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"
// import { ProxyAgent, fetch as undiciFetch } from 'undici'
import { fetch as undiciFetch } from "undici"
const xFetch = new XFetch({
  /* XFetch options */
  request: {
    fetch: (url: any, options: any) => {
      return undiciFetch(url, {
        ...options,
        // dispatcher: new ProxyAgent('https://...'),
      })
    },
  },
})

xFetch.request({
  /** request options */
}).then(console.log).catch(console.error)
```

## ✅ JSON数据

**发送JSON数据：**

> [!WARNING]
> 请求头未包含 `content-type` 和 `accept` 时，都会自动添加 `application/json`

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"
const xFetch = new XFetch({
  baseUrl: "https://api.github.com",
})

// 请求头包含 content-type: application/json 时，请求数据会自动序列化为 JSON 字符串
xFetch.request({
  url: "/users/xiaohuohumax",
  method: "POST",
  body: {
    name: "xiaohuohumax",
  }
}).then(console.log).catch(console.error)

// 如果需要禁用自动序列化，可以设置 request.autoParseRequestBody 为 false
// 注意：autoParseRequestBody： false 只是禁用 body 自动序列化，并不意味着不会为请求头添加 `content-type` 和 `accept`
xFetch.request({
  url: "/users/xiaohuohumax",
  body: {
    name: "xiaohuohumax",
  },
  request: {
    autoParseRequestBody: false,
  }
}).then(console.log).catch(console.error)

// 若是 body 默认处理逻辑不满足需求，可以利用 `parse-options` 钩子的 `wrap` 方法自定义处理逻辑
xFetch.request.hook.wrap("parse-options", (oldFunc, options) => {
  // 原来的处理逻辑
  // return oldFunc(options)
  // 还请注意其他参数
  return {
    // body: ... 自定义处理逻辑
  }
})
```

**接收JSON数据：**

`responseType`（响应体处理格式） 支持类型：

+ `json`：响应体会自动解析为 JSON 对象，即 `fetch().json()`
+ `text`：响应体会以文本形式返回，即 `fetch().text()`
+ `blob`：响应体会以二进制 Blob 形式返回，即 `fetch().blob()`
+ `stream`：响应体会以 fetch(ReadableStream) 流形式返回，即 `fetch().body`
+ `formData`：响应体会以 FormData 形式返回，即 `fetch().formData()`
+ `arrayBuffer`：默认值，响应体会以 ArrayBuffer 形式返回，即 `fetch().arrayBuffer()`

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"
const xFetch = new XFetch({
  baseUrl: "https://api.github.com",
})

// // 响应头包含 content-type: application/json 时，data 字段会自动解析为 JSON 对象
const { status, data } = await xFetch.request({/** request options */ })

// console.log(status, data) // 200, {...}

// 若是想指定响应体格式，可以设置 responseType 字段
const { status, data } = await xFetch.request({
  /** request options */
  request: {
    // [`json` | `text` | `blob` | `stream` | `arrayBuffer` | `formData`]
    // 默认为 undefined arraybuffer
    responseType: "text",
  }
})
// console.log(status, data) // 200, ""

// 若是响应体默认处理逻辑不满足需求，可以利用 `parse-response` 钩子的 `wrap` 方法自定义处理逻辑
xFetch.request.hook.wrap("parse-response", (oldFunc, { fetchResponse, options }) => {
  // 原来的处理逻辑
  // return oldFunc({ fetchResponse, options })
  // 还请注意其他参数
  return {
    // data: "custom data", // 自定义处理逻辑
  }
})
```

## ✅ 类型推断

```typescript
import { XFetch } from "@xiaohuohumax/x-fetch-core"
const xFetch = new XFetch({/* XFetch options */})

interface User {
  [key: string]: any
}

const { status, data } = await xFetch.request<User>({/** request options */})

console.log(status, data) // 200, User
```

## ✅ 请求超时

```typescript
import { XFetch, XFetchTimeoutError } from "@xiaohuohumax/x-fetch-core"
const xFetch = new XFetch({
  /* XFetch options */
  request: {
    timeout: 10
  }
})

// 使用全局超时配置
xFetch.request({
  /** request options */
})
  .then(console.log)
  .catch((error) => {
    if (error instanceof XFetchTimeoutError) {
      console.error("Request timed out")
    }
  })

// 单独设置超时
xFetch.request({
  /** request options */
  request: {
    timeout: 5
  }
})
  .then(console.log)
  .catch((error) => {
    if (error instanceof XFetchTimeoutError) {
      console.error("Request timed out")
    }
  })
```

## ✅ 异常处理

- `XFetchError` - 所有XFetch异常的基类
  - `XFetchRequestError` - 请求异常（包含请求、响应等信息）
  - `XFetchTimeoutError` - 请求超时异常（包含请求信息）

```typescript
import { XFetch, XFetchError, XFetchRequestError, XFetchTimeoutError } from "@xiaohuohumax/x-fetch-core"
const xFetch = new XFetch({
  /* XFetch options */
})

xFetch.request({/** request options */})
  .then(console.log)
  .catch((error) => {
    if (error instanceof XFetchError) {
      if (error instanceof XFetchRequestError) {
        console.error("Request failed")
      }
      else if (error instanceof XFetchTimeoutError) {
        console.error("Request timed out")
      }
    }
    console.error(error)
  })
```

## 📦 制作插件

[参考插件模板](https://github.com/xiaohuohumax/x-fetch/tree/main/packages/plugins/plugin-template#readme)

```shell
npm install @xiaohuohumax/x-fetch-request
```

```typescript
import { XFetch as XFetchCore, XFetchOptions as XFetchCoreOptions } from "@xiaohuohumax/x-fetch-core"
import "@xiaohuohumax/x-fetch-request"

interface Log {
  enabled?: boolean
}

interface LogPluginOptions extends XFetchCoreOptions {
  log?: Log
}

interface LogPlugin {
  log: (message: string) => void
}

// 注意：插件加载时机在构造 XFetch 实例时
function logPlugin(xFetch: XFetchCore, options: LogPluginOptions): LogPlugin {
  const state: Required<Log> = Object.assign({ enabled: false }, options.log)

  // 插件代码...
  if (state.enabled) {
    function log(message: string) { }
    xFetch.request.hook.before("request", (options) => {
      // 注册自定义钩子
      xFetch.request.hook("log", log, `request ${options.url}`)
    })
  }

  return {
    log: (message: string) => {
      console.log(message)
    }
  }
}

declare module "@xiaohuohumax/x-fetch-core" {
  // 扩展 XFetch options 参数
  interface XFetchOptions {
    log?: Log
  }
}

declare module "@xiaohuohumax/x-fetch-request" {
  /**
   * 扩展内置钩子类型
   *
   * @see https://www.npmjs.com/package/before-after-hook
   */
  interface RequestHooks {
    log: {
      Options: string
      Result: void
      Error: Error
    }
  }
}

const XFetch = XFetchCore.plugin(logPlugin)

const xFetch = new XFetch({
  baseUrl: "https://example.com",
  log: {
    enabled: true
  }
})

// 使用自定义钩子
xFetch.request.hook.before("log", (message) => {
  console.log(message) // request https://example.com/api/test
})

// 使用插件提供的 log 方法
xFetch.log("hello world") // hello world

xFetch.request("GET /api/test").then(console.log).catch(console.error)
```

## 📄 License

[MIT](LICENSE)

最后：玩的开心 🎉🎉🎉🎉
