import React, { useState, useEffect } from "react";
import cx from "classnames";
import QRCode from "react-qr-code";

import Wrap from "../Wrap";
import { Service } from "../";
import { withAuth } from "../../../util";

import "../../../assets/scss/profile/agency/QR.scss";

const QR = () => {
  const [qr, setQr] = useState({
    status: 0,
    link: "",
  });

  useEffect(() => {
    const req = Service.Agency.qr();

    req.promise.then((r) => {
      console.log(r)
        setQr({
          status: 1,
          link: r.info,
        });
    },(e) => {
        if (!e.is_abort) {
          console.warn(e);
        }
    });

    return () => req.cancel();
  }, []);

  return (
    <Wrap title="代理推广" className="qr-desktop">
      <div className="profile-section section-box">
        <div className="qr-inner">
          <h1>我的推广链接</h1>
          <div
            className={cx("qr-wrap", "with-loader", { loading: !qr.status })}
          >
            <div className="load-spin"></div>
            {qr.link ? <QRCode value={qr.link} size={185} /> : null}
          </div>
          <p>我的推广二维码</p>
        </div>
      </div>
    </Wrap>
  );
};

export default withAuth(QR, 1);
