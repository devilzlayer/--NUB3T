import React, { useState, useEffect } from "react";
import cx from "classnames";

import { Service } from "../";
import Wrap from "../Wrap";
import { Icon } from "../../../component";

import "../../../assets/scss/profile/agency/AgentReport.scss";

const AgentReport = () => {
  const [reports, setReports] = useState({
    status: 0,
    list: [],
  });

  useEffect(() => {
    const req = Service.Agency.report({
      ty: "2",
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

  const toggle = (report) => {
    report.details = !report.details;

    setReports((r) => ({
      ...r,
      list: r.list.map((r) => (r.id === report.id ? report : r)),
    }));
  };

  return (
    <Wrap title="代理商报告" className="agent-report-desktop">
      <div className="card-head">
        <div className="card-title">
          <span className="active">账号</span>
          <span>存款</span>
          <span>提款</span>
          <span>细节</span>
        </div>
      </div>
      <div className="card-body">
        {reports.list && reports.list.length > 0 ? (
          reports.list.map((report, i) => (
            <div key={i} className={"card-item"} onClick={() => toggle(report)}>
              <div className="inner">
                <span>{report.account}</span>
                <span>{report.deposit}</span>
                <span>{report.debit}</span>
                <span>
                  <div className="detail">
                    <table>
                      <tbody>
                        <tr>
                          <td>优惠:</td>
                          <td>{report.promotion}</td>
                        </tr>
                        <tr>
                          <td>反水:</td>
                          <td>{report.washcode}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </span>
              </div>
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

export default AgentReport;
