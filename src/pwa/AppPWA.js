import React, { useEffect , useContext } from "react";
import { Link, BrowserRouter, Switch, Route, Redirect , useLocation} from "react-router-dom";

import { User } from '../service';

import * as Views from "./view/";
import { MenuSA } from "./component/";

import "./assets/scss/App.scss";

const PageFrame = (props) => {
  const Component = props.component;

  return (
    <>
      <Component {...props} />
      <MenuSA />
    </>
  );
};

const AppPWA = () => {
  const { setUserAuthFN ,userAuth } = useContext(User.Context);

  function referralCheck(location) {
    const websites = ["https://www.xxx.com/"];
    const prevURL = document.referrer;
    const result = websites.filter((site) => site === prevURL);
    const agentName = new URLSearchParams(location.search).get("act");

    if (result.length > 0) {
      localStorage.setItem("referral", JSON.stringify("123"));
    } else if (agentName) {
      localStorage.setItem("referral", JSON.stringify(agentName));
    }
  }

  useEffect(() => {
    document.body.classList.add("body-pwa");

    return () => document.body.classList.remove("body-pwa");
  }, []);

  const onClick = (e) =>{
    if(!userAuth.data){
      setUserAuthFN(userAuth.status , userAuth.data , false)
    }
  }
  

  // console.log(userAuth)

  return (
    <div className="app-sa">
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => {
              referralCheck(props.location);
              return <PageFrame {...props} component={Views.Home} />;
            }}
          />
          <Route
            exact
            path="/promotions"
            render={() => <PageFrame component={Views.Promotions} />}
          />
          <Route
            exact
            path="/promotion/:id"
            render={() => <PageFrame component={Views.Promotion} />}
          />
          <Route
            path="/profile"
            render={() => <PageFrame component={Views.Profile} />}
          />
          <Route exact path="/login" component={Views.Login} />
          <Route exact path="/game/:id/:name" component={Views.Game} />
          <Route exact path="/inbox" component={Views.Inbox} />
          <Route exact path="/about" component={Views.About} />
          <Route exact path="/collection" component={Views.Collection} />
          <Route exact path="/feedback" component={Views.Feedback} />
          <Route
            exact
            path="/transaction-record"
            component={Views.TransactionRecord}
          />
          <Route exact path="/referral" component={Views.Referral} />
          <Route exact path="/speed-app" component={Views.SpeedApp} />
          <Route exact path="/join-us" component={Views.JoinUs} />
          <Route
            exact
            path="/deposit-history"
            component={Views.DepositHistory}
          />
          <Route exact path="/promo-history" component={Views.PromoHistory} />
          <Route
            exact
            path="/transfer-record"
            component={Views.TransferRecord}
          />
          <Route exact path="/rebate-history" component={Views.RebateHistory} />
          <Route
            exact
            path="/withdrawal-history"
            component={Views.WithdrawalHistory}
          />
          <Route exact path="/deposit-method" component={Views.DepositMethod} />
          <Route exact path="/news" component={Views.News} />
          <Route exact path="/vip" component={Views.Vip} />
          <Route exact path="/vip-details" component={Views.VipDetails} />
          <Redirect to="/" />
        </Switch>
        {userAuth.modal && 
          <div className="ticker-over-sa shown">
            <div className="ticker-over-sa-cont">
              <div className="ticker-over-sa--header">
                <h3>登录提醒</h3>
              </div>
              <div className="ticker-over-sa--body">
                <div className="ticker-text">
                  此功能仅对注册用户开放
                </div>
                <div className="ticker-button">
                  <button className="btn ticker-close" onClick={onClick}>关闭</button>
                  <Link to="/login" className="btn ticker-view" onClick={onClick} >查看全部</Link>
                </div>
              </div>
            </div>
          </div>
          }
      </BrowserRouter>
      


    </div>
  );
};

export default AppPWA;
