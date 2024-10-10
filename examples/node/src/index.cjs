const { XFetch } = require("@xiaohuohumax/x-fetch")

const xFetch = new XFetch({
  baseUrl: "https://example.com",
})

xFetch.request({
  url: "/api/users",
  method: "GET",
}).then(console.log).catch(console.error)
