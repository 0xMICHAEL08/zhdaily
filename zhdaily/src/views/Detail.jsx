import React, { useState, useEffect } from 'react';
import './Detail.less';
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons';
import { Badge } from 'antd-mobile';
import api from '../api';
import SkeletonAgain from '../component/SkeletonAgain';
import { flushSync } from 'react-dom';

const Detail = function Detail(props) {
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
  const handleStyle = (result) => {
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
  const handleImage = (result) => {
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

  return (
    <div className="detail-box">
      {/* 新闻内容 */}
      {!info ? <SkeletonAgain /> : <div className="content" dangerouslySetInnerHTML={{ __html: processedHtml }}></div>}

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
          <span className="stored">
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

export default Detail;
