import React, { useState, useEffect, useMemo } from 'react';
import './Detail.less';
import {
  LeftOutline,
  MessageOutline,
  LikeOutline,
  StarOutline,
  MoreOutline
} from 'antd-mobile-icons';
import { Badge, Toast } from 'antd-mobile';
import api from '../api';
import SkeletonAgain from '../component/SkeletonAgain';
import { flushSync } from 'react-dom';
import { connect } from 'react-redux';
import action from '../store/action';

const Detail = function Detail(props) {
  /* ------------新闻页面展示------------ */
  let { navigate, params } = props; // 所有经过route渲染的组件都会有一个navigate属性，用于跳转路由

  /* 定义状态 */
  let [info, setInfo] = useState(null),
    [extra, setExtra] = useState(null);

  /* 处理标题 */
  const insertTitle = (html, title) => {
    // 既然HTML是从外部引入的，可以通过替换来增加title
    // if (!html || !title) return html;
    const titlePlaceholder = '<h2 class="question-title"></h2>';
    const titleWithContent = `<h2 class="question-title">${title}</h2>`;
    return html.replace(titlePlaceholder, titleWithContent);
  };
  const processedHtml = info ? insertTitle(info.body, info.title) : null;

  /* 第一次渲染完毕：获取数据 */
  // 处理样式
  let link;
  const handleStyle = result => {
    let { css } = result;
    if (!Array.isArray(css)) return;
    css = css[0];
    if (!css) return;
    // 创建<LINK>导入样式
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = css;
    document.head.appendChild(link);
  };
  // 处理图片
  const handleImage = result => {
    let imgPlaceHolder = document.querySelector('.img-place-holder');
    if (!imgPlaceHolder) return;
    // 创建大图，并插入到容器中
    let tempImg = new Image();
    tempImg.src = result.image;
    tempImg.onload = () => {
      imgPlaceHolder.appendChild(tempImg);
    };
    tempImg.onerror = () => {
      let parent = imgPlaceHolder.parentNode;
      parent.parentNode.removeChild(parent);
    };
  };

  // 并行发送数据请求
  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);
        // 处理样式&图片
        flushSync(() => {
          setInfo(result);
          handleStyle(result);
        }); // 处理完成刷新更新队列，确保能获取到imgPlaceHolder
        handleImage(result);
      } catch (_) {}
    })();
    // 销毁时移除样式
    return () => {
      if (link) document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryStoryExtra(params.id);
        setExtra(result);
      } catch (_) {}
    })();
  }, []);

  /* ------------登录和收藏------------ */
  let {
    base: { info: userInfo },
    queryUserInfoAsync,

    location,

    store: { list: storeList },
    queryStoreListAsync,
    removeStoreListById
  } = props;

  useEffect(() => {
    (async () => {
      // 第一次渲染完：如果userInfo不存在，我们派发任务来同步登录者信息
      if (!userInfo) {
        let { info } = await queryUserInfoAsync();
        userInfo = info;
      }
      // 如果已经登录 && 没有收藏列表信息：派发任务来同步收藏列表
      if (userInfo && !storeList) {
        queryStoreListAsync();
      }
    })();
  }, []);

  // 依赖于收藏列表和路径参数，计算出是否收藏
  const isStore = useMemo(() => {
    if (!storeList) return false;
    return storeList.some(item => {
      return +item.news.id === +params.id;
    });
  }, [storeList, params]);

  // 点击收藏按钮
  const handleStore = async () => {
    // 未登录
    if (!userInfo) {
      Toast.show({
        icon: 'fail',
        content: '请先登录'
      });
      navigate(`/login?to=${location.pathname}`, { replace: true });
      return;
    }
    // 已经登录：收藏或移除收藏
    if (isStore) {
      // 移除收藏
      let item = storeList.find(item => {
        return +item.news.id === +params.id;
      });
      if (!item) return;
      let { code } = await api.storeRemove(item.id);
      if (+code !== 0) {
        Toast.show({
          icon: 'fail',
          content: '操作失败'
        });
        return;
      }
      removeStoreListById(item.id); //告诉redux中也把这一项移除掉
      return;
    }
    // 收藏
    try {
      let { code } = await api.store(params.id);
      if (+code !== 0) {
        Toast.show({
          icon: 'fail',
          content: '收藏失败，请重试'
        });
        return;
      }
      Toast.show({
        icon: 'success',
        content: '收藏成功'
      });
      queryStoreListAsync(); // 同步最新的收藏列表到redux容器中
    } catch (_) {}
  };

  return (
    <div className="detail-box">
      {/* 新闻内容 */}
      {!info ? (
        <SkeletonAgain />
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        ></div>
      )}

      {/* 底部栏 */}
      <div className="tab-bar">
        {/* 返回 */}
        <div
          className="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutline />
        </div>
        {/* 其他图标 */}
        <div className="icons">
          {/* 评论 */}
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline />
          </Badge>
          {/* 点赞 */}
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline />
          </Badge>
          {/* 收藏 */}
          <span className={isStore ? 'stored' : ''} onClick={handleStore}>
            <StarOutline />
          </span>
          {/* 更多 */}
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
};

export default connect(
  state => {
    return {
      base: state.base,
      store: state.store
    };
  },
  { ...action.base, ...action.store }
)(Detail);
