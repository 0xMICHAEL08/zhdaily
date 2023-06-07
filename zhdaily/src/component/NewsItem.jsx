import React from 'react';
import './NewsItem.less';
import { Image } from 'antd-mobile';
import { Link } from 'react-router-dom';

const NewsItem = function NewsItem() {
  return (
    <div className="news-item-box">
      <Link to={{ pathname: `/detail/xxx` }}>
        <div className="content">
          <h4 className="title">斑马的条纹到底是干嘛用的？斑马的条纹到底是干嘛用的？斑马的条纹到底是干嘛用的？</h4>
          <p className="author">作者 / 苏澄宇</p>
        </div>
        <Image src="https://pic2.zhimg.com/v2-5c87a645d36d140fa87df6e8ca7cb989.jpg" lazy />
      </Link>
    </div>
  );
};

export default NewsItem;
