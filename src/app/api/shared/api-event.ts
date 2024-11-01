import { NextRequest } from "next/server"

export default class ApiEvent {
  request: NextRequest

  constructor(request: NextRequest) {
    this.request = request
  }

  logPrettyString() {
    const host = this.host()
    console.log("Host:", host)
    const origin = this.origin()

    console.log("Origin:", origin)

    const resource = this.resource()
    console.log("Resource:", resource)

    const method = this.method()
    console.log("Method:", method)

    const body = JSON.stringify(this.body(), null, 2)
    console.log("Body:", body)

    const searchParams = this.searchParams().toString()
    console.log("Search Params:", searchParams)
  }

  host() {
    return this.request.nextUrl.host
  }

  origin() {
    return this.request.nextUrl.origin
  }

  resource() {
    return this.request.nextUrl.pathname.replace(this.host(), "")
  }

  method() {
    return this.request.method
  }

  body(): Promise<unknown> | null {
    if (this.method() !== "POST") {
      return null
    }
    return this.request.json()
  }

  formData(): Promise<FormData> | null {
    if (this.method() !== "POST") {
      return null
    }
    return this.request.formData()
  }

  searchParams() {
    return this.request.nextUrl.searchParams
  }

  query(param: string) {
    return this.searchParams().get(param)
  }
}
