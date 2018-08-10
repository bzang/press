import * as querystring from 'querystring';
import {debounce, get} from 'lodash';

/**
 * @param {string} route
 * @param {string} query
 * @param {string} param
 * @returns {string}
 */
export function formatRoute(route, query, param) {
  const baseRoute = route === '.' ? window.location.pathname : route;
  return `${baseRoute}?${querystring.stringify({
    [param]: query
  })}`;
}

/**
 * Fetches autocomplete results and
 * @param {string} route
 * @param {string} query
 * @param {Object} options
 * @param {string} options.param
 * @param {string} options.keyPath
 * @param {string} options.method
 * @returns {Promise<string[]>}
 */
export const fetchResults = debounce(
  (route, query, options) => {
    const uri = formatRoute(route, query, options.param);
    return fetch(uri, {
      method: options.method,
      headers: {
        accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((body) => body.map((item) => get(item, options.keyPath)));
  },
  50,
  {
    leading: true,
    maxWait: 150,
    trailing: false
  }
);
