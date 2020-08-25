import React, { useEffect, useState, useContext } from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import moment from "moment";
import { find } from "lodash";
import * as Section from "./profile/";
import { User, Inbox, Transaction } from "../../service/";
import { withAuth } from "../util/";
import { UIAlertSA } from "../component/";
import { vipProgress } from "./vip/values";
import { getAuthKey } from "../../util";

import "../assets/scss/ProfileSA.scss";
import "react-image-crop/lib/ReactCrop.scss";

import CropDemo from "./profile/UploadAvatar";
import { avatarClass, MenuItem } from "./profile/options";

function Menu(props) {
  const { setUserAuthFN ,userAuth } = useContext(User.Context);
  const userData = User.read();

  const [inboxCount, setInboxCount] = useState(0);

  const [vipDays, setVipDays] = useState(0);
  const [vipCount, setVipCount] = useState(0);
  const [vipLevel, setVipLevel] = useState(1);
  const [vipAmount, setVipAmount] = useState(0.0);
  const [viProgVal, setViProgVal] = useState(0);

  const [avatar, setAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [customURL, setCustomURL] = useState();
  const [imageSource, setImageSource] = useState();

  function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good;
    img.onerror = bad;
    img.src = imageSrc;
  }

  useEffect(() => {
    if(userData && userData.username){
      const response = Transaction.read({
        ...User.read(),
        type: "get_imgurl",
      });
      response.promise.then(r => {
        // console.log(r)
        if(r.info){
          const URL = `https://u2daszapp.u2d8899.com/newpwa/${r.info}`;
          setCustomURL(URL);
        }
        
      }, e =>{
        console.log('No Image found')
      })

    }
    
  }, [customURL]);



  useEffect(() => {
    const q = Inbox.count();
    q.promise.then(
      (r) => {
        setInboxCount(+r.info);
      },
      (e) => {
        if (!e.is_aborted) {
          console.info(e);
        }
      }
    );
    return () => q.cancel();
  }, []);

  useEffect(() => {
    const response = Transaction.read({
      ...User.read(),
      type: "get_vip_level",
    });

    response.promise.then(
      (r) => {
        // console.log(r);

        if (r.status === 1) {
          const vlvp = Number(r.info.viplevel);
          const vamn = Number(r.info.accountnum);
          setVipCount(vlvp);
          setVipLevel(vlvp);
          const vpP = find(vipProgress, (obj) => obj.level === vlvp);
          setVipAmount(vpP.amount - vamn);
          const valPer = (vamn * 100) / vpP.amount;
          setViProgVal(valPer);

          if (vlvp < 10) {
            setVipLevel(Number(vlvp) + 1);
          }
        }
      },
      (e) => {}
    );

    // console.log( )
    if(userAuth && userAuth.data){
      var a = moment(userAuth.data.regTime).format("MM/DD/YYYY");
      var b = moment();
      var diffDays = b.diff(a, "days");
      setVipDays(diffDays);
    }
    
  }, []);

  const logout = async () => {
    await User.logout();

    props.history.push('login')
    // console.log(props)
    // window.location.reload();
  };

  function toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const Avatar = ({ className, url }) => (
    <i
      className={className}
      onClick={() => {
        setSelectedAvatar(className);
        toDataURL(url, function (dataUrl) {
          updateCustomPhoto(dataUrl, "url");
        });
      }}
    >
      <span className={selectedAvatar === className ? "active-avatar" : ""} />
    </i>
  );

  function onChangeAvatar(e) {
    if (e.target.files[0] > 200000) {
      console.warn("File is too big!");
    } else {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setImageSource(fileReader.result);
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  }

  function updateCustomPhoto(file, text) {
    const imageFile = file;
    const blob = window.URL.createObjectURL(file);
    if (file.constructor === Blob) {
      const data = new FormData();
      data.append("file", imageFile, "sam.jpg");
      data.append("username", userData.username);
      data.append("account", userData.account);
      data.append("password", userData.password);
      data.append("auth", getAuthKey());
      data.append("type", "upload_pictures");

      const res = Transaction.read({
        body: data,
        type: "upload_pictures",
      });
      res.promise.then(
        (r) => {
          console.log("Upload sucessful", r);
          // requestAvatar()
          setCustomURL(blob);
          localStorage.setItem("avatar", JSON.stringify(blob));

          if (text === "custom") {
            setImageSource("");
            setAvatar(false);
          }
          // window.location.reload();
        },
        (e) => {
          console.log("Upload failed", e);
        }
      );
    }
  }

  // console.log(userAuth)

  const onSetAvatar = () =>{
    if(!userAuth.data){
      logout()
      return false
    }
    setAvatar(true)
  }

  const onClick = (e) =>{
    if(!userAuth.data){
      e.preventDefault()
      setUserAuthFN(userAuth.status , userAuth.data , true)
    }
  }


  
  return (
    <div className="profile-sa">
      {/* ============ EDIT ============ */}
      <div className="profile-sa-header">
        <div className="profile-sa-header-wrap">
          <div className="profile-sa-header-content">
            <div className="profile-sa-info-content">
              <div
                className="profile-sa-avatar"
                onClick={onSetAvatar}
              >
                <div
                  className={`${customURL ? "avatar" : "default"}`}
                  style={{
                    backgroundImage: customURL ? `url(${customURL})` : null,
                  }}
                />
              </div>
              <div className="profile-sa-text">
                <p>
                  <label>{userAuth.data && userAuth.data.account}</label>
                  <span className={`vip-badge-${vipCount}`} />
                </p>
                <span>
                  加入U体育<span>{vipDays}</span>天
                </span>
                <div className="profile-sa-bar-wrap">
                  <div className="profile-bar">
                    <span style={{ width: `${viProgVal}%` }} />
                  </div>
                  <span>VIP{vipLevel}</span>

                  <Link className="profile-vip" to={"/vip"} onClick={onClick}>
                    <i />
                    VIP详情
                  </Link>
                </div>
                <span>
                  升级还差¥ <span>{vipAmount}</span>元流水
                </span>
              </div>
            </div>
            <div className="profile-sa-widget">
              <div className="profile-sa-widget-wrap">
                {userAuth.data && 
                <div className="profile-sa-widget-value">
                  <span>中心:</span>
                  <p>
                    <span>￥</span>
                    {userAuth.data.balance}
                  </p>
                </div>
                }
                
                <div className="profile-sa-hr" />

                <div className="profile-sa-widget-list">
                  <Link className="profiel-sa-widget-item" to={"/profile/deposit?a=1"} onClick={onClick} target="_blank">
                    <i className="topup" />
                    <span>充值</span>
                  </Link>
                  <Link className="profiel-sa-widget-item" to={"/profile/transfer"} onClick={onClick}>
                    <i className="transfer" />
                    <span>转账</span>
                  </Link>
                  <Link className="profiel-sa-widget-item" to={"/profile/withdraw"} onClick={onClick}>
                    <i className="withdraw" />
                    <span>提款</span>
                  </Link>
                  <Link className="profiel-sa-widget-item" to={"/inbox"} onClick={onClick}>
                    <i className="information">
                      {inboxCount ? (
                        <span className="count">{inboxCount}</span>
                      ) : null}
                    </i>
                    <span>信息</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ============ EDIT ============ */}

      <div className={`profile-sa-content ${!userAuth.data ? 'not' : '' }`}>
        <div className="profile-sa-menu">
          <MenuItem className="n5 betting-history" to="/transaction-record" name="交易记录" onClick={onClick} />
          <MenuItem className="n tag collection" to="/collection" name="优惠领取" onClick={onClick}/>
          <MenuItem className="n reward" to="/referral" name="邀请奖励" onClick={onClick}/>
          <MenuItem className="n personal group top" to="/profile/personal" name="个人资料" onClick={onClick}/>
          <MenuItem className="n joinus group" to="/join-us" name="加入我们" />
          <MenuItem className="n about group" to="/about" name="关于我们" />
          <MenuItem className="n speedapp group bottom" to="/speed-app" name="极速APP" />
          <MenuItem className="n feedback" to="/feedback" name="意见反馈" />
          {userAuth.data && userAuth.data.is_agent === "1" ? (
            <>
              <MenuItem className="n11 qr" to="/profile/agency/qr" name="代理推广"
              />
              <MenuItem className="n12 agent-report" to="/profile/agency/agent-report" name="代理商报告"
              />
              <MenuItem className="n13 comission" to="/profile/agency/comission-report" name="佣金报告" />
              <MenuItem className="n14 members " to="/profile/agency/members" name="会员名单"
              />
            </>
          ) : null}
          <MenuItem className="n10" onClick={logout} name="退出登录" />
        </div>
      </div>

      <UIAlertSA
        onClose={() =>
          setTimeout(() => {
            setAvatar(false);
          }, 200)
        }
        shown={avatar}
      >
        <div className="modal-avatar-wrap">
          <div className="modal-avatar-content">
            {avatarClass.map((data, i) => (
              <Avatar className={data.name} url={data.url} key={i} />
            ))}
            <label
              htmlFor="imgAvatar"
              className="select-image"
              onClick={() => setSelectedAvatar("custom")}
            />
            <input
              type="file"
              id="imgAvatar"
              name="imgAvatar"
              accept=" image/jpeg, image/png"
              onChange={(e) => {
                onChangeAvatar(e);
                setAvatar(false);
              }}
              style={{ opacity: 0, zIndex: -1, display: "none" }}
            />
          </div>
        </div>
      </UIAlertSA>
      {imageSource ? (
        <CropDemo
          onClose={() => {
            setImageSource("");
            setAvatar(true);
          }}
          src={imageSource}
          updateCustomPhoto={updateCustomPhoto}
        />
      ) : null}
    </div>
  );
}

function Profile() {
  const { userAuth } = useContext(User.Context);

  // console.log(userAuth)
  return (
    <Switch>
      <Route exact path="/profile" component={Menu} />
      <Route path="/profile/deposit" component={Section.Deposit} />
      <Route path="/profile/transfer" component={Section.Transfer} />
      <Route path="/profile/withdraw" component={Section.Withdraw} />
      <Route path="/profile/personal" component={Section.Personal} />
      <Route path="/profile/password" component={Section.Password} />
      <Route path="/profile/fullname" component={Section.Fullname} />
      <Route path="/profile/birthdate" component={Section.Birthdate} />
      <Route path="/profile/cellphone" component={Section.Cellphone} />
      <Route path="/profile/email" component={Section.Email} />
      <Route path="/profile/payment" component={Section.Card} />
      <Route path="/profile/betting-history" component={Section.Betting} />
      <Route
        path="/profile/transactions/:type"
        component={Section.Transactions}
      />
      {userAuth.data && userAuth.data.is_agent === "1" ? (
        <>
          <Route path="/profile/agency/qr" component={Section.QR} />
          <Route path="/profile/agency/agent-report" component={Section.AgentReport} />
          <Route path="/profile/agency/comission-report" component={Section.ComissionReport}/>
          <Route path="/profile/agency/members" component={Section.Members} />
        </>
      ) : null}
      <Redirect to="/profile" />
    </Switch>
  );
}

export default withAuth(Profile, 0);
