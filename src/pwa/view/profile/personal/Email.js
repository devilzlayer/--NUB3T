import React, { useState, useEffect, useContext } from "react";
import { mobileModel } from "react-device-detect";
import { useHistory } from "react-router-dom";

import { Wrap, Service } from "../";
import { FormField } from "../../../../component";

const Email = () => {
  const history = useHistory();

  const {
    userAuth: { data },
    setUserAuthFN,
  } = useContext(Service.User.Context);

  const [formemail, setFormEmail] = useState("");
  const form = {
    realname: data.realName,
    birthday: data.birthday,
    phone: data.telephone,
    qq: data.qq,
    wechat: data.wechat || "",
    device: mobileModel, //"Huawei Mate 20 Pro",
    updates: [{ text: "4.14.116" }, { text: "Thu Apr 30 18:27:58 CSTt 2020" }],
  };

  const [active, setActive] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (formemail !== "" && validateEmail(formemail)) setActive(true);
    else setActive(false);
  }, [formemail]);

  const onChange = (e) => {
    const emailinput = e.target.value;

    setFormEmail(emailinput);
  };

  const update = () => {
    console.info("You're updating account email:", formemail);

    Service.User.update({
      ...form,
      ...Service.User.read(),
      email: formemail,
    }).promise.then(
      (r) => {
        console.info("✅ You have successfully updated account email:", r.info);
        setActive(false);
        setDisabled(true);

        Service.User.session({
          ...Service.User.read(),
        }).promise.then((r) => setUserAuthFN(1, r.info));
      },
      (e) => {
        console.warn("Unable to update account email:", e);
      }
    );
  };

  return (
    <Wrap
      className="profile-general profile-email"
      name="邮箱地址"
      sublevel={[true, () => history.goBack()]}
    >
      {disabled && <span className="profile-valid" />}
      <FormField
        field={{ label: "邮箱地址" }}
        input={{
          id: "email",
          name: "email",
          type: "text",
          placeholder: "请输入绑定的邮箱地址",
          onChange,
        }}
      />
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

export default Email;
