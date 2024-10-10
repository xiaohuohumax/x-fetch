import { request } from "@xiaohuohumax/x-fetch-request"

const req = request.defaults({
  baseUrl: "https://example.com",
})

// Add a request interceptor.
req.hook.before("request", (config) => {
  console.log("before request", config)
})

req("GET /api/users", {
  // Request options.
})

req({
  url: "/api/users",
  method: "GET",
  // Request options.
})
