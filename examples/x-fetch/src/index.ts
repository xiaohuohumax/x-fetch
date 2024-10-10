import { XFetch } from "@xiaohuohumax/x-fetch"

const xFetch = new XFetch({
  baseUrl: "https://example.com",
  retry: {
    enabled: true,
    retries: 3,
  },
})

// Retry interceptor.
xFetch.request.hook.before("retry", (config) => {
  console.log("before retry", config)
})

// Request interceptor.
xFetch.request.hook.before("request", (config) => {
  console.log("before request", config)
})

xFetch.request({
  url: "/api/users",
  method: "GET",
  // Request options.
})
