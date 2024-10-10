import { endpoint } from "@xiaohuohumax/x-fetch-endpoint"

const newEndpoint = endpoint.defaults({
  baseUrl: "https://example.com",
  headers: {
    "content-type": "application/json",
  },
})

const e = newEndpoint("GET /api/users{?names*}", {
  params: {
    names: ["xiaohuohumax", "name2"],
  },
})

console.log(e)

const headers = new Headers()
headers.set("Authorization", "Bearer token")

const e2 = newEndpoint("GET /api/users{?names*}", {
  headers,
  params: {
    names: ["xiaohuohumax", "name2"],
  },
})

console.log(e2)
