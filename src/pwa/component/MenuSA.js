import React, { useState, useEffect, useRef, useCallback  ,useContext} from "react";
import { NavLink, useLocation } from "react-router-dom";
import cx from "classnames";
import { User } from '../../service/';

import { Icon } from "../../component/";

import "../assets/scss/MenuSA.scss";

const FrameURL = "https://vm.providesupport.com/01kenrfglk04u0n305fdg0321r";

function MenuSAItem(props) {
  if (props.open) {
    return (
      <button
        className={`menu--item ${props.liveChat ? "active" : ""}`}
        onClick={props.open}
      >
        <div className={`icon ${props.icon}`}>{/* {icons[props.icon]} */}</div>
        <div className="name">{props.name}</div>
      </button>
    );
  }

  if (props.to === "/profile") {
    return (
      <NavLink
        exact
        className="menu--item"
        to={props.to}
        isActive={(match, location) => {
          const path = location.pathname.split("/")[1];
          return path === "profile";
        }}
      >
        <div className={`icon ${props.icon}`}>{/* {icons[props.icon]} */}</div>
        <div className="name">{props.name}</div>
      </NavLink>
    );
  }

  if (props.to === "/promotions") {
    return (
      <NavLink
        exact
        className="menu--item"
        to={props.to}
        isActive={(match, location) => {
          const path = location.pathname.split("/")[1];
          return path === "promotion" || path === "promotions";
        }}
      >
        <div className={`icon ${props.icon}`}>{/* {icons[props.icon]} */}</div>
        <div className="name">{props.name}</div>
      </NavLink>
    );
  }

  return (
    <NavLink exact className="menu--item" to={props.to}>
      <div className={`icon ${props.icon}`}>{/* {icons[props.icon]} */}</div>
      <div className="name">{props.name}</div>
    </NavLink>
  );
}

function MenuSA() {
  const menuSwitch = useRef(null);
  const [menuSwitchOffset, menuSwitchOffsetSet] = useState(0);
  const { setUserAuthFN ,userAuth } = useContext(User.Context);

  const location = useLocation();

  const resize = useCallback((path) => {
    const item = document.querySelector(`a[href='${path}'].menu--item`);

    if (!item) {
      menuSwitchOffsetSet(0);
      return () => {};
    }

    menuSwitchOffsetSet(item.offsetLeft + 2);
  }, []);

  useEffect(() => {
    let path = location.pathname;

    if (path.split("/")[1] === "promotion") {
      path = "/promotions";
    }

    if (path.split("/")[1] === "profile") {
      path = "/profile";
    }

    resize(path);

    window.addEventListener("resize", () => resize(path));

    setLiveChat(false);

    return () => window.removeEventListener("resize", () => resize(path));
  }, [location.pathname, resize]);

  const [liveChat, setLiveChat] = useState(false);


  const onSetLive = () => {
    if(!userAuth.data){
      setUserAuthFN(userAuth.status , userAuth.data , true)
      return false
    }
    setLiveChat(!liveChat)
  }

  return (
    <div className="menu-sa">
      {liveChat ? (
        <div className={cx("menu-sa-live-chat", { shown: liveChat })}>
          <button onClick={() => setLiveChat(false)}>
            <Icon name="close-circle-sharp" />
          </button>
          <iframe title="live chat" src={FrameURL} frameBorder="0" />
        </div>
      ) : null}
      <div className="menu-sa-inner">
        <div className="menu-sa-wrap">
          <MenuSAItem icon="home" name="首页" to="/" />
          <MenuSAItem icon="promotions" name="优惠" to="/promotions" />
          <MenuSAItem
            icon="faq"
            name="客服"
            open={onSetLive}
            liveChat={liveChat}
          />
          <MenuSAItem icon="profile" name="我的" to="/profile" />
          <div
            ref={menuSwitch}
            style={{
              transform: `translateX(${menuSwitchOffset}px)`,
              display: menuSwitchOffset > 0 ? "block" : "none",
            }}
            className="menu--switch"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MenuSA;
