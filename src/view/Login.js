import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";

import { UITabs, FormField } from "../component/";
import { User as Service } from "../service/";

import "../assets/scss/Login.scss";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function FormSignin(props) {
  const { onLoading } = props;

  const { state: { referrer = "/" } = {} } = useLocation();

  const refUsername = useRef(null);
  const refPassword = useRef(null);

  const [isValid, setValidity] = useState(true);
  const [isLogged, setLogged] = useState(false);
  const [active, setActive] = useState(false);

  const [user, setUser] = useState({
    username: null,
    password: null,
  });

  useEffect(() => {
    if (isValid && user.username !== null && user.password !== null)
      setActive(true);
  }, [user, isValid]);

  function userChange(e) {
    if (
      (!isValid && e.target.name === "password") ||
      (e.target.name === "username" && user.password)
    ) {
      setValidity(true);
    }

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function userLogin() {
    if (!user.password) {
      return void refPassword.current.focus();
    }

    onLoading(true);

    const req = Service.login(user);

    req.promise.then(
      (r) => {
        localStorage.setItem("user", JSON.stringify(user));

        onLoading(false);

        setLogged(true);
      },
      (e) => {
        onLoading(false);

        setValidity(false);

        refPassword.current.focus();
      }
    );
  }

  if (isLogged) {
    return <Redirect to={referrer} />;
  }

  return (
    <div className="form form--signin">
      <div className="form-inner">
        <div className="form-inner-content">
          <FormField
            field={{ label: "用户名" }}
            input={{
              id: "username",
              name: "username",
              type: "text",
              placeholder: "用户名(6至12位)",
              required: true,
              onChange: userChange,
              ref: refUsername,
            }}
          />
          <FormField
            isValid={isValid}
            field={{ label: "密码" }}
            input={{
              id: "password",
              name: "password",
              type: "password",
              placeholder: "密码(至少6位)",
              required: true,
              onChange: userChange,
              ref: refPassword,
            }}
          />
          {!isValid ? (
            <p style={{ color: "#e4451b", marginTop: -15 }}>
              用户名或密码输入不正确
            </p>
          ) : null}
        </div>
        <button
          className={`submit ${active ? "active" : null}`}
          onClick={active ? userLogin : null}
        >
          登录
        </button>
      </div>
      <div className="restore-wrap">
        <Link to="/restore">忘记密码了吗 ？</Link>
      </div>
    </div>
  );
}

function FormSignup(props) {
  const { onLoading } = props;

  const refUsername = useRef(null);
  const refPassword = useRef(null);
  const refPasswordOK = useRef(null);
  const refTelephone = useRef(null);
  const refRef = useRef(null);

  const [isValid, setValidity] = useState(0);
  const [isValidPassword, setPasswordValidity] = useState(0);
  const [isValidPasswordok, setPasswordokValidity] = useState(0);
  const [isValidTelephone, setTelephoneValidity] = useState(0);
  const [isCreated, setCreated] = useState(false);
  const [agent] = useState(props.agentName);
  const [active, setActive] = useState(false);
  const [oldUsername, setOldUsername] = useState("null");

  const [user, setUser] = useState({
    username: null,
    password: null,
    passwordok: null,
  });

  useEffect(() => {
    if (!user.agentName && agent) {
      setUser({
        ...user,
        agentName: agent,
      });
    }
  }, [user, agent]);

  function onFocus() {
    if (!user.username || user.username.length < 6) {
      void refUsername.current.focus();
    }
  }

  function outOfFocus(e) {
    const userValid = !user.username || user.username.length < 6;
    if (e.target.id === "username") {
      if (!/^[a-z0-9]{6,12}$/i.test(user.username)) {
        setValidity(1);
        return null;
      } else if (isValid !== 2) {
        return setValidity(0);
      }
    }
    if (e.target.id === "password") {
      if (!userValid && user.password) {
        if (user.password.length < 6) return setPasswordValidity(1);
        else return setPasswordValidity(0);
      } else {
        return setPasswordValidity(0);
      }
    }

    if (e.target.id === "passwordok") {
      if (!userValid && user.password !== user.passwordok) {
        setPasswordokValidity(1);
        return null;
      } else {
        return setPasswordokValidity(0);
      }
    }

    if (e.target.id === "telephone") {
      if (!userValid && user.telephone) {
        if (user.telephone.length !== 11) setTelephoneValidity(1);
        return null;
      }
    }
  }

  function userChange(e) {
    if (e.target.name === "telephone") {
      if (e.target.value.length === 11) {
        setActive(true);
        setTelephoneValidity(0);
      } else if (active && !isValidTelephone) {
        setActive(false);
        setTelephoneValidity(1);
      }
    }

    if (e.target.name === "username") {
      if (isValid === 2 && e.target.value !== oldUsername) {
        setValidity(0);
      }
    }

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  function userCreate() {
    onLoading(true);

    const req = Service.create(user);

    req.promise.then(
      (r) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.username,
            password: user.password,
          })
        );

        onLoading(false);

        setCreated(true);
      },
      (e) => {
        console.warn(e);

        onLoading(false);

        setValidity(2);
        setOldUsername(user.username);

        refUsername.current.focus();
      }
    );
  }

  if (isCreated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="form form--signup">
      <div className="form-inner">
        <div className="form-inner-content signup">
          <FormField
            isValid={!isValid}
            field={{ label: "用户名" }}
            input={{
              id: "username",
              name: "username",
              type: "text",
              placeholder: "用户名(6至12位)",
              required: true,
              maxLength: 12,
              onChange: userChange,
              onBlur: outOfFocus,
              ref: refUsername,
            }}
          />
          {isValid === 1 ? (
            <p style={{ color: "#e4451b", marginTop: -19 }}>6-12个字母数字</p>
          ) : null}
          {isValid === 2 ? (
            <p style={{ color: "#e4451b", marginTop: -19 }}>
              注册失败，会员帐号已被注册
            </p>
          ) : null}
          <FormField
            isValid={!isValidPassword}
            field={{ label: "密码" }}
            input={{
              id: "password",
              name: "password",
              type: "password",
              placeholder: "密码(至少6位)",
              required: true,
              onFocus: onFocus,
              onChange: userChange,
              onBlur: outOfFocus,
              ref: refPassword,
            }}
          />
          {isValidPassword === 1 ? (
            <p style={{ color: "#e4451b", marginTop: -19 }}>密码最短为6位</p>
          ) : null}
          <FormField
            isValid={!isValidPasswordok}
            field={{ label: "请再次输入密码" }}
            input={{
              id: "passwordok",
              name: "passwordok",
              type: "password",
              placeholder: "请再次输入密码",
              required: true,
              onFocus: onFocus,
              onChange: userChange,
              onBlur: outOfFocus,
              ref: refPasswordOK,
            }}
          />
          {isValidPasswordok === 1 ? (
            <p style={{ color: "#e4451b", marginTop: -19 }}>
              两次输入密码不一致
            </p>
          ) : null}
          <FormField
            isValid={!isValidTelephone}
            field={{ label: "请输入手机号码" }}
            input={{
              id: "telephone",
              name: "telephone",
              type: "text",
              placeholder: "请输入手机号码",
              maxLength: 11,
              required: true,
              onChange: userChange,
              onFocus: onFocus,
              onBlur: outOfFocus,
              ref: refTelephone,
              onInput: () =>
                (refTelephone.current.value = refTelephone.current.value.replace(
                  /[^0-9]/g,
                  ""
                )),
            }}
          />
          {isValidTelephone === 1 ? (
            <p style={{ color: "#e4451b", marginTop: -19 }}>请输入11位手机号</p>
          ) : null}
          <FormField
            field={{ label: "好友优惠推荐码" }}
            input={{
              id: "agentName",
              name: "agentName",
              type: "text",
              placeholder: "好友优惠推荐码(选填)",
              required: true,
              onChange: userChange,
              ref: refRef,
            }}
          />
        </div>
        <button
          className={`submit ${active ? "active" : null}`}
          onClick={active ? userCreate : null}
        >
          注册
        </button>
      </div>
    </div>
  );
}

function Login() {
  const query = useQuery();
  const history = useHistory();

  const [tab, setTab] = useState(query.get("tab") || "signin");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    document.body.classList.add("login-page");

    return () => document.body.classList.remove("login-page");
  }, []);

  useEffect(() => {
    history.push({ search: `?tab=${tab}` });
  }, [history, tab]);

  return (
    <div className="login-wrap">
      <div className="login-form">
        <div className="login-form-wrap">
          <div className="login-form-outer">
            <div className="login-header">
              <div className="load-spin"></div>
              <div className="logo"></div>
              <div className="divider">赞助伙伴</div>
              <div className="sub-logo"></div>
              <div className="sub-text">奥格斯堡</div>
            </div>
            <div
              className={`login-form-inner with-loader${
                isLoading ? " loading" : ""
              }`}
            >
              <div className="login-form-outer-bottom">
                <div className="auth-tabs">
                  <div className="ui-tabs">
                    <div className={`ui-tabs--tab active`} onClick={null}>
                      {tab === "signin" ? "登录" : "注册"}
                    </div>
                    <div
                      onClick={(e) =>
                        setTab(tab === "signin" ? "signup" : "signin")
                      }
                      className={"ui-tabs--tab nonactive"}
                    >
                      {tab === "signin" ? "注册" : "登录"}
                    </div>
                  </div>
                </div>
                <div className={`auth-forms tab--${tab}`}>
                  <FormSignin onLoading={setLoading} />
                  <FormSignup onLoading={setLoading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
