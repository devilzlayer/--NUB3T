import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { map, filter } from "lodash";
import * as moment from "moment";

import { Wrap } from "../view/profile/";

import "../assets/scss/WithdrawalHistory.scss";

// import api from "../../service/api";
import { User, Transaction } from "../../service";

import { toDate } from "../../util";
import { withAuth } from "../util/";

const CardItem = (props) => {
  // console.log(props)
  const {
    label,
    time,
    value,
    status,
    index,
    className,
    obj,
    onSetKey,
    setKey,
  } = props;
  //成功 SUCCESS
  //失败 FAILURE
  //未审核 UNREVIEWED
  //出款中 WITHDRAWING
  //已审核 AUDITED
  //汇款中 REMITTANCE

  let statusText = "";
  let classStatus = "";
  let cancel = false;
  let fail = false;
  if (status === "成功") {
    statusText = "成功";
    classStatus = "success";
  }

  if (status === "失败") {
    statusText = "失败";
    classStatus = "failure";
    fail = true;
  }

  if (status === "未审核") {
    statusText = "未审核";
    classStatus = "unreviewed";
    cancel = true;
  }

  if (status === "出款中") {
    statusText = "出款中";
    classStatus = "withdrawing";
  }

  if (status === "汇款中") {
    statusText = "汇款中";
    classStatus = "remittance";
  }

  // if(status === "已审核"){
  // 	statusText = "已审核"
  // 	classStatus = "audited"
  // }

  return (
    <div
      className={`withdrawal-history-card-item ${className ? className : ""}`}
    >
      <div className="cl-item withdrawal-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item withdrawal-history-card-value">
        {cancel && (
          <span className="cancel" onClick={() => props.onCancel(obj)}>
            取消提款
          </span>
        )}
        <p className="cl-card-amount">
          金额: <span>{value}</span>
        </p>
        <p className={`cl-card-status ${classStatus}`}>
          <span>
            {statusText}
            {fail && (
              <span className="fail" onClick={() => onSetKey(index)}>
                {setKey === index && <span>{obj.verifyComment}</span>}
                <i />
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

const WithdrawalHistory = () => {
  const [key, setKey] = useState(null);

  const [items, setItems] = useState({
    status: 0,
    list: [],
  });
  const [load, setLoad] = useState(false);

  const [range, setRange] = useState("today");
  const [customRange, setCustomRange] = useState({
    from: moment().subtract(30, "days").toDate(),
    to: moment().toDate(),
  });

  useEffect(() => {
    const fetch = () => {
      const response = Transaction.read({
        ...User.read(),
        record_type: "debit",
      });

      response.promise.then(
        (result) => {
          console.log(result);
          if (result.status === 1) {
            setItems(result.info);
            setItems({
              status: 1,
              list: result.info.map((t) => ({
                ...t,
                ts: toDate(t.requestTime, true),
              })),
            });
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

  const onCancel = async (w) => {
    console.log(w);
    // const r = await Service.User.withdrawCancel({ id: w.id }).promise;
    const response = await User.withdrawCancel({ id: w.id }).promise;
    // console.log(response);
    if (response.status === 1) {
      setLoad(true);
    }
  };

  const onSetKey = (value) => {
    setKey(null);
    if (key !== value) setKey(value);
  };

  const history = useHistory();

  const __withdraws = useMemo(() => {
    const _rangeMap = {
      today: () => {
        const today = moment();
        return [today.startOf("day").unix(), today.endOf("day").unix()];
      },
      yesterday: () => {
        const yesterday = moment().subtract(1, "days");
        return [yesterday.startOf("day").unix(), yesterday.endOf("day").unix()];
      },
      week: () => {
        return [
          moment().subtract(1, "weeks").startOf("day").unix(),
          moment().endOf("day").unix(),
        ];
      },
      month: () => {
        return [
          moment().subtract(30, "days").startOf("day").unix(),
          moment().endOf("day").unix(),
        ];
      },
      custom: () => {
        let { from, to } = customRange;
        return [
          moment(from).startOf("day").unix(),
          moment(to).endOf("day").unix(),
        ];
      },
    };

    const [from, to] = _rangeMap[range]();

    // return withdraws.list.filter((t) => t.ts >= from && t.ts < to);
    return filter(items.list, (t) => t.ts >= from && t.ts < to);
  }, [items.list, customRange, range]);

  // console.log(items.list > 0)

  return (
    <Wrap
      className="withdrawal-history-wrap"
      centerName="提款记录"
      sublevel={[true, () => history.goBack()]}
    >
      <div className="withdrawal-history-wrap-inner">
        <div className="withdrawal-history-wrap-inner-content">
          <div className="withdrawal-history-card">
            <div className="withdrawal-history-card-head">
              <div className="withdrawal-history-card-title">
                <span>最近30天</span>
                <i
                  className={load ? "reload" : ""}
                  onClick={() => setLoad(true)}
                />
              </div>
            </div>

            <div className="withdrawal-history-card-body">
              {/* ITEM */}
              {items.list ? (
                map(items.list, (obj, i) => {
                  return (
                    <CardItem
                      obj={obj}
                      key={i}
                      index={i}
                      label={obj.cardNumber}
                      time={obj.requestTime}
                      value={obj.amount}
                      status={obj.status}
                      onCancel={(val) => onCancel(val)}
                      onSetKey={(val) => onSetKey(val)}
                      setKey={key}
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

export default withAuth(WithdrawalHistory, 1);
