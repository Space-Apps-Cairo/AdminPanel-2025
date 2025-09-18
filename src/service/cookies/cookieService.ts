import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

class cookieService {
  get(name: string) {
    return cookies.get(name);
  }

  set(name: string, value: any, options?: CookieSetOptions) {
    return cookies.set(name, value, options);
  }

  remove(name: string, options?: CookieSetOptions) {
    return cookies.remove(name, options); // now supports { path: "/" }
  }
}
export default new cookieService();
