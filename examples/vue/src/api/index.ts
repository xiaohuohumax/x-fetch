import xFetch from "./x-fetch"

interface Issues {
  id: number
  title: string
  body?: string
}

export async function getIssuesById(id: number) {
  return xFetch.request<Issues>({
    url: "/repos/{owner}/{repo}/issues/{id}",
    method: "GET",
    params: {
      id,
    },
  })
}
