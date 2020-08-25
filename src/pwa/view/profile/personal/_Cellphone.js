import React, { useState, useRef, useEffect, useContext } from "react";
import { mobileModel } from "react-device-detect";
import { useHistory } from "react-router-dom";
import apisauce from 'apisauce';

import { Wrap, Service } from "../";
import { FormField } from "../../../../component";
import { getAuthKey } from '../../../../util';

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
    // setStatus(0);

    // console.info("You're updating account phone number:", cellphone);

    // Service.User.update({
    //   ...form,
    //   ...Service.User.read(),
    //   phone: cellphone,
    //   verification_code: code,
    // }).promise.then(
    //   (r) => {
    //     console.info(
    //       "✅ You have successfully updated account phone number:",
    //       r.info
    //     );
    //     notify(true, "phone number", r.info);
    //     setStatus(1);
    //     setActive(false);
    //     setDisabled(true);

    //     Service.User.session({
    //       ...Service.User.read(),
    //     }).promise.then((r) => setUserAuthFN(1, r.info));
    //   },
    //   (e) => {
    //     console.warn("Unable to update account phone number:", e);
    //     notify(false, "phone number", e);
    //     setStatus(1);
    //     setActive(false);
    //   }
    // );

    var myHeaders = new Headers();
    myHeaders.append("Cookie", "PHPSESSID=dtp0dr6aum5qc7vor4fu1uivu7");

    var formdata = new FormData();
    formdata.append("auth", getAuthKey());
    formdata.append("account", "test02");
    formdata.append("username", "test02");
    formdata.append("password", "123456");
    formdata.append("type", "change_information");
    formdata.append("phone", "18367946649");
    formdata.append("verification_code", "3234");
    formdata.append("verification_code", "3234");
    var requestOptions = {
      method          : 'POST',
      headers         : myHeaders,
      body            : formdata,
      crossDomain     : true,
      withCredentials : true,
      // credentials: 'include'

    };

    fetch("https://u2daszapp.u2d8899.com/newpwa/ajax_data.php", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));



  };

  async function verification  () {

    // myHeaders.append("Access-control-allow-credentials", "*");
    // myHeaders.append("Access-Control-Allow-Credentials", "true");
    // myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    
    
    var myHeaders = new Headers();
    myHeaders.append("Set-Cookie", "PHPSESSID=dtp0dr6aum5qc7vor4fu1uivu7");
    // myHeaders.append("Access-Control-Allow-Origin", "*");
    // myHeaders.append("Accept", "application/json");
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Origin", "http://192.168.1.9:3001/");
    // myHeaders.append("credentials", "include");

    var formdata = new FormData();
    formdata.append("auth", getAuthKey());
    formdata.append("account", "test02");
    formdata.append("username", "test02");
    formdata.append("password", "123456");
    formdata.append("type", "verification_code");
    formdata.append("phone", "18367946649");

    var requestOptions = {
      method          : 'POST',
      headers         : myHeaders,
      body            : formdata,
      crossDomain     : true,
      withCredentials : true,
    };

    fetch("https://u2daszapp.u2d8899.com/newpwa/ajax_data.php", requestOptions)
      .then(response => response.json())
      .then((response) => {
        console.log(response , response.getHeaders("cookie") )
      })
      .catch(error => console.log('error', error));


      // const api = apisauce.create({
      //   baseURL: 'https://u2daszapp.u2d8899.com/newpwa/',
      //   headers: {
      //     Cookie: "PHPSESSID=sd36vr0k3lvoihgn55r8bgpvf7"
      //   },
      //   timeout: 10000,
      // });
  
      // const number = (params) => { 
      //    return  api.post('ajax_data.php', {
      //     auth      : getAuthKey(),
      //     account   :"test02",
      //     username  :"test02",
      //     password  :"123456",
      //     type      :"change_information",
      //     phone     :"18367946649",
      //     verification_code:"3796",
      //   })
      // }
      // const response =  await number() 
      // console.log(response)
  

    // setButtonActive(false);

    // setTimeout(() => {
    //   setButtonActive(true);
    // }, 60000);

    // if (cellphone !== "") {
    //   const req = Service.User.mobileVerification({
    //     type: "verification_code",
    //     phone: cellphone,
    //     ...Service.User.read(),
    //   });

    //   req.promise.then(
    //     (r) => {
    //       console.log("Verification sent!");
    //     },
    //     (e) => {
    //       console.warn("Verification nto generated", e);
    //     }
    //   );
    // }

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
