import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

export const worker = setupServer(
  http.get("http://example.com/hello", () => {
    return HttpResponse.json(
      { message: "Hello World" },
      {
        status: 200,
        statusText: "Hello World",
      },
    )
  }),

  http.get("http://example.com/timeout", async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(
          {},
          {
            statusText: "Request Timeout",
          },
        ))
      }, 1000 * 5)
    })
  }),

  http.post("http://example.com/reply", async ({ request }) => {
    return HttpResponse.json(
      request.body ? await request.json() : {},
      {
        status: 200,
        statusText: "Reply",
      },
    )
  }),

  http.get("http://example.com/request", async ({ request }) => {
    return HttpResponse.json(
      Object.fromEntries(request.headers.entries()),
      {
        status: 200,
      },
    )
  }),

  http.get("http://example.com/text", async () => {
    return HttpResponse.text("text")
  }),

  http.get("http://example.com/blob", async () => {
    return new HttpResponse(new Blob(["blob"], {
      type: "application/octet-stream",
    }))
  }),

  http.get("http://example.com/error/:status", async ({ params }) => {
    return new HttpResponse(null, {
      status: Number.parseInt(params.status as string),
      statusText: "Error",
    })
  }),

  http.head("http://example.com/error/:status", async ({ params }) => {
    return new HttpResponse(null, {
      status: Number.parseInt(params.status as string),
      statusText: "Error",
    })
  }),
)
