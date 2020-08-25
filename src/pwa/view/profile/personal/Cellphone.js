import React, { useState, useRef, useEffect, useContext } from "react";
import { mobileModel } from "react-device-detect";
import { useHistory } from "react-router-dom";

import { Wrap, Service } from "../";
import { FormField } from "../../../../component";

const Cellphone = () => {
  const history = useHistory();

  const {
    userAuth: { data },
    setUserAuthFN,
  } = useContext(Service.User.Context);

  const [status, setStatus] = useState(1);
  const [cellphone, setCellphone] = useState(data.telephone || "");
  const [code, setCode] = useState("");

  const form = {
    realname: data.realName,
    birthday: data.birthday,
    email: data.email,
    qq: data.qq,
    wechat: data.wechat || "",
    // device: mobileModel, //"Huawei Mate 20 Pro",
    // updates: [{ text: "4.14.116" }, { text: "Thu Apr 30 18:27:58 CSTt 2020" }],
  };

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
  const [buttonActive, setButtonActive] = useState(cellphone ? true : false);

  useEffect(() => {
    function numbersOnly(value) {
      const re = /^[0-9]*$/;
      return re.test(value);
    }
    if (cellphone !== "" && cellphone.length === 11) {
      setButtonActive(true);
    }

    if (
      cellphone !== "" &&
      cellphone.length === 11 &&
      numbersOnly(cellphone) &&
      code !== ""
    )
      setActive(true);
    else setActive(false);
  }, [cellphone, code]);

  const onChange = (e) => {
    const cellphoneinput = e.target.value;

    if (message.message && message.source === "number") {
      setMessage({
        className: null,
        source: null,
        message: null,
      });
    }

    setCellphone(cellphoneinput);
  };

  const onChangeCode = (e) => {
    const codeinput = e.target.value;

    if (message.message && message.source === "number") {
      setMessage({
        className: null,
        source: null,
        message: null,
      });
    }

    setCode(codeinput);
  };

  const update = () => {
    setStatus(0);

    console.info("You're updating account phone number:", cellphone);

    Service.User.update({
      ...form,
      ...Service.User.read(),
      phone: cellphone,
      verification_code: code,
    }).promise.then(
      (r) => {
        console.info(
          "✅ You have successfully updated account phone number:",
          r.info
        );
        notify(true, "phone number", r.info);
        setStatus(1);
        setActive(false);
        setDisabled(true);

        Service.User.session({
          ...Service.User.read(),
        }).promise.then((r) => setUserAuthFN(1, r.info));
      },
      (e) => {
        console.warn("Unable to update account phone number:", e);
        notify(false, "phone number", e);
        setStatus(1);
        setActive(false);
      }
    );
  };

  function verification() {
    setButtonActive(false);

    setTimeout(() => {
      setButtonActive(true);
    }, 60000);

    if (cellphone !== "") {
      const req = Service.User.mobileVerification({
        type: "verification_code",
        phone: cellphone,
        ...Service.User.read(),
      });

      req.promise.then(
        (r) => {
          console.log("Verification sent!");
        },
        (e) => {
          console.warn("Verification nto generated", e);
        }
      );
    }
  }

  return (
    <Wrap
      className="profile-general profile-cellphone"
      name="手机号码"
      sublevel={[true, () => history.goBack()]}
      isLoading={!status}
    >
      {disabled && <span className="profile-valid" />}
      <FormField
        field={{ label: "手机号码" }}
        input={{
          id: "number",
          name: "number",
          type: "text",
          className: `${buttonActive && "active"}`,
          placeholder: "请输入绑定的手机号码",
          ref: refcellphone,
          maxLength: 11,
          onChange,
          defaultValue: cellphone,
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
          placeholder="请输入验证码"
          ref={refcode}
          onChange={onChangeCode}
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
          <span>提交</span>
        </div>
      </div>
    </Wrap>
  );
};

export default Cellphone;
