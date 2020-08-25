import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { map, truncate, replace, split, head, last } from "lodash";

import { Wrap } from "../view/profile/";

import "../assets/scss/TransferRecord.scss";

import api from "../../service/api";
import { User, Transaction } from "../../service";

import { getAuthKey } from "../../util";
import { withAuth } from "../util/";

const CardItem = (props) => {
  const { label, subLabel, time, value, status, className } = props;

  return (
    <div className={`transfer-record-card-item ${className ? className : ""}`}>
      <div className="cl-item transfer-record-card-text">
        <p className="cl-card-text">
          <span>{label}</span>
          {subLabel && <span>{subLabel}</span>}
        </p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item transfer-record-card-value">
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

const TransferRecord = () => {
  const [items, setItems] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const fetch = () => {
      // console.log(User.read())

      const response = api.post("newpwa/ajax_data.php", {
        ...User.read(),
        auth: getAuthKey(),
        record_type: "transfer",
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
      className="transfer-record-wrap"
      centerName="转账记录"
      sublevel={[true, () => history.goBack()]}
    >
      <div className="transfer-record-wrap-inner">
        <div className="transfer-record-wrap-inner-content">
          <div className="transfer-record-card">
            <div className="transfer-record-card-head">
              <div className="transfer-record-card-title">
                <span>最近30天</span>
                <i
                  className={load ? "reload" : ""}
                  onClick={() => setLoad(true)}
                />
              </div>
            </div>

            <div className="transfer-record-card-body">
              {/* ITEM */}
              {items && items.length > 0 ? (
                map(items, (obj, i) => {
                  let reg = split(obj.platName, "-->", 2);
                  return (
                    <CardItem
                      key={i}
                      index={i}
                      label={head(reg)}
                      subLabel={last(reg)}
                      time={obj.requestTime}
                      value={obj.amount}
                      status={obj.tranStatus}
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

export default withAuth(TransferRecord, 1);
