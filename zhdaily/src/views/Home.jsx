import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [today, setToday] = useState(_.formatTime(null, '{0}{1}{2}')),
    [bannerData, setBannerData] = useState([]),
    [newsList, setNewsList] = useState([]),
    [isLoading, setIsLoading] = useState(false);

  let loadMore = useRef(); // loadMore.current获取当前DOM元素

  /* 第一次渲染完毕，向服务器发送数据请求 */
  useEffect(() => {
    // async不能直接用在useEffect，因为返回值必须是一个函数，而不是Promise对象
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        setToday(date);
        setBannerData(top_stories);

        newsList.push({
          date,
          stories,
        });
        setNewsList([...newsList]);
      } catch (_) {}
    })();
  }, []);

  const handleIntersection = useCallback(
    async (changes) => {
      let { isIntersecting } = changes[0];
      if (isIntersecting && !isLoading) {
        // 触底且未在加载中
        setIsLoading(true);
        try {
          // 获取新闻列表中最后一项的日期，发送给服务器，拿到更前一天的数据
          let time = newsList[newsList.length - 1]['date'];
          let res = await api.queryNewsBefore(time);
          setNewsList((prevNewsList) => [...prevNewsList, res]);
        } catch (_) {}

        setIsLoading(false);
      }
    },
    [isLoading]
  );

  /* 第一次渲染完毕：设置监听器，实现触底加载 */
  useEffect(() => {
    let ob = new IntersectionObserver(handleIntersection);
    let loadMoreBox = loadMore.current;
    ob.observe(loadMore.current);

    // 组件销毁释放的时候：手动销毁监听器
    return () => {
      ob.unobserve(loadMoreBox);
      ob = null;
    };
  }, [handleIntersection]);

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
      {newsList.length === 0 ? (
        <SkeletonAgain />
      ) : (
        <>
          {newsList.map((item, index) => {
            let { date, stories } = item;
            return (
              <div className="news-box" key={date}>
                {index !== 0 ? (
                  <Divider contentPosition="left">
                    {_.formatTime(date, '{1}月{2}日')
                      .replace(/0(\d)月/, '$1月')
                      .replace(/0(\d)日/, '$1日')}
                  </Divider>
                ) : null}
                <div className="list">
                  {stories.map((cur) => {
                    return <NewsItem key={cur.id} info={cur} />;
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 加载更多 */}
      <div
        className="loadmore-box"
        ref={loadMore}
        style={{
          display: newsList.length === 0 ? 'none' : 'block',
        }}
      >
        <DotLoading />
        数据加载中
      </div>
    </div>
  );
};

export default Home;
