import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { FormField, LiveChat } from "../component/";
import { User } from "../service/";

import "../assets/scss/Restore.scss";

function Restore() {
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();

  const {
    userAuth: { data },
    setUserAuthFN,
  } = useContext(User.Context);

  const [status, setStatus] = useState(1);

  const [form, setForm] = useState({
    username: "",
    phone: "",
    code: "",
  });

  const refUsername = useRef(null);
  const refcellphone = useRef(null);
  const refcode = useRef(null);

  const [message, setMessage] = useState({
    className: null,
    source: null,
    message: null,
  });

  const notify = (state, source, message) => {
    setMessage({
      className: state ? "valid" : "invalid",
      source,
      message,
    });
  };

  const [active, setActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);
  const [livechat, setLiveChat] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    document.body.classList.add("login-page");

    return () => document.body.classList.remove("login-page");
  }, []);

  useEffect(() => {
    function numbersOnly(value) {
      const re = /^[0-9]*$/;
      return re.test(value);
    }

    if (form.username !== "" && form.phone !== "" && form.phone.length === 11) {
      setButtonActive(true);
    }

    if (
      form.username !== "" &&
      form.phone !== "" &&
      form.phone.length === 11 &&
      numbersOnly(form.phone) &&
      form.code !== ""
    )
      setActive(true);
    else setActive(false);
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (message.message && message.source === name) {
      setMessage({
        className: null,
        source: null,
        message: null,
      });
    }

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const update = () => {
    setStatus(0);

    User.retrievePassword({
      ...User.read(),
      phone: form.phone,
      account: form.username,
      verification_code: form.code,
    }).promise.then(
      (r) => {
        console.info(r);
        setLiveChat(true);

        // User.session({
        //   ...User.read(),
        // }).promise.then((r) => setUserAuthFN(1, r.info));
      },
      (e) => {
        console.warn(e);
      }
    );
  };

  function verification() {
    setButtonActive(false);

    setTimeout(() => {
      setButtonActive(true);
    }, 60000);

    if (form.phone !== "") {
      const req = User.mobileVerification({
        type: "verification_code",
        phone: form.phone,
        ...User.read(),
      });

      req.promise.then(
        (r) => {
          console.log("Verification sent!", r);
        },
        (e) => {
          console.warn("Verification nto generated", e);
        }
      );
    } else {
      // console.log('Empty')
    }
  }

  return (
    <div className="restoree-wrap">
      <div className="restore-form">
        <div className="restore-form-wrap">
          <div className="restore-form-outer">
            <div className="restore-header">
              <div className="load-spin"></div>
              <div className="logo"></div>
              <div className="divider">赞助伙伴</div>
              <div className="sub-logo"></div>
              <div className="sub-text">奥格斯堡</div>
            </div>
            <div
              className={`restore-form-inner with-loader${
                isLoading ? " loading" : ""
              }`}
            >
              <div className="restore-form-outer-bottom">
                <div className="auth-tabs">
                  <div className="ui-tabs">
                    <div className={`ui-tabs--tab active`}>联系客服</div>
                    <div className={"ui-tabs--tab nonactive"}>
                      <Link to="/login">登录</Link>
                    </div>
                  </div>
                </div>
                <div className="form">
                  <div className="form-inner">
                    <div className="form-inner-content">
                      <FormField
                        field={{ label: "用户名" }}
                        input={{
                          id: "username",
                          name: "username",
                          type: "text",
                          placeholder: "请输入用户名",
                          ref: refUsername,
                          maxLength: 12,
                          onChange,
                        }}
                      />
                      <FormField
                        field={{ label: "手机号码" }}
                        input={{
                          id: "phone",
                          name: "phone",
                          type: "text",
                          placeholder: "请输入手机号码",
                          ref: refcellphone,
                          maxLength: 11,
                          onChange,
                          onInput: () =>
                            (refcellphone.current.value = refcellphone.current.value.replace(
                              /[^0-9]/g,
                              ""
                            )),
                        }}
                      />
                      <div className={"form-field verification"}>
                        <input
                          id="code"
                          name="code"
                          type="text"
                          placeholder="请输入手机验证码"
                          ref={refcode}
                          onChange={onChange}
                        />
                        <button
                          className={`code ${buttonActive && "active"}`}
                          onClick={buttonActive ? () => verification() : null}
                        >
                          发送验证码
                        </button>
                      </div>
                      <div className="submit">
                        <div
                          className={`form-button ${
                            active && !disabled && "form-button-active"
                          }`}
                          onClick={active && !disabled ? update : null}
                        >
                          <span>下一步</span>
                        </div>
                      </div>
                      <div
                        className="support"
                        onClick={() => setLiveChat(true)}
                      >
                        联系客服
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LiveChat popup={livechat} onPop={() => setLiveChat(false)} withoutTop />
    </div>
  );
}

export default Restore;
