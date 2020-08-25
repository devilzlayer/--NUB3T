import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import { User, Transaction } from "../../service";

import { map, find } from "lodash";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Wrap } from "../view/profile/";

import { vipSlideValue, vipProgress } from "./vip/values";
import "../assets/scss/Vip.scss";
import { withAuth } from "../util/";

const Vip = () => {
  const history = useHistory();
  const slideItem = useRef(null);
  const slideBanner = useRef(null);

  const [loading, setLoading] = useState(false);
  const [vipCount, setVipCount] = useState(null);
  const [vipLevel, setVipLevel] = useState(1);
  const [vipAmount, setVipAmount] = useState(0.0);
  const [viProgVal, setViProgVal] = useState(0);

  const [tab, setTab] = useState(0);
  const [roll, setRoll] = useState(0);
  const [banners, setBanners] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  useEffect(() => {
    setLoading(true);
    const response = Transaction.read({
      ...User.read(),
      type: "get_vip_level",
    });

    response.promise.then(
      (r) => {
        // console.log(r)
        setLoading(false);
        if (r.status === 1) {
          const vlvp = Number(r.info.viplevel);
          const vamn = Number(r.info.accountnum);

          setVipCount(vlvp);
          setVipLevel(vlvp);
          const vpP = find(vipProgress, (obj) => obj.level === vlvp);
          setVipAmount(vamn);
          const valPer = (vamn * 100) / vpP.amount;
          setViProgVal(valPer);

          if (vlvp < 10) {
            setVipLevel(Number(vlvp) + 1);
          }
        }
      },
      (e) => {
        // console.log(e)
        setLoading(false);
      }
    );
  }, []);

  let bannerSetting = {};
  let bodySetting = {};

  if (vipCount != null) {
    bannerSetting = {
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 1,
      centerMode: true,
      centerPadding: "50px",
      className: "vip-slider",
      accessibility: false,
      beforeChange: (oldIndex, newIndex) => {
        slideItem.current.slickGoTo(newIndex);
      },
      initialSlide: vipCount,
    };

    bodySetting = {
      dots: false,
      arrows: false,
      swipe: false,
      draggable: false,
      infinite: false,
      speed: 500,
      className: "vip-slider-body",
      slidesToShow: 1,
      slidesToScroll: 1,
      accessibility: false,
      initialSlide: vipCount,
    };

    const checkScrollTop = () => {
      // console.log(window.pageYOffset)
      if (window.pageYOffset > 80) {
        setRoll(true);
      } else {
        setRoll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);

    return (
      <Wrap
        className={`vip-wrap privilege ${roll ? "roll" : ""}`}
        centerName="VIP详情"
        faq={false}
        isLoading={loading}
      >
        <div className="vip-wrap-inner-bg" />
        <div className={`vip-wrap-inner-top-header tab-${tab}`}>
          <Link to="vip" className={`vip-wrap-inner-h-text active`}>
            VIP特权
            {tab === 0 ? <div className={`vip-wrap-inner-h-switch`} /> : null}
          </Link>
          <Link to="vip-details" className={`vip-wrap-inner-h-text`}>
            VIP详情
          </Link>
        </div>

        <div className="vip-wrap-inner">
          <div className="vip-wrap-inner-container">
            {/* <div className="vip-wrap-inner-vip-banner vip-banner4" /> */}
            <Slider {...bannerSetting} ref={slideBanner}>
              {map(vipSlideValue, (obj, i) => (
                <div key={i} className="vip-wrap-inner-width">
                  <div
                    className={`vip-wrap-inner-vip-banner vip-banner${i} ${vipCount >= i ? `unlocked` : null}`}
                  />
                </div>
              ))}
            </Slider>

            <div className="vip-wrap-top-box">
              <div className="vip-wrap-t-b-range">
                <div className={`vip-wrap-range-span vp-${vipCount}`}>
                  VIP{vipCount}
                </div>
                <div className={`vip-wrap-range-span vp-${vipLevel}`}>
                  VIP{vipLevel}
                </div>
                <div className="vip-wrap-range-line">
                  <span className="vip-per-val" style={{ left: viProgVal }}>
                    {viProgVal}%
                  </span>
                  <span
                    className="vip-per-range"
                    style={{ width: `${viProgVal}%` }}
                  ></span>
                </div>
              </div>
              <div className="vip-wrap-t-b-caption">
                您已完成{vipAmount}流水 （每日16点更新）
              </div>
            </div>

            <Slider {...bodySetting} ref={slideItem}>
              {map(vipSlideValue, (obj, i) => {
                return (
                  <div key={i} className="vip-section-container">
                    <div className="vip-section-item">
                      <div className="vip-s-i-title">
                        <h2>VIP特权</h2>

                        <div className="vip-s-i-body">
                          <div className="vip-s-i-b-item rocket">
                            <div className="vip-s-i-b-box">
                              <i />
                              <div className="vip-b-item-cont">
                                <span className="value">
                                  {obj.item1} <small>元</small>
                                </span>
                                <span className="text">升级礼金</span>
                              </div>
                            </div>
                          </div>
                          <div className="vip-s-i-b-item pocket">
                            <div className="vip-s-i-b-box">
                              <i />
                              <div className="vip-b-item-cont">
                                <span className="value">
                                  {obj.item2} <small>元</small>
                                </span>
                                <span className="text">每月红包</span>
                              </div>
                            </div>
                          </div>
                          <div className="vip-s-i-b-item graph">
                            <div className="vip-s-i-b-box">
                              <i />
                              <div className="vip-b-item-cont">
                                <span className="value">
                                  {obj.item3} <small>次</small>
                                </span>
                                <span className="text">提款次数提升</span>
                              </div>
                            </div>
                          </div>
                          <div className="vip-s-i-b-item coins">
                            <div className="vip-s-i-b-box">
                              <i />
                              <div className="vip-b-item-cont">
                                <span className="value">
                                  {obj.item4}万<small>/日</small>
                                </span>
                                <span className="text">提款额度提升</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {i >= 5 && (
                      <div className="vip-section-item">
                        <div className="vip-s-i-title">
                          <h2>VIP特权</h2>
                          <div className="vip-s-i-body">
                            <div className="vip-item-special">
                              <div className="vip-item-special-gift-image" />
                              <div className="vip-item-special-value">
                                <span>生日礼包</span>
                                <span className="value">
                                  <small>￥</small>
                                  {obj.special}
                                </span>
                              </div>
                              {/* <div className="vip-item-special-button">立即领取</div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="vip-section-item">
                      <div className="vip-s-i-title">
                        <h2>VIP优惠</h2>

                        <div className="vip-s-i-body">
                          <div className="vip-s-i-body-cont-box">
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid1}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                体育返水
                              </div>
                            </div>
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid2}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                电竞返水
                              </div>
                            </div>
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid3}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                篮球返水
                              </div>
                            </div>
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid4}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                真人返水
                              </div>
                            </div>
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid5}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                棋牌返水
                              </div>
                            </div>
                            <div className="vip-s-i-body-cont-item">
                              <div className="vip-s-i-body-cont-item-title">
                                {obj.grid6}%
                              </div>
                              <div className="vip-s-i-body-cont-item-text">
                                电子返水
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      </Wrap>
    );
  }

  return null;
};

export default withAuth(Vip, 1);
