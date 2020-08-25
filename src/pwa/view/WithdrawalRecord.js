import React from "react";
import { useHistory } from "react-router-dom";

import { Wrap } from "../view/profile/";

import "../assets/scss/TransferRecord.scss";

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
        <p className={`cl-card-status ${status ? "success" : "failure"}`}>
          <span> {status ? "成功" : "失败"}</span>
        </p>
      </div>
    </div>
  );
};

const TransferRecord = () => {
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
                <i />
                <i />
              </div>
            </div>

            <div className="transfer-record-card-body">
              {/* ITEM */}
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"5"}
                status={true}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"200"}
                status={false}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"100"}
                status={true}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"50"}
                status={true}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"150"}
                status={false}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"300"}
                status={true}
              />
              <CardItem
                label={"主钱包"}
                subLabel={"IM电竞"}
                time={"2020-05-30 16:43:20"}
                value={"200"}
                status={true}
              />
              {/* ITEM */}
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default TransferRecord;
