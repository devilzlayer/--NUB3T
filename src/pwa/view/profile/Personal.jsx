import React, { useState, useContext, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { mobileModel } from "react-device-detect";
import { Wrap, Service } from "./";
import { UIAlertSA, LiveChatSA } from "../../component/";
import { FormField } from "../../../component/";
import { withAuth } from "../../util";

const Switch = () => {
  return (
    <label className="switch">
      <input type="checkbox" />
      <span className="slider round"></span>
    </label>
  );
};

const Personal = () => {
  const {
    userAuth: { data: user },
    // setUserAuthFN,
  } = useContext(Service.User.Context);

  // const [status, setStatus] = useState(1);
  const [editKey, setEditKey] = useState(false);
  const [eye, setEye] = useState(false);
  const [livechat, setLiveChat] = useState(false);

  const refPassword = useRef(null);

  const _dateParse = useCallback((date) => {
    const _parsed = (date || "").match(/([\d]{4})年([\d]{1,2})月([\d]{1,2})日/);

    if (!_parsed) {
      return {
        year: null,
        month: null,
        day: null,
      };
    }

    const _date = {
      year: +_parsed[1],
      month: +_parsed[2],
      day: +_parsed[3],
    };

    return _date;
  }, []);

  const [form, setForm] = useState({
    email: user.email || "",
    name: user.realName || "",
    birthday: _dateParse(user.birthday) || "",
    number: user.telephone || "",
    qq: user.qq || "",
    wechat: user.wechat || "",
    device: mobileModel, //"Huawei Mate 20 Pro",
    updates: [{ text: "4.14.116" }, { text: "Thu Apr 30 18:27:58 CSTt 2020" }],
  });

  const [subform, setSubform] = useState({
    email: !!user.email,
    name: !!user.realName,
    birthday: !!_dateParse(user.birthday).year,
    number: !!user.telephone,
    qq: !!user.qq,
  });

  const _dateFormat = useCallback(
    (date) =>
      date.year
        ? `${date.year}年${date.month}月${date.day}日`
        : "请选择一个日期",
    []
  );

  const fields = [
    {
      field: {
        label: "真实姓名",
        class: "name",
        type: "link",
        link: "fullname",
      },
      input: {
        id: "name",
        type: "text",
        name: "name",
      },
    },
    {
      field: {
        label: "出生日期",
        class: "birthday",
        // type: "input",
        type: "link",
        link: "birthdate",
      },
      input: {
        id: "birthday",
        type: "text",
        name: "birthday",
        readOnly: true,
      },
    },
    {
      field: {
        label: "手机号码",
        class: "contact group top",
        type: "link",
        link: "cellphone",
      },
      input: {
        id: "number",
        type: "text",
        name: "number",
      },
    },
    {
      field: {
        label: "邮箱地址",
        class: "email group",
        type: "link",
        link: "email",
      },
      input: {
        id: "email",
        type: "email",
        name: "email",
      },
    },
    {
      field: {
        label: "修改密码",
        class: "password group bottom",
        type: "link",
        link: "password",
      },
      input: {
        id: "password",
        type: "password",
        name: "password",
      },
    },
    {
      field: {
        label: "夜间模式",
        class: "nightmode",
        type: "button",
      },
      input: {
        name: "nigtmode",
      },
    },
    {
      field: {
        label: "设备信息",
        class: "device group top",
        type: "text",
      },
      input: {
        id: "device",
        type: "text",
        readOnly: true,
        name: "device",
      },
    },
    // {
    //   field: {
    //     label: "清理缓存",
    //     class: "cache group",
    //     type: "link",
    //     link: "",
    //   },
    // },
    // {
    //   field: {
    //     label: "清理缓存",
    //     class: "cache group",
    //     link: "cache",
    //   },
    //   input: {
    //     readOnly: true,
    //     name: "cache",
    //   },
    // },
    // {
    //   field: {
    //     label: "检查更新",
    //     class: "updates group bottom",
    //     type: "text",
    //   },
    //   input: {
    //     id: "updates",
    //     type: "text",
    //     readOnly: true,
    //     name: "updates",
    //   },
    // },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const onVision = () => {
    if (refPassword.current.type === "password") {
      refPassword.current.type = "text";
      setEye(true);
      return false;
    }
    refPassword.current.type = "password";
    setEye(false);
  };

  return (
    <Wrap
      className="profile-personal"
      name="个人资料"
      // isLoading={!status}
    >
      <div className="fields">
        {fields.map((f, i) => {
          let inputVal = "";
          if (f.input) {
            inputVal = form[f.input.name] ? form[f.input.name] : "";
            if (f.input.name === "birthday") {
              inputVal = _dateFormat(form[f.input.name]);
            }
          }

          if (
            f.field.type === "link" &&
            (inputVal === "请选择一个日期" ||
              (f.field.class === "contact group top" &&
                user.phone_verify === "0") ||
              !inputVal)
          ) {
            return (
              <Link
                className={`field-item ${f.field.class}`}
                key={i}
                to={f.field.link}
              >
                <i />
                <p>{f.field.label}</p>
                {!inputVal && <span />}
                {inputVal && <label>{inputVal ? inputVal : null}</label>}
              </Link>
            );
          }

          return (
            <div className={`field-item 123 ${f.field.class}`} key={i}>
              <i />
              <p>{f.field.label}</p>
              {f.field.type === "button" && <Switch />}
              {f.input && f.field.type === "input" && (
                <FormField
                  field={{
                    ...f.field,
                  }}
                  input={{
                    ...f.input,
                    onChange,
                    onBlur: () => setEditKey(null),
                    value: form[f.input.name] ? form[f.input.name] : "",
                    disabled: subform[f.input.name],
                  }}
                />
              )}

              {inputVal && Array.isArray(inputVal) ? (
                <span className="value">
                  {inputVal.map((obj, key) => {
                    return <div key={key}>{obj.text}</div>;
                  })}
                </span>
              ) : (
                f.input &&
                f.input.type !== "password" && (
                  <span
                    className="value"
                    onClick={() =>
                      f.input.name === "birthday" ||
                      f.input.name === "email" ||
                      (f.input.name === "number" && user.phone_verify === "1")
                        ? setEditKey(true)
                        : null
                    }
                  >
                    {inputVal}
                  </span>
                )
              )}

              {inputVal &&
                f.input &&
                f.input.type === "password" && [
                  <input
                    key="password"
                    className="readOnly"
                    ref={refPassword}
                    type={f.input.type}
                    value={inputVal}
                    readOnly
                    onClick={() => setEditKey(i)}
                  />,
                  <i
                    key="eye"
                    className={`eye${eye ? " vision" : ""}`}
                    onClick={() => onVision()}
                  />,
                ]}
            </div>
          );
        })}
      </div>
      <UIAlertSA
        onClose={() =>
          setTimeout(() => {
            setEditKey(false);
          }, 200)
        }
        shown={editKey}
      >
        <div className="modal-error-update-wrap">
          <div className="modal-error-update-head">
            <h3>
              请注意 <i />
            </h3>
          </div>
          <div className="modal-error-update-body">
            <div className="m-e-u-b-text">
              <i
                onClick={() => {
                  setEditKey(false);
                  setLiveChat(true);
                }}
              />
              <p>如需更改此信息请联系客服协助</p>
              <p>谢谢</p>
            </div>
          </div>
        </div>
      </UIAlertSA>
      <LiveChatSA shown={livechat} onClose={() => setLiveChat(false)} />
    </Wrap>
  );
};

export default withAuth(Personal, 1);
