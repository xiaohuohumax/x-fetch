import { XFetch } from "@xiaohuohumax/x-fetch-core"

const xFetch = new XFetch({
  baseUrl: "https://example.com",
})

// Add a request interceptor.
xFetch.request.hook.before("request", (config) => {
  console.log("before request", config)
})

xFetch.request("GET /api/users", {
  // Request options.
})

xFetch.request({
  url: "/api/users",
  method: "GET",
  // Request options.
})
