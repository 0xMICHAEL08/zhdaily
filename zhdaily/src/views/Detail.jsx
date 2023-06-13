import React from 'react';
import './Detail.less';
import { LeftOutline, MessageOutline, LikeOutline, StarOutline, MoreOutline } from 'antd-mobile-icons';
import { Badge } from 'antd-mobile';

const Detail = function Detail() {
  return (
    <div className="detail-box">
      {/* 底部栏 */}
      <div className="tab-bar">
        {/* 返回 */}
        <div className="back">
          <LeftOutline />
        </div>

        <div className="icons">
          {/* 评论 */}
          <Badge content={'128'}>
            <MessageOutline />
          </Badge>

          {/* 点赞 */}
          <Badge content="29">
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
