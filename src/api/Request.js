/* eslint-disable no-empty */
import {
  pathOr,
  path,
  assoc,
  pipe,
  over,
  lensProp,
  mergeRight,
} from 'ramda';
import axios from 'axios';
import { API_URL } from '../config';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const authAccessTokenSelector = () => 'sh_9f57832f-456b-44f3-888f-8a370b155a18';

axiosInstance.interceptors.request.use(
  (config) => {
    const customConfig = pathOr({}, ['customConfig'], config);
    const token = authAccessTokenSelector();
    const headers =
      token && !customConfig.noToken
        ? {
            'X-ShopId': token,
          }
        : {};

    return over(lensProp('headers'), mergeRight(headers), config);
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const statusCode = path(['response', 'status'], error);
    const data = pipe(
      pathOr({}, ['response', 'data']),
      assoc('statusCode', statusCode),
    )(error);
    const customConfig = pathOr({}, ['config', 'customConfig'], error);

    if (statusCode === 408 || error.code === 'ECONNABORTED') {
      return Promise.reject(error);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (statusCode === 401) {
    }

    if (statusCode === 403) {
    }

    if (statusCode === 404 && !customConfig.noRedirect404) {
    }

    if (statusCode === 500) {
    }

    return Promise.reject(data);
  },
);

// eslint-disable-next-line no-unused-vars
export const Request = (config = {}) => {
  const normalizeConfig = {
    ...config,
    noToken: config.noToken || false,
    noRedirect404: config.noRedirect404 || false,
  };

  return {
    get(url, params = {}, options = {}) {
      return axiosInstance.get(url, {
        ...options,
        customConfig: normalizeConfig,
        params,
      });
    },

    post(url, data, options = {}) {
      return axiosInstance.post(url, data, {
        ...options,
        customConfig: normalizeConfig,
      });
    },

    put(url, data, options = {}) {
      return axiosInstance.put(url, data, {
        ...options,
        customConfig: normalizeConfig,
      });
    },

    delete(url, data, options = {}) {
      return axiosInstance.delete(url, {
        ...options,
        customConfig: normalizeConfig,
        data,
      });
    },
  };
};

export default Request;
