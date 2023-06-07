import React, { useState, useEffect } from 'react';
import HomeHead from '../component/HomeHead';
import _ from '../assets/utils';
import './Home.less';
import { Swiper, Image, Divider, DotLoading } from 'antd-mobile';
import { Link } from 'react-router-dom';
import api from '../api/index';
import NewsItem from '../component/NewsItem';
import SkeletonAgain from '../component/SkeletonAgain';

const Home = function Home() {
  /* 创建所需状态 */
  let [today, setToday] = useState(_.formatTime(null, '{0}{1}{2}')),
    [bannerData, setBannerData] = useState([]);

  /* 第一次渲染完毕，向服务器发送数据请求 */
  useEffect(() => {
    // async不能直接用在useEffect，因为返回值必须是一个函数，而不是Promise对象
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);
      } catch (_) {}
    })();
  }, []);

  return (
    <div className="home-box">
      {/* 头部 */}
      <HomeHead today={today} />

      {/* 轮播图 */}
      <div className="swiper-box">
        {bannerData.length > 0 ? ( // 判断是否获取到轮播图数据
          <Swiper autoplay={true} loop={true}>
            {bannerData.map((item) => {
              let { id, image, title, hint } = item;
              return (
                <Swiper.Item key={id}>
                  <Link
                    to={{
                      pathname: `/detail/${id}`,
                    }}
                  >
                    <Image src={image} lazy />
                    <div className="wxorxn"></div>
                    <div className="desc">
                      <h3 className="title">{title}</h3>
                      <p className="author">{hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>

      {/* 新闻列表 */}
      {/* <SkeletonAgain /> */}

      <div className="news-box">
        <Divider contentPosition="left">12月23日</Divider>
        <div className="list">
          <NewsItem />
          <NewsItem />
          <NewsItem />
          <NewsItem />
          <NewsItem />
        </div>
      </div>
      <div className="news-box">
        <Divider contentPosition="left">12月23日</Divider>
        <div className="list">
          <NewsItem />
          <NewsItem />
          <NewsItem />
          <NewsItem />
          <NewsItem />
        </div>
      </div>

      {/* 加载更多 */}
      <div className="loadmore-box">
        <DotLoading />
        数据加载中
      </div>
    </div>
  );
};

export default Home;
