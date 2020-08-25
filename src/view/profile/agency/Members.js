import React, { useState, useEffect } from "react";

import Wrap from "../Wrap";
import { Service } from "../";

import "../../../assets/scss/profile/agency/Members.scss";

const Members = () => {
  const [members, setMembers] = useState({
    status: 0,
    list: [],
  });

  useEffect(() => {
    const q = Service.Agency.members();

    q.promise.then(
      (r) => {
        setMembers((m) => ({
          ...m,
          status: 1,
          list: r.info.map((m) => m),
        }));

        // console.info(r);
      },
      (e) => {
        if (!e.is_aborted) {
          console.warn(e);
        }
      }
    );

    return () => q.cancel();
  }, []);

  return (
    <Wrap title="会员名单" className="members-desktop">
      <div className="members-inner">
        <div className="card-head">
          <div className="card-title">
            <span className="active">账号</span>
            <span>注册日期</span>
          </div>
        </div>

        <div className="card-body">
          {members.list && members.list.length > 0 ? (
            members.list.map((member, i) => (
              <div key={i} className="card-item">
                <span>{member.account}</span>
                <span>{member.regTime}</span>
              </div>
            ))
          ) : (
            <div className="no-transactions">
              <div className="image-box" />
              <span>暂无记录</span>
            </div>
          )}
        </div>
      </div>
    </Wrap>
  );
};

export default Members;
