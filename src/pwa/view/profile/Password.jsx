import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Wrap, Service } from "./";
import { FormField } from "../../../component/";

const PasswordRegular = ({ setStatus }) => {
  const refpassword = useRef(null);
  const refpassword_new = useRef(null);
  const refpassword_newok = useRef(null);

  const oldPassword = Service.User.read().password;

  const [form, setForm] = useState({
    password: "",
    password_new: "",
    password_newok: "",
  });

  const [active, setActive] = useState(false);

  const [message, setMessage] = useState({
    className: null,
    source: null,
    message: null,
  });

  const fields = [
    {
      field: {
        label: "原密码",
      },
      input: {
        id: "password",
        name: "password",
        type: "password",
        required: true,
        placeholder: "原密码",
        ref: refpassword,
      },
    },
    {
      field: {
        label: "新密码",
      },
      input: {
        id: "password_new",
        name: "password_new",
        type: "password",
        placeholder: "新密码",
        ref: refpassword_new,
      },
    },
    {
      field: {
        label: "验证新密码",
      },
      input: {
        id: "password_newok",
        name: "password_newok",
        type: "password",
        placeholder: "验证新密码",
        ref: refpassword_newok,
      },
    },
  ];

  const notify = (state, source, message) => {
    setMessage({
      className: state ? "valid" : "invalid",
      source,
      message,
    });
  };

  useEffect(() => {
    if (
      form.password !== "" &&
      form.password_new !== "" &&
      form.password_newok !== "" &&
      form.password_new === form.password_newok &&
      oldPassword === form.password
    )
      setActive(true);
    else setActive(false);
  }, [form, oldPassword]);

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
    if (!form.password) {
      return void notify(false, "password", "未输入当前密码!");
    }

    if (!form.password_new) {
      return void notify(false, "password_new", "未输入新密码!");
    }

    if (form.password_new !== form.password_newok) {
      return void notify(false, "password_new", "输入的密码不匹配!");
    }

    setStatus(0);

    console.info("You're updating account password:", form);

    Service.User.updatePassword({
      ...Service.User.read(),
      ...form,
    }).promise.then(
      (r) => {
        console.info(
          "✅ You have successfully updated account password:",
          r.info
        );

        notify(true, "password", r.info);

        setStatus(1);
      },
      (e) => {
        console.warn("Unable to update account password:", e);

        notify(false, "password", e);

        setStatus(1);
      }
    );
  };

  return (
    <>
      <div className="fields">
        {message.message ? (
          <div className={`message ${message.className}`}>
            {message.message}
          </div>
        ) : null}
        {fields.map((f, i) => (
          <FormField
            key={i}
            field={f.field}
            input={{
              ...f.input,
              onChange,
            }}
          />
        ))}
      </div>
      <div className="submit">
        <div
          className={`form-button ${active && "form-button-active"}`}
          onClick={active ? update : null}
        >
          <span>提交</span>
        </div>
      </div>
    </>
  );
};

const Password = () => {
  const history = useHistory();

  const [status, setStatus] = useState(1);

  return (
    <Wrap
      className="profile-password"
      name="安全中心"
      sublevel={[true, () => history.goBack()]}
      isLoading={!status}
    >
      <div className="passsword-wrap">
        <PasswordRegular setStatus={(s) => setStatus(s)} />
      </div>
    </Wrap>
  );
};

export default Password;
