/* 创建store */

import { createStore, applyMiddleware } from 'redux';
import reduxLogger from 'redux-logger'; // 用于在控制台中记录Redux操作
import reduxThunk from 'redux-thunk'; // 用于处理异步操作
import reduxPromise from 'redux-promise'; // 用于处理异步操作
import reducer from './reducer'; // 用于处理Redux操作

/* 根据不同的环境，选择不同的容器 */
let middleware = [reduxThunk, reduxPromise],
  env = process.env.NODE_ENV;
if (env === 'development') middleware.push(reduxLogger);

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;
