import React, { Suspense, useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams
} from 'react-router-dom';
import routes from './routes';
import { Mask, DotLoading, Toast } from 'antd-mobile';
import store from '../store';
import action from '../store/action';

/* 统一路由配置，并渲染路由匹配到的组件 */
// 判断是否需要校验：redux中没有info，且跳转目标页面时，返回true
const isCheckLogin = path => {
  let {
      base: { info }
    } = store.getState(),
    checkList = ['/personal', '/store', '/update'];
  return !info && checkList.includes(path);
};

const Element = function Element(props) {
  let { component: Component, meta, path } = props;
  let isShow = !isCheckLogin(path); // 需要做校验时，isShow初始值为false，即不显示目标页面并跳转登录页
  let [_, setRandom] = useState(0);

  // 登录态校验
  useEffect(() => {
    if (isShow) return; // 不需要校验
    // 校验
    (async () => {
      let infoAction = await action.base.queryUserInfoAsync();
      let info = infoAction.info;
      if (!info) {
        // 如果获取后还是不存在，说明没有登录
        Toast.show({
          icon: 'fail',
          content: '请先登录'
        });
        // 跳转到登录页
        navigate(
          {
            pathname: '/login',
            search: `?to=${path}`
          },
          { replace: true } // 入口记录将被新的位置替换
        );
        return;
      }
      store.dispatch(infoAction); // 派发任务，把信息存储到容器中
      setRandom(+new Date()); // 更新组件
    })();
  });

  // 获取路由信息，基于属性传递给组件
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  // 修改页面title
  const { title = '知乎日报-WebApp' } = meta || {};
  document.title = title;

  return (
    <>
      {isShow ? (
        <Component
          navigate={navigate}
          location={location}
          params={params}
          usp={usp}
        />
      ) : (
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      )}
    </>
  );
};

export default function RouterView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      }
    >
      <Routes>
        {routes.map(item => {
          let { name, path } = item;
          return (
            <Route key={name} path={path} element={<Element {...item} />} />
          );
        })}
      </Routes>
    </Suspense>
  );
}
