import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import Picker from "react-mobile-picker";
import { mobileModel } from "react-device-detect";
import { useHistory } from "react-router-dom";

import { Wrap, Service } from "../";
import { getDates } from "../../../../util";

const Birthdate = () => {
  const history = useHistory();

  const {
    userAuth: { data },
    setUserAuthFN,
  } = useContext(Service.User.Context);

  const [birthday, setBirthday] = useState({
    year: 1989,
    month: 8,
    day: 12,
  });
  const form = {
    realname: data.realName,
    phone: data.telephone,
    email: data.email,
    qq: data.qq,
    wechat: data.wechat || "",
    device: mobileModel, //"Huawei Mate 20 Pro",
    updates: [{ text: "4.14.116" }, { text: "Thu Apr 30 18:27:58 CSTt 2020" }],
  };

  const [active, setActive] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (birthday !== "") setActive(true);
    else setActive(false);
  }, [birthday]);

  const _dates = useMemo(() => getDates({ date: birthday, year: [18, 150] }), [
    birthday,
  ]);

  const _dateFormat = useCallback(
    (date) =>
      date.year
        ? `${date.year}年${date.month}月${date.day}日`
        : "请选择一个日期",
    []
  );

  const update = () => {
    console.info("You're updating account's birthdate:", birthday);

    Service.User.update({
      ...form,
      ...Service.User.read(),
      birthday: _dateFormat(birthday),
    }).promise.then(
      (r) => {
        console.info(
          "✅ You have successfully updated account's birthdate:",
          r.info
        );
        setActive(false);
        setDisabled(true);

        Service.User.session({
          ...Service.User.read(),
        }).promise.then((r) => setUserAuthFN(1, r.info));
      },
      (e) => {
        console.warn("Unable to update account's birthdate:", e);
      }
    );
  };

  return (
    <Wrap
      className="profile-birthdate"
      name="用于发放生日礼金"
      sublevel={[true, () => history.goBack()]}
    >
      {disabled && <span className="profile-valid" />}
      <div className={`date-select-overlay`}>
        <div className="picker-body">
          <div className="picker-selected">
            <span className={`date-year`} />
            <span className={`date-month`} />
            <span className={`date-day`} />
          </div>
          <Picker
            height={260}
            valueGroups={birthday}
            optionGroups={{ ..._dates }}
            onChange={(k, v) => setBirthday({ ...birthday, [k]: v })}
          />
        </div>
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

export default Birthdate;
