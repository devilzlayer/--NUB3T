import React, { useContext } from "react";
import { withAuth , getAuthKey } from "../util/";
import { User } from "../service";
import * as Section from "./profile/";
import { Link, Switch, Route, Redirect, useHistory } from "react-router-dom";

import "../assets/scss/Profile.scss";

const Profile = (props) => {
  const history = useHistory();
  const { setUserAuthFN, userAuth } = useContext(User.Context);

  // console.log(userAuth)
  const onClick = (e) => {
    setUserAuthFN(userAuth.status, userAuth.data, false);
  };

  const onDeposit = () =>{
    const { data : { account } } = userAuth
  // console.log(userAuth)

    const auth = getAuthKey();
    window.location.href = `https://sghsrthth9i9.u2d12345.com/newpwa/deposit.php?account=${account}&auth=${auth}`;

  }

  const {
    location: { pathname },
  } = history;

  return (
    <div className="profile-wrap desktop">
      <div className="profile-wrap-inner">
        <aside>
          <div className="profile-side-tab">
            <div className="profile-side-tab-title">财务中心</div>
            <div className="profile-side-tab-list">
              <div className="profile-side-tab-items" onClick={onDeposit}>
                <i className="deposit" /> 充值
              </div>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/transfer" ? "active" : ""
                }`}
                to="/profile/transfer"
              >
                <i className="transfer" /> 转账
              </Link>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/withdraw" ? "active" : ""
                }`}
                to="/profile/withdraw"
              >
                <i className="withdraw" /> 提款
              </Link>
            </div>
          </div>

          <div className="profile-side-tab">
            <div className="profile-side-tab-list">
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/transaction-record" ? "active" : ""
                }`}
                to="/profile/transaction-record"
              >
                <i className="transaction-record" /> 交易记录
              </Link>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/collection" ? "active" : ""
                }`}
                to="/profile/collection"
              >
                <i className="collection" /> 优惠领取
              </Link>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/referral" ? "active" : ""
                }`}
                to="/profile/referral"
              >
                <i className="referral" /> 邀请奖励
              </Link>
            </div>
          </div>

          <div className="profile-side-tab">
            <div className="profile-side-tab-title">个人中心</div>
            <div className="profile-side-tab-list">
              {/* <div className="profile-side-tab-items ">
                <i className="personal" /> 个人设置
              </div> */}
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/join-us" ? "active" : ""
                }`}
                to="/profile/join-us"
              >
                <i className="joinus" /> 加入我们
              </Link>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/about" ? "active" : ""
                }`}
                to="/about"
              >
                <i className="about" /> 关于我们
              </Link>
              <Link
                className={`profile-side-tab-items ${
                  pathname == "/profile/speed-app" ? "active" : ""
                }`}
                to="/profile/speed-app"
              >
                <i className="speedapp" /> 极速APP
              </Link>
              <Link className={`profile-side-tab-items ${
                  pathname == "/profile/feedback" ? "active" : ""
                }`}
                to="/profile/feedback">
                <i className="feedback" /> 意见反馈
              </Link>
            </div>
          </div>

          {userAuth.data && userAuth.data.is_agent === "1" ? (
            <div className="profile-side-tab">
              <div className="profile-side-tab-list">
                <Link
                  className={`profile-side-tab-items ${
                    pathname == "/profile/agency/qr" ? "active" : ""
                  }`}
                  to="/profile/agency/qr"
                >
                  <i className="qr" /> 代理推广
                </Link>
                <Link
                  className={`profile-side-tab-items ${
                    pathname == "/profile/agency/agent-report" ? "active" : ""
                  }`}
                  to="/profile/agency/agent-report"
                >
                  <i className="agent-report" /> 代理商报告
                </Link>
                <Link
                  className={`profile-side-tab-items ${
                    pathname == "/profile/agency/comission-report"
                      ? "active"
                      : ""
                  }`}
                  to="/profile/agency/comission-report"
                >
                  <i className="comission-report" /> 佣金报告
                </Link>
                <Link
                  className={`profile-side-tab-items ${
                    pathname == "/profile/agency/members" ? "active" : ""
                  }`}
                  to="/profile/agency/members"
                >
                  <i className="members" /> 会员名单
                </Link>
              </div>
            </div>
          ) : null}
        </aside>
        <section>
          <Switch>
            <Route exact path="/profile" component={Section.Landing} />
            <Route path="/profile/transfer" component={Section.Transfer} />
            <Route path="/profile/withdraw" component={Section.Withdrawal} />
            <Route path="/profile/inbox" component={Section.Inbox} />
            <Route path="/profile/collection" component={Section.Collection} />
            <Route path="/profile/referral" component={Section.Referral} />
            <Route path="/profile/personal" component={Section.Referral} />
            <Route path="/profile/join-us" component={Section.JoinUs} />
 
            <Route path="/profile/speed-app" component={Section.SpeedApp} />
            <Route path="/profile/feedback" component={Section.Feedback} />

            <Route path="/profile/transaction-record" component={Section.TransferHistory} />
  
            {userAuth.data && userAuth.data.is_agent === "1" && [
                <Route key="QR" path="/profile/agency/qr" component={Section.QR} />,
                <Route key="AgentReport" path="/profile/agency/agent-report" component={Section.AgentReport} />,
                <Route key="ComissionReport" path="/profile/agency/comission-report" component={Section.ComissionReport} />,
                <Route key="Members" path="/profile/agency/members" component={Section.Members} />,
              ]
            }
            <Redirect to="/profile" />

          </Switch>

          {userAuth.modal && !userAuth.modal.csr && (
            <div className="desktop-ticker-over">
              <div className="desktop-ticker-over-cont">
                <div className="desktop-ticker-over--header">
                  {userAuth.modal.success && <i />}
                  <h3>{userAuth.modal.text}</h3>
                </div>
                <div className="desktop-ticker-over--body">
                  {userAuth.modal.message && (
                    <div className="d-ticker-text">
                      {userAuth.modal.message}
                    </div>
                  )}
                  <div className="d-ticker-button">
                    <button className="btn ticker-close" onClick={onClick}>
                      确认
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {userAuth.modal && userAuth.modal.csr && (
            <div className="desktop-ticker-over csr" onClick={onClick}>
              <div className="desktop-ticker-over-cont">
                <div className="desktop-ticker-over--header">
                  <h3>请注意 </h3>
                  <i />
                </div>
                <div className="desktop-ticker-over--body">
                    <div className="d-ticker-text">
                      <i/>
                      <p>如需更改此信息请联系客服协助</p>
                      <p>谢谢</p>
                    </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default withAuth(Profile, 1);
