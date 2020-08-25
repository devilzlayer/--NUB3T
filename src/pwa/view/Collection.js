import React, { useState, useEffect } from "react";
import { map } from "lodash";
import { useHistory } from "react-router-dom";

import { Wrap } from "../view/profile/";

import "../assets/scss/Collection.scss";
import { User, Transaction } from "../../service";
import { withAuth } from "../util/";
import { UIAlertSA } from "../component";

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

const PaoCont = () => {};

const Collection = () => {
  const history = useHistory();
  // washcodeself_list
  const [key, setKey] = useState(0);
  const [bonus, setBonus] = useState(null);
  const [angpao, setAngpao] = useState(null);
  const [level, setLevel] = useState(0);

  const [grab, setGrab] = useState(false);
  const [yuan, setYuan] = useState(false);
  const [gift, setGift] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [success, setSuccess] = useState(false);

  const [UpgradeBonus, setUpgradeBonus] = useState([
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

  function receiveBonus(recipient) {
    const response = User.receiveBonus({
      ...User.read(),
      id: recipient,
    });

    response.promise.then(
      (result) => {
        console.log("Bonus received", result);

        setYuan(false);
        setSuccess(true);
        setAngpao(bonus.gid1908);

        const response = User.collection({
          ...User.read(),
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
  }

  useEffect(() => {
    const response = User.collection({
      ...User.read(),
    });

    response.promise.then(
      (result) => {
        console.log(result);
        if (result.status === 1) {
          setBonus(result.info);
          setAngpao(result.info.gid1908);
        }
      },
      (e) => {
        console.log("Unable to response:", e);
      }
    );

    const responseLvl = Transaction.read({
      ...User.read(),
      type: "get_vip_level",
    });

    responseLvl.promise.then(
      (r) => {
        console.log(r);
        if (r.status === 1) {
          setLevel(r.info.viplevel);
        }
      },
      (e) => {}
    );
  }, []);

  // console.log(level)
  return (
    <Wrap
      className="collection-wrap"
      centerName="优惠领取"
      faq={false}
      // isLoading={true}
      sublevel={[true, () => history.goBack()]}
    >
      <div className="collection-wrap-inner">
        <div className="collection-wrap-inner-content">
          <div className="collection-card">
            {/* ==========================	TEMPORARY COMMENT ========================== */}
            {bonus && (
              <div className="collection-card-head">
                <div
                  className={`collection-card-title ${
                    key == 0 ? "active" : ""
                  }`}
                  onClick={() => setKey(0)}
                >
                  <span>抢红包</span>
                </div>
                <div
                  className={`collection-card-title ${
                    key == 1 ? "active" : ""
                  }`}
                  onClick={() => setKey(1)}
                >
                  <span>每月礼金</span>
                </div>
                <div
                  className={`collection-card-title ${
                    key == 2 ? "active" : ""
                  }`}
                  onClick={() => setKey(2)}
                >
                  <span>升级礼金</span>
                </div>
                <div
                  className={`collection-card-title ${
                    key == 3 ? "active" : ""
                  }`}
                  onClick={() => setKey(3)}
                >
                  <span>生日礼金</span>
                </div>
              </div>
            )}

            <div className="collection-card-body">
              {bonus ? (
                <div className={`collection-tabs col-tabs${key}`}>
                  <div className={`col-tab ${key == 0 ? "active" : ""}`}>
                    <div className="col-bonus-box-wrap">
                      <div className="col-bonus-box-icon">
                        <i className="grab" />
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

                        <div className="col-pao-box-clip" />

                        {!grab && !yuan && (
                          <div
                            className="col-pao-box-chip"
                            onClick={() => {
                              setYuan(true);
                              setTimeout(() => {
                                receiveBonus("gid1908");
                              }, 2000);
                              setTimeout(() => {
                                setGrab(true);
                                setYuan(false);
                              }, 2500);
                            }}
                          >
                            抢红包
                          </div>
                        )}
                        {yuan && !success ? (
                          <div className="col-pao-box-yuan" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className={`col-tab ${key == 1 ? "active" : ""}`}>
                    <div className="col-bonus-box-wrap">
                      <div className="col-bonus-box-icon">
                        <i className="monthly" />
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
                          <span
                            onClick={
                              bonus.gid1906 == 0
                                ? () => null
                                : () => {
                                    receiveBonus("gid1906");
                                    setMonthly(true);
                                  }
                            }
                          >
                            申请
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`col-tab ${key == 2 ? "active" : ""}`}>
                    {UpgradeBonus &&
                      map(UpgradeBonus, (obj, i) => {
                        const identifier = upgradeData[i];
                        return (
                          <CardItem
                            key={i}
                            label={`VIP${obj}升级礼金`}
                            value={bonus[identifier]}
                            className={
                              bonus[identifier] && bonus[identifier] !== "0.00"
                                ? "active"
                                : ""
                            }
                            onClick={() => {
                              receiveBonus(identifier);
                            }}
                          />
                        );
                      })}
                  </div>
                  <div className={`col-tab ${key == 3 ? "active" : ""}`}>
                    <div className="col-bonus-box-wrap">
                      <div className="col-bonus-box-icon">
                        <i className="gift" />
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
                          <span
                            onClick={
                              bonus.gid1907 == 0
                                ? () => null
                                : () => {
                                    receiveBonus("gid1907");
                                    setGift(true);
                                  }
                            }
                          >
                            申请
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-transactions">
                  <div className="image-box" />
                  <span>暂无记录</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UIAlertSA onClose={() => null} shown={success}>
        <div className={`game-sa-overlay`}>
          <div className="overlay-layer">
            <div className="form response">
              <div className="form-head">
                <i />
                <h2>恭喜您 领取成功</h2>
              </div>
              <div className="form-body">
                <button onClick={() => setSuccess(false)}>确认</button>
              </div>
            </div>
          </div>
        </div>
      </UIAlertSA>
    </Wrap>
  );
};

export default withAuth(Collection, 1);
