import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import QRCode from "react-qr-code";

import { Wrap } from "../view/profile/";
import { User, Transaction } from "../../service/";
import { withAuth } from "../util/";
import ToolTip from "../component/ToolTip";

import "../assets/scss/Referral.scss";
import { UIAlertSA } from "../component";

const Referral = () => {
  const history = useHistory();
  const [tool, setTool] = useState(false);
  const [modal, setModal] = useState("");

  const { account } = User.read();

  const qrLink = `${window.location.origin}/?act=${account}`;

  const copyToClipboard = (e) => {
    // navigator.clipboard.writeText(qrLink);
    const el = document.createElement("textarea");
    el.value = qrLink;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setTool(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setTool(false);
    }, 3000);
  }, [tool]);

  const [agents, setAgents] = useState([]);

  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const response = Transaction.read({
      record_type: "agent",
      ...User.read(),
    });
    response.promise.then(
      (r) => {
        console.log("Referral Agent List", r);
        setAgents(r.info);
      },
      (e) => {
        console.log("Unable to get records:", e);
      }
    );

    const res = Transaction.read({
      record_type: "promotions",
      ...User.read(),
    });
    res.promise.then(
      (r) => {
        console.log("Referral Promotions List", r);
        setPromotions(r.info);
      },
      (e) => {
        console.log("Unable to get records:", e);
      }
    );
  }, []);

  function referral(account, regTime) {
    const req = User.referralGift({
      act: "applyFriendsPro",
      acc: account,
      regTime: regTime,
      ...User.read(),
    });

    req.promise.then(
      (r) => {
        console.log("Referral Success!");
        setModal(r.message);
      },
      (e) => {
        console.log("Referral Fail!", e);
        setModal(e);
      }
    );
  }

  return (
    <Wrap
      className="referral-wrap"
      centerName="邀请奖励"
      faq={false}
      sublevel={[true, () => history.goBack()]}
    >
      <div className="referral-wrap-inner">
        <div className="referral-wrap-content">
          <div className="referral-link-caption">您的专属推荐链接及二维码:</div>
          <div className="referral-banner-wrap">
            <div className="referral-banner" />
          </div>

          <div className="referral-link-text">
            <p>{qrLink}</p>
            <div className="module-border-wrap" onClick={copyToClipboard}>
              <div className="module">
                <ToolTip show={tool} />
                <span>复制链接</span>
              </div>
            </div>
          </div>

          <div className="referral-qr-code-wrap">
            <div className="referral-qr-code-image">
              <QRCode value={qrLink} size={155} />
            </div>
            <div className="referral-qr-code-text">
              <p>他人扫一扫二维码即可成为您的推荐好友</p>
              <p className="special">请使用浏览器扫描二维码(如UC,QQ等浏览器)</p>
            </div>
          </div>

          <div className="referral-tab">
            <div className="referral-tab-caption">好友注册记录</div>
            <div className="referral-tab-wrap">
              <div className="referral-tab-head">
                <div className="referral-tab-text">
                  <span>好友账号</span>
                </div>
                <div className="referral-tab-text">
                  <span>注册时间</span>
                </div>
                <div className="referral-tab-text smaller">
                  <span>操作</span>
                </div>
              </div>

              {agents.length !== 0 ? (
                agents.map(({ regTime, account }, i) => (
                  <div className="referral-tab-body" key={i}>
                    <div className="referral-tab-text">
                      <span>{account}</span>
                    </div>
                    <div className="referral-tab-text">
                      <span>{regTime}</span>
                    </div>
                    <div
                      className="referral-tab-text special smaller"
                      onClick={() => referral(account, regTime)}
                    >
                      <span>申请礼金</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="referral-tab-body">
                  <div className="referral-tab-text large">
                    <span>暂无记录</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="referral-tab">
            <div className="referral-tab-caption">好友推荐彩金申请记录 </div>
            <div className="referral-tab-wrap">
              <div className="referral-tab-head">
                <div className="referral-tab-text xs">
                  <span>彩金</span>
                </div>
                <div className="referral-tab-text smaller">
                  <span>好友账号</span>
                </div>
                <div className="referral-tab-text smaller">
                  <span>申请状态</span>
                </div>
                <div className="referral-tab-text medium">
                  <span>申请时间</span>
                </div>
                <div className="referral-tab-text xs">
                  <span>备注</span>
                </div>
              </div>

              {promotions.length !== 0 ? (
                promotions.map((data, i) => (
                  <div className="referral-tab-body" key={i}>
                    <div className="referral-tab-text xs">
                      <span>{data.apply_money}</span>
                    </div>
                    <div className="referral-tab-text smaller">
                      <span>{data.invite_person}</span>
                    </div>
                    <div className="referral-tab-text smaller">
                      <span>{data.state}</span>
                    </div>
                    <div className="referral-tab-text medium">
                      <span>{data.add_time}</span>
                    </div>
                    <div className="referral-tab-text xs">
                      <span>{data.check_info ? data.check_info : "--"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="referral-tab-body">
                  <div className="referral-tab-text large">
                    <span>暂无记录</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UIAlertSA onClose={() => null} shown={modal}>
        <div className={`game-sa-overlay`}>
          <div className="overlay-layer">
            <div className="form response">
              <div className="form-head">
                <h2>提示</h2>
              </div>
              <div className="form-body">
                {modal}
                <button onClick={() => setModal("")}>确认</button>
              </div>
            </div>
          </div>
        </div>
      </UIAlertSA>
    </Wrap>
  );
};

export default withAuth(Referral, 1);
