import { XFetch } from "@xiaohuohumax/x-fetch"

const xFetch = new XFetch({
  baseUrl: "https://api.github.com",
  headers: {},
  params: {
    owner: "octokit",
    repo: "octokit.js",
  },
})

xFetch.request.hook.before("request", (options) => {
  console.log("before request", options)
})

xFetch.request.hook.after("request", (response) => {
  console.log("after request", response)
})

xFetch.request.hook.error("request", (error, options) => {
  console.log("request error", error, options)
})

export default xFetch
