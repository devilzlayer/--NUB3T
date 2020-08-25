import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { map } from "lodash";
import { Wrap } from "../view/profile/";

import "../assets/scss/DepositHistory.scss";

import api from "../../service/api";
import User from "../../service/User";

import { getAuthKey } from "../../util";
import { withAuth } from "../util/";


const CardItem = (props) => {
  const { label, time, value, status, className } = props;
  return (
    <div className={`deposity-history-card-item ${className ? className : ""}`}>
      <div className="cl-item deposity-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item deposity-history-card-value">
        <p className="cl-card-amount">
          金额: <span>{value}</span>
        </p>
        <p
          className={`cl-card-status ${
            status === "成功" ? "success" : "failure"
          }`}
        >
          {/* <span>	{status? "成功" : "失败"}</span> */}
          <span>{status}</span>
        </p>
      </div>
    </div>
  );
};

const DepositHistory = () => {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetch = () => {
      // console.log(User.read())

      const response = api.post("newpwa/ajax_data.php", {
        ...User.read(),
        auth: getAuthKey(),
        record_type: "deposit",
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

  // console.log(items)
  const history = useHistory();

  return (
    <Wrap
      className="deposity-history-wrap"
      centerName="存款记录"
      sublevel={[true, () => history.goBack()]}
    >
      <div className="deposity-history-wrap-inner">
        <div className="deposity-history-wrap-inner-content">
          <div className="deposity-history-card">
            <div className="deposity-history-card-head">
              <div className="deposity-history-card-title">
                <span>最近30天</span>
                <i
                  className={load ? "reload" : ""}
                  onClick={() => setLoad(true)}
                />
              </div>
            </div>

            <div className="deposity-history-card-body">
              {items && items.length > 0 ? (
                map(items, (obj, i) => {
                  return (
                    <CardItem
                      key={i}
                      label={obj.payType}
                      time={obj.endTime}
                      value={obj.amount}
                      status={obj.status}
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

export default withAuth(DepositHistory, 1);
