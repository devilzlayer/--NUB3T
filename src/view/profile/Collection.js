import React, { useEffect, useState } from "react";
import { map } from "lodash";

import { Service } from "./";

import Wrap from "./Wrap";

import "../../assets/scss/profile/Collection.scss";

const CardItem = (props) => {
  const { label, value, className, onClick } = props;
  return (
    <div className={`collection-card-item ${className ? className : ""}`}>
      <div className="cl-item collection-card-text">{label}</div>
      <div className="cl-item collection-card-value">
        {value ? value : "0.00"}
      </div>
      <div className="cl-item collection-card-button">
        <button type="button" onClick={onClick}>
          领取
        </button>
      </div>
    </div>
  );
};

const Collection = () => {
  const [key, setKey] = useState(0);
  const [bonus, setBonus] = useState([]);
  const [angpao, setAngpao] = useState(null);
  const [level, setLevel] = useState(0);

  const [grab, setGrab] = useState(false);
  const [yuan, setYuan] = useState(false);
  const [gift, setGift] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [success, setSuccess] = useState(false);

  const [upgradeBonus, setUpgradeBonus] = useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
  ]);

  const upgradeData = [
    "gid1903",
    "gid1905",
    "gid1909",
    "gid1910",
    "gid1911",
    "gid1912",
    "gid1913",
    "gid1914",
    "gid1915",
    "gid1916",
  ];

  useEffect(() => {
    const response = Service.User.collection({
      ...Service.User.read(),
    });

    response.promise.then(
      (result) => {
        // console.log(result);
        if (result.status === 1) {
          setBonus(result.info);
          setAngpao(result.info.gid1908);
        }
      },
      (e) => {
        console.log("Unable to response:", e);
      }
    );

    const responseLvl = Service.Transaction.read({
      ...Service.User.read(),
      type: "get_vip_level",
    });

    responseLvl.promise.then(
      (r) => {
        // console.log(r);
        if (r.status === 1) {
          setLevel(r.info.viplevel);
        }
      },
      (e) => {}
    );
  }, []);

  const receiveBonus = (recipient) => {
    const response = Service.User.receiveBonus({
      ...Service.User.read(),
      id: recipient,
    });

    response.promise.then(
      (result) => {
        console.log("Bonus received", result);

        setYuan(false);
        setSuccess(true);
        setAngpao(bonus.gid1908);

        const response = Service.User.collection({
          ...Service.User.read(),
        });

        response.promise.then(
          (result) => {
            console.log(result);
            if (result.status === 1) {
              setBonus(result.info);
            }
          },
          (e) => {
            console.log("Unable to response:", e);
          }
        );
      },
      (e) => {
        console.log("Unable to response:", e);
      }
    );
  };

  const onGrab = () => {
    setYuan(true);
    setTimeout(() => {
      receiveBonus("gid1908");
    }, 2000);
    setTimeout(() => {
      setGrab(true);
      setYuan(false);
    }, 2500);
  };

  const onMonthly = () => {
    if (bonus.gid1906) {
      receiveBonus("gid1906");
      setMonthly(true);
    }
  };

  const omGift = () => {
    if (bonus.gid1907) {
      receiveBonus("gid1907");
      setGift(true);
    }
  };

  return (
    <Wrap className="profile-collection" title={"优惠领取"}>
      <div className="profile-desktop-tab">
        <div className="profile-desktop-tab-header">
          <div className={`profile-desktop-tab-head-item`}>
            <span
              onClick={() => setKey(0)}
              className={key == 0 ? "active" : ""}
            >
              抢红包
            </span>
          </div>
          <div className={`profile-desktop-tab-head-item`}>
            <span
              onClick={() => setKey(1)}
              className={key == 1 ? "active" : ""}
            >
              每月礼金
            </span>
          </div>
          <div className={`profile-desktop-tab-head-item`}>
            <span
              onClick={() => setKey(2)}
              className={key == 2 ? "active" : ""}
            >
              升级礼金
            </span>
          </div>
          <div className={`profile-desktop-tab-head-item`}>
            <span
              onClick={() => setKey(3)}
              className={key == 3 ? "active" : ""}
            >
              生日礼金
            </span>
          </div>
        </div>
        <div className="profile-desktop-tab-body">
          <div
            className={`profile-desktop-tab-col ${key == 0 ? "active" : ""}`}
          >
            <div className="col-bonus-box-wrap">
              <div className="col-bonus-box-wrap-cont">
                <div className="col-bonus-box-wrapper ">
                  <div className="col-bonus-box-icon">
                    <i className="grab"></i>
                  </div>
                  <div className="col-bonus-box col-pao-box">
                    <div className="col-pao-box-body">
                      <div className="col-pao-caption">抢到红包金额</div>
                      {grab && (
                        <div className="col-pao-value">
                          <span>{angpao}</span> RMB
                        </div>
                      )}
                    </div>
                    <div className="col-pao-box-clip"></div>
                    {!grab && !yuan && (
                      <div className="col-pao-box-chip" onClick={onGrab}>
                        抢红包
                      </div>
                    )}
                    {yuan && !success && <div className="col-pao-box-yuan" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`profile-desktop-tab-col ${key == 1 ? "active" : ""}`}
          >
            <div className="col-bonus-box-wrap">
              <div className="col-bonus-box-wrap-cont">
                <div className="col-bonus-box-wrapper">
                  <div className="col-bonus-box-icon">
                    <i className="monthly"></i>
                  </div>
                  <div className="col-bonus-box">
                    <div className="col-bonus-box-title">每月礼金</div>
                    <div className="col-bonus-box-span">
                      您获得 <span>{bonus.gid1906} 元红包.</span>
                    </div>
                    <div
                      className={`col-bonus-box-action ${
                        monthly || bonus.gid1906 == 0 ? "redeemed" : ""
                      }`}
                    >
                      {/* <i /> */}
                      <span onClick={onMonthly}>申请</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 2 ? "active" : ""}`}
          >
            {upgradeBonus &&
              map(upgradeBonus, (obj, i) => {
                const identifier = upgradeData[i];
                return (
                  <CardItem
                    key={i}
                    label={`VIP${obj}升级礼金`}
                    value={bonus[identifier]}
                    className={bonus[identifier] !== "0.00" ? "active" : ""}
                    onClick={() => receiveBonus(identifier)}
                  />
                );
              })}
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 3 ? "active" : ""}`}
          >
            <div className="col-bonus-box-wrap">
              <div className="col-bonus-box-wrap-cont">
                <div className="col-bonus-box-wrapper">
                  <div className="col-bonus-box-icon">
                    <i className="gift"></i>
                  </div>
                  <div className="col-bonus-box">
                    <div className="col-bonus-box-title">生日快乐</div>
                    <div className="col-bonus-box-span">
                      您获得 <span>{bonus.gid1907} 元红包.</span>
                    </div>
                    <div
                      className={`col-bonus-box-action ${
                        gift || bonus.gid1907 == 0 ? "redeemed" : ""
                      }`}
                    >
                      {/* <i /> */}
                      <span onClick={omGift}>申请</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default Collection;
