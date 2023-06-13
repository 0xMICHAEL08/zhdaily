import React from 'react';
import './NewsItem.less';
import { Image } from 'antd-mobile';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NewsItem = function NewsItem(props) {
  let { info } = props;
  if (!info) return null; // 防御性编程策略：确保 info 的值始终是可预测的，避免出现undefined

  let { id, title, hint, images } = info;
  if (!Array.isArray(images)) images = ['']; // 确保images是数组

  return (
    <div className="news-item-box">
      <Link to={{ pathname: `/detail/${id}` }}>
        <div className="content">
          <h4 className="title">{title}</h4>
          <p className="author">{hint}</p>
        </div>

        <Image src={images[0]} lazy />
      </Link>
    </div>
  );
};

/* 属性规则处理 */
NewsItem.defaultProps = {
  info: null, // 没拿到数据就不渲染
};
NewsItem.propTypes = {
  info: PropTypes.object, // 要求是对象类型
};

export default NewsItem;
