import React, { useEffect, useState } from "react";

import Wrap from "./Wrap";

import DeposityHistory from "./transferhistory/deposityhistory";
import WithdrawalHistory from "./transferhistory/withdrawalhistory";
import TransferRecord from "./transferhistory/transferrecord";
import PromoHistory from "./transferhistory/promohistory";
import RebateHistory from "./transferhistory/rebatehistory";

import "../../assets/scss/profile/TransferHistory.scss";

const TransferHistory = () => {
  const [key, setKey] = useState(0);
  const [load, setLoad] = useState(null);

  const onStop = () => {
    setLoad(null);
  };

  return (
    <Wrap className="profile-transfer-history" title={"交易记录"}>
      <div className="profile-desktop-tab">
        <div className="profile-desktop-tab-header">
          <div className="profile-desktop-tab-header-nav">
            <div className={`profile-desktop-tab-head-item`}>
              <span
                onClick={() => setKey(0)}
                className={key == 0 ? "active" : ""}
              >
                存款记录
              </span>
            </div>
            <div className={`profile-desktop-tab-head-item`}>
              <span
                onClick={() => setKey(1)}
                className={key == 1 ? "active" : ""}
              >
                提款记录
              </span>
            </div>
            <div className={`profile-desktop-tab-head-item`}>
              <span
                onClick={() => setKey(2)}
                className={key == 2 ? "active" : ""}
              >
                转账记录
              </span>
            </div>
            <div className={`profile-desktop-tab-head-item`}>
              <span
                onClick={() => setKey(3)}
                className={key == 3 ? "active" : ""}
              >
                优惠记录
              </span>
            </div>
            <div className={`profile-desktop-tab-head-item`}>
              <span
                onClick={() => setKey(4)}
                className={key == 4 ? "active" : ""}
              >
                反水记录
              </span>
            </div>
          </div>

          <div className="profile-desktop-tab-header-action">
            <span>最近30天</span>
            <i
              className={load !== null ? "reload" : ""}
              onClick={() => setLoad(key)}
            />
          </div>
        </div>
        <div className="profile-desktop-tab-body">
          <div
            className={`profile-desktop-tab-col ${key == 0 ? "active" : ""}`}
          >
            <DeposityHistory id={0} refresh={load} onStop={onStop} />
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 1 ? "active" : ""}`}
          >
            <WithdrawalHistory id={1} refresh={load} onStop={onStop} />
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 2 ? "active" : ""}`}
          >
            <TransferRecord id={2} refresh={load} onStop={onStop} />
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 3 ? "active" : ""}`}
          >
            <PromoHistory id={3} refresh={load} onStop={onStop} />
          </div>
          <div
            className={`profile-desktop-tab-col ${key == 4 ? "active" : ""}`}
          >
            <RebateHistory id={4} refresh={load} onStop={onStop} />
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default TransferHistory;
