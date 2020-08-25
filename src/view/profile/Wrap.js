import React, { useState, useEffect, useContext } from "react";

import { User, Transaction } from "../../service";
import Settings from './Settings'

const Switch = () => {
  return (
    <label className="switch">
      <input type="checkbox" />
      <span className="slider round"></span>
    </label>
  );
};

const Wrap = (props) => {
  const { className, children, noHead, title } = props;
  const {
    setUserAuthFN,
    userAuth: {
      data: {
        account,
        balance,
        realName,
        phone_verify,
        telephone,
        birthday,
        email, 
      },
    },
  } = useContext(User.Context);

  const { userAuth} = useContext(User.Context);
  const [type, setType] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const response = Transaction.read({
      ...User.read(),
      type: "get_imgurl",
    });
    response.promise.then(
      (r) => {
        // console.log(r)
        if (r.info) {
          const URL = `https://u2daszapp.u2d8899.com/newpwa/${r.info}`;
          setAvatar(URL);
        }
      },
      (e) => {
        console.log("No Image found");
      }
    );
  }, [userAuth]);


  const onSetType = (event) =>{
    

    if(event === "name"){
      if(realName){
        setUserAuthFN(userAuth.status, userAuth.data, { csr : true });
        return false
      }
    }
    if(event === "phone" ){
      if(phone_verify == 1){
        setUserAuthFN(userAuth.status, userAuth.data, { csr : true });
        return false
      }
    }

    if(event === "birthday" ){
      if(birthday){
        setUserAuthFN(userAuth.status, userAuth.data, { csr : true });
        return false
      }
    }
    if(event === "email" ){
      if(email){
        setUserAuthFN(userAuth.status, userAuth.data, { csr : true });
        return false
      }
    }
 
    
    setType(event)
    
  }

  // console.log(userAuth.data)
  return (
    <>
      {!noHead && (
        <>

        <div className="profile-section section-box">
          <div className="profile-section-header">
            <div className="profile-section-avatar">
              <i style={{ backgroundImage: `url(${avatar})` }} />
              <div className="details">
                <div className="name">{account}</div>
                <div>
                  账户余额：<span>¥{balance}</span>
                </div>
              </div>
            </div>
            <div className="profile-section-menu">
              <div className="profile-section-menu-item" onClick={()=>onSetType('name')}>
                <i className="icon1" />
                基本资料:
                <span className={`${realName ? null : "empty"}`}>
                  {realName ? realName : "尚未填满"}
                </span>
              </div>
              <div className="profile-section-menu-item" onClick={()=>onSetType('phone')}>
                <i className="icon2" />
                手机号码:
                <span
                  className={`${
                    telephone
                      ? phone_verify === 0
                        ? "unverified"
                        : null
                      : "empty"
                  }`}
                >
                  {telephone
                    ? telephone.substring(0, 4) +
                      "****" +
                      telephone.substring(8)
                    : "尚未填满"}
                </span>
              </div>
              <div className="profile-section-menu-item" onClick={()=>onSetType('password')}>
                <i className="icon3" />
                修改密码: <span>去修改</span>
              </div>
              <div className="profile-section-menu-item" onClick={()=>onSetType('birthday')}>
                <i className="icon4" />
                出生日期:
                <span className={`${birthday ? null : "empty"}`}>
                  {birthday ? birthday : "尚未填满"}
                </span>
              </div>
              <div className="profile-section-menu-item" onClick={()=>onSetType('email')}>
                <i className="icon5" />
                邮箱地址:
                <span className={`${email ? null : "empty"}`}>
                  {email ? email : "尚未填满"}
                </span>
              </div>
              <div className="profile-section-menu-item">
                <i className="icon6" />
                夜间模式
                <Switch />
              </div>
            </div>
          </div>
        </div>

        <Settings type={type} onHide={() => setType(null)}/>

        </>
      )}
      {title ? <div className={`profile-section-subtitle`}>{title}</div> : null}
      <div className={`profile-wrap-section ${className}`}>{children}</div>
    </>
  );
};

export default Wrap;
