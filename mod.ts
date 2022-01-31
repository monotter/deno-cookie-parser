import { deleteCookie, getCookies, setCookie } from './.depts.ts'

type value = string | { [key: string]: value }
export interface CookieOptions {
  /** Expiration date of the cookie. */
  expires?: Date;
  /** Max-Age of the Cookie. Max-Age must be an integer superior or equal to 0. */
  maxAge?: number;
  /** Specifies those hosts to which the cookie will be sent. */
  domain?: string;
  /** Indicates a URL path that must exist in the request. */
  path?: string;
  /** Indicates if the cookie is made using SSL & HTTPS. */
  secure?: boolean;
  /** Indicates that cookie is not accessible via JavaScript. */
  httpOnly?: boolean;
  /**
   * Allows servers to assert that a cookie ought not to
   * be sent along with cross-site requests.
   */
  sameSite?: "Strict" | "Lax" | "None";
  /** Additional key value pairs with the form "key=value" */
  unparsed?: string[];
}

export class CookieParser {
    #requestHeaders
    #responseHeaders
    readonly cache: Map<string, string>
    constructor(requestHeaders: Headers, responseHeaders: Headers) {
        this.cache = new Map()
        this.#requestHeaders = requestHeaders
        this.#responseHeaders = responseHeaders
        const cookies = <{ [key: string]: string }>getCookies(this.#requestHeaders)
        Object.keys(cookies).forEach((name) => {
            const value = cookies[name]
            this.cache.set(name, value)
        })
    }
    get(name: string) {
        return this.cache.get(name)
    }
    set(name: string, value: string, options?: CookieOptions) {
        setCookie(this.#responseHeaders, { name, value, ...options })
        this.cache.set(name, value)
    }
    delete(name: string, options?: { path?: string; domain?: string }) {
        deleteCookie(this.#responseHeaders, name, options)
        this.cache.delete(name)
    }
}