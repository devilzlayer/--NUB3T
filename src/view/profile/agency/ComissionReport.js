import React, { useState, useEffect } from "react";

import Wrap from "../Wrap";
import { Service } from "../";

import "../../../assets/scss/profile/agency/ComissionReport.scss";

const ComissionReport = () => {
  const [reports, setReports] = useState({
    status: 0,
    list: [],
  });

  useEffect(() => {
    const req = Service.Agency.report({
      ty: "1",
    });

    req.promise.then(
      (r) => {
        // console.info(r);

        setReports({
          status: 1,
          list: r.info.map((r) => r),
        });
      },
      (e) => {
        if (!e.is_aborted) {
          console.warn(e);
        }
      }
    );

    return () => req.cancel();
  }, []);

  return (
    <Wrap title="佣金报告" className="comission-report-desktop">
      <div className="card-head">
        <div className="card-title">
          <span className="active">名称</span>
          <span>代理商</span>
          <span>量</span>
          <span>时间</span>
        </div>
      </div>
      <div className="card-body">
        {reports.list && reports.list.length > 0 ? (
          reports.list.map((report, i) => (
            <div key={i} className="card-item">
              <span>{report.agent_name}</span>
              <span>{report.real_name}</span>
              <span>{report.amount}</span>
              <span>{report.verify_time}</span>
            </div>
          ))
        ) : (
          <div className="no-transactions">
            <div className="image-box" />
            <span>暂无记录</span>
          </div>
        )}
      </div>
    </Wrap>
  );
};

export default ComissionReport;
