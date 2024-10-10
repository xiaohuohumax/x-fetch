# x-fetch-utils

x-fetch 工具集，包含了一些辅助函数。

## 🚀 快速开始

```shell
npm install @xiaohuohumax/x-fetch
```

## 📚 使用说明

+ `getUriTemplateVariableNames` - 获取 [URI 模板(RFC6570)](https://datatracker.ietf.org/doc/html/rfc6570) 中的变量名列表

```typescript
import { getUriTemplateVariableNames } from "@xiaohuohumax/x-fetch-utils"

const names = getUriTemplateVariableNames("/users/{id}/comments/{commentId}")

console.log(names) // Set(2) { 'id', 'commentId' }
```

+ `omit` - 过滤对象中的指定属性

```typescript
import { omit } from "@xiaohuohumax/x-fetch-utils"

const obj = { a: 1, b: 2, c: 3 }
const result = omit(obj, ["b"])

console.log(result) // { a: 1, c: 3 }
```

+ `parseUriTemplate` - 解析 [URI 模板(RFC6570)](https://datatracker.ietf.org/doc/html/rfc6570) 并替换变量

```typescript
import { parseUriTemplate } from "@xiaohuohumax/x-fetch-utils"

const template = "/users/{id}/comments/{commentId}"
const variables = { id: 123, commentId: 456 }
const uri = parseUriTemplate(template, variables)

console.log(uri) // "/users/123/comments/456"
```

+ `deleteUndefinedProperties` - 删除对象中的值为 undefined 的属性

```typescript
import { deleteUndefinedProperties } from "@xiaohuohumax/x-fetch-utils"

const obj = { a: 1, b: undefined, c: 3 }
deleteUndefinedProperties(obj)

console.log(obj) // { a: 1, c: 3 }
```

## 📄 License

[MIT](LICENSE)

最后：玩的开心 🎉🎉🎉🎉
