import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { map } from "lodash";

import { Wrap } from "../view/profile/";

import "../assets/scss/PromoHistory.scss";

import api from "../../service/api";
import { User } from "../../service";

import { getAuthKey } from "../../util";
import { withAuth } from "../util/";

const CardItem = (props) => {
  const { label, time, value, status, className } = props;
  return (
    <div className={`promo-history-card-item ${className ? className : ""}`}>
      <div className="cl-item promo-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      {value && (
        <div className="cl-item promo-history-card-value">
          <p className="cl-card-amount">
            金额: <span>{value}</span>
          </p>
          <p className={`cl-card-status ${status ? "success" : "failure"}`}>
            <span> {status ? "成功" : "失败"}</span>
          </p>
        </div>
      )}
    </div>
  );
};

const PromoHistory = () => {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetch = () => {
      // console.log(User.read())

      const response = api.post("newpwa/ajax_data.php", {
        ...User.read(),
        auth: getAuthKey(),
        record_type: "promotion",
        type: "record_list",
        // id: 2264
      });

      response.promise.then(
        (result) => {
          // console.log(result);
          if (result.status === 1) {
            setItems(result.info);
            setLoad(false);
          }
        },
        (e) => {
          console.log("Unable to response:", e);
        }
      );
    };
    fetch();
  }, [load]);

  const history = useHistory();

  return (
    <Wrap
      className="promo-history-wrap"
      centerName="优惠记录"
      sublevel={[true, () => history.goBack()]}
    >
      <div className="promo-history-wrap-inner">
        <div className="promo-history-wrap-inner-content">
          <div className="promo-history-card">
            <div className="promo-history-card-head">
              <div className="promo-history-card-title">
                <span>最近30天</span>
                <i
                  className={load ? "reload" : ""}
                  onClick={() => setLoad(true)}
                />
              </div>
            </div>

            <div className="promo-history-card-body">
              {/* ITEM */}
              {items && items.length > 0 ? (
                map(items, (obj, i) => {
                  return (
                    <CardItem
                      key={i}
                      label={obj.title}
                      time={obj.addTime}
                      value={obj.promMoney}
                      status={true}
                    />
                  );
                })
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
    </Wrap>
  );
};

export default withAuth(PromoHistory, 1);
