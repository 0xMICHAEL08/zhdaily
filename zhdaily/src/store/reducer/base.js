import * as TYPES from '../action-types';
import _ from '../../assets/utils'; // 深拷贝方法

let initial = {
  info: null, // 存储用户的信息
};

export default function baseReducer(state = initial, action) {
  state = _.clone(state); // 使用深拷贝创建一个新的状态，而不会直接修改原始状态对象
  switch (action.type) {
    // 更新登录者信息
    case TYPES.BASE_INFO:
      state.info = action.info;
      break;
    default:
  }
  return state;
}
