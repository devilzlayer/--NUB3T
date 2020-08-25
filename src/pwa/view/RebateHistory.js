import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { map } from "lodash";

import { Wrap } from "../view/profile/";

import "../assets/scss/RebateHistory.scss";

import api from "../../service/api";
import { User } from "../../service";

import { getAuthKey } from "../../util";
import { withAuth } from "../util/";

const CardItem = (props) => {
  const { label, time, value, ratio, status, className } = props;
  return (
    <div className={`rebate-history-card-item ${className ? className : ""}`}>
      <div className="cl-item rebate-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item rebate-history-card-value">
        <p className="cl-card-amount">
          返水金额: <span>{value}</span>
        </p>
        <p className="cl-card-status">
          {status} {ratio && <span>{ratio}</span>}
        </p>
      </div>
    </div>
  );
};

const RebateHistory = () => {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetch = () => {
      // console.log(User.read())

      const response = api.post("newpwa/ajax_data.php", {
        ...User.read(),
        auth: getAuthKey(),
        record_type: "washcode",
        type: "record_list",
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
      className="rebate-history-wrap"
      centerName="返水记录"
      sublevel={[true, () => history.goBack()]}
    >
      <div className="rebate-history-wrap-inner">
        <div className="rebate-history-wrap-inner-content">
          <div className="rebate-history-card">
            <div className="rebate-history-card-head">
              <div className="rebate-history-card-title">
                <span>最近30天</span>
                <i
                  className={load ? "reload" : ""}
                  onClick={() => setLoad(true)}
                />
              </div>
            </div>

            <div className="rebate-history-card-body">
              {/* ITEM */}
              {items && items.length > 0 ? (
                map(items, (obj, i) => {
                  return (
                    <CardItem
                      key={i}
                      label={obj.game_id}
                      time={obj.add_date}
                      value={obj.money}
                      ratio={obj.ratio}
                      status={"返水比例"}
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

export default withAuth(RebateHistory, 1);
