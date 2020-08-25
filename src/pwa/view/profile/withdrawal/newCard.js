import React, { useEffect, useState, useContext } from "react";
import { map, find, head, size, filter } from "lodash";
import Swal from "sweetalert2";
import Picker from "react-mobile-picker";

import { FormField, UITabs } from "../../../../component";
import { User, Card as Service } from "../../../../service";
import * as Geo from "../../../../service/Geo";
import { UIAlertSA } from "../../../component";

const banks = [
  "中国工商银行",
  "中国建设银行",
  "中国银行",
  "中国农业银行",
  "中国邮政储蓄银行",
  "招商银行",
  "交通银行",
];

const NewCard = (props) => {
  const { show, delCard, onHide, onNewAddCard } = props;

  const [tempBank, setTempBank] = useState(head(banks));
  const [tempProv, setTempProv] = useState(null);
  const [cardList, setCardList] = useState(null);
  const [provList, setProvList] = useState(null);
  const [delKey, setDelKey] = useState(null);

  const [animate, setAnimate] = useState(false);
  const [makeDefault, setMakeDefault] = useState(true);
  const [bankPicker, toggleBankPicker] = useState(false);
  const [cityPicker, toggleCityPicker] = useState(false);

  const { userAuth } = useContext(User.Context);

  const [error, setError] = useState({
    bank_addr: null,
    bank_no: null,
  });

  const [form, setForm] = useState({
    bank_type: "中国工商银行",
    bank_province: "贵州",
    bank_city: "遵义市",
    realname: userAuth.data.realName || "",
    bank_addr: "",
    bank_no: "",
  });

  const fields = [
    {
      id: "bank_type",
      label: "开户银行",
      select: toggleBankPicker,
      placeholder: "开户银行",
    },
    {
      id: "bank_province",
      label: "开户地区",
      select: toggleCityPicker,
      value: () => `${form.bank_province} ${form.bank_city}`,
      placeholder: "开户地区",
      hidden: true,
    }, //COMMENT FOR NOW
    { id: "bank_city", label: "开户支行", hidden: true, select: false },
    {
      id: "bank_addr",
      label: "开户支行",
      select: false,
      placeholder: "开户支行",
    },
    {
      id: "realname",
      label: "开户人姓名",
      select: false,
      placeholder: "开户人姓名",
      displayOnly: userAuth.data.realName ? true : false,
    },
    { id: "bank_no", label: "银行卡号", select: false },
  ];

  useEffect(() => {
      // console.log(show, delCard)
      document.body.classList.remove("no-scroll");
      if(show || delCard){
        document.body.classList.add("no-scroll");
      }
    


  },[show, delCard])

  useEffect(() => {
    const res = Service.read({
      ...User.read(),
    });

    res.promise.then(
      (r) => {
        // console.log(r)
        setCardList(r.info);
      },
      (e) => {
        console.warn("Unable to get cards:", e);
      }
    );
  }, [animate]);

  useEffect(() => {
    let newObj = [];
    map(Geo.provinces, (obj, i) => {
      // console.log(obj)
      let newCity = filter(Geo.cities, (val) => {
        if (val.province === obj.title) {
          newObj.push({
            ...val,
            chinese_province: obj.chinese_title,
          });
        }
      });
    });
    newObj = map(newObj, (obj, id) => {
      return { ...obj, id: id };
    });

    setProvList(newObj);

    let cur = find(
      newObj,
      (obj) =>
        obj.chinese_province === form.bank_province &&
        obj.chinese_title === form.bank_city
    );

    setTempProv(cur.id);
    // console.log(cur)
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const onSelect = (e) => {
    const { name, value } = e;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const submit = () => {
    // console.log(form)
    // props.onLoading();
    // onHide()
    // setAnimate(false)
    if (size(cardList) === 5) {
      Swal.fire({
        icon: "error",
        title: "绑定的银行信息不能超过5条",
      });
      return false;
    }

    if (!form.bank_no && !form.bank_addr) {
      if (!form.bank_no) {
        setError((f) => ({
          ...f,
          bank_no: "required",
        }));
      }
      if (!form.bank_addr) {
        setError((f) => ({
          ...f,
          bank_addr: "required",
        }));
      }
      return false;
    }

    Service.create({
      ...User.read(),
      ...form,
    }).promise.then(
      (r) => {
        setForm((f) => ({
          ...f,
          bank_addr: "",
          bank_no: "",
        }));

        console.info("Successfully bound the card:", r);
        onHide();
        setAnimate(false);
        onNewAddCard();
      },
      (e) => {
        console.info("Unable to bind the card:", e);
      }
    );
  };

  const onDel = (i) => {
    setDelKey(null);
    if (delKey != i) setDelKey(i);
  };

  const onCloseProv = () => {
    let cur = find(provList, (obj) => obj.id === tempProv);
    // console.log(cur)
    setForm((f) => ({
      ...f,
      bank_province: cur.chinese_province,
      bank_city: cur.chinese_title,
    }));
    toggleCityPicker(false);
  };

  if (show) {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }

  if (delCard) {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }
  // console.log(bankPicker , cityPicker)
  // console.log(tempProv)
  // console.log( size( Geo.provinces) , size( Geo.cities)  )
  let delCount = 0;

  const PickerWrap = ({ banks }) => (
    <div className="picker-wrap">
      {banks.length ? (
        <Picker
          height={180}
          valueGroups={{ bank: tempBank }}
          optionGroups={{ bank: banks }}
          onChange={(key, value) => setTempBank(value)}
        />
      ) : null}
    </div>
  );

  return (
    <div
      className={`withdrawal-new-card ${
        show || delCard ? "show-new-card" : ""
      }`}
    >
      <div className="withdrawal-new-card-wrap">
        <div className={`withdrawal-new-card-content ${ show && animate ? "animate" : "" } ${bankPicker ? "hide" : ""}`} >
          {!cityPicker ? (
            <div className="w-n-c-fiels-main">
              <span
                className="w-n-c-arrow"
                onClick={() => [onHide(), setAnimate(false)]}
              />
              <h3>新增银行卡</h3>
              <div className="w-n-c-fiels">
                {fields
                  .filter((f) => !f.hidden)
                  .map((f, i) => (
                    <div key={i} className="w-n-c-fiels-wrap">
                      <FormField
                        key={i}
                        field={{
                          label: f.label,
                          placeholder: f.placeholder,
                          select: f.select,
                          displayOnly: f.displayOnly,
                          value: f.value,
                          onClick: () => f.select(true),
                        }}
                        input={{
                          id: f.id,
                          label: f.label,
                          placeholder: f.placeholder,
                          name: f.id,
                          value: form[f.id],
                          onChange,
                          className: error[f.id],
                        }}
                      />
                    </div>
                  ))}
              </div>

              <div className="w-n-c-set-defaul-wrap">
                <span className={`${makeDefault ? "active" : "not"}`}
                  // onClick={()=> setMakeDefault(!makeDefault)}
                >
                  默认银行卡
                </span>
              </div>

              <button onClick={() => submit()}>新增银行卡</button>
            </div>
          ) : (
            // ======================= PROVINCES
            <div className="w-n-c-fiels-prov">
              <span className="w-n-c-arrow" onClick={() => onCloseProv()} />
              <h3>省份</h3>

              <div className="w-n-c-p-fields">
                <div className="w-n-c-p-fields-content">
                  {provList &&
                    map(provList, (obj, i) => {
                      return (
                        <div
                          key={i}
                          className={`w-n-c-p-fields-item`}
                          onClick={() => setTempProv(obj.id)}
                        >
                          <div className="w-n-c-p-fields-body">
                            <span
                              className={`${
                                tempProv === obj.id ? "active" : "not"
                              }`}
                            >
                              {obj.chinese_province} {obj.chinese_title}{" "}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =============== DELETE BANK */}
        <div className={`withdrawal-new-card-content ${ delCard && animate ? "animate" : "" }`} >
          <span
            className="w-n-c-arrow"
            onClick={() => [onHide(), setAnimate(false), setDelKey(null)]}
          />
          <h3>删除卡</h3>

          <div className="w-n-c-del-wrap">
            {cardList &&
              map(cardList, (obj, i) => {
                // console.log(obj)
                delCount++;
                if (delCount === 5) delCount = 1;

                return (
                  <div key={i} className={`del-wrap-content del-bg${delCount}`}>
                    <div className="de-wrap-body">
                      <span className={`del-icon`} onClick={() => onDel(i)}>
                        <i />
                        {delKey === i && <span>请联系客服</span>}
                      </span>
                      <span className={`del-bank-icon ${obj.bank_type}`} />
                      <h3>{obj.bank_type}</h3>
                      <h4>银行卡号</h4>
                      <div className="del-bank-number">
                        <span className="del-sp">**** **** ****</span>
                        <span className="del-st">
                          {obj.bank_no.substr(obj.bank_no.length - 4)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* =============== SELECT BANK */}
      </div>
      <div className="withdrawal-new-card-overlay" />
      <UIAlertSA onClose={() => null} shown={bankPicker}>
        <div className={`game-sa-overlay picker-over`}>
          <div className="picker-container">
            <div className="picker-head">
              <p>选择开户银行</p>
            </div>
            <PickerWrap banks={banks} />
          </div>
          <div className="picker-footer">
            <button onClick={() => toggleBankPicker(false)}>取消</button>
            <button
              className="active"
              onClick={() => [
                onSelect({ name: "bank_type", value: tempBank }),
                toggleBankPicker(false),
              ]}
            >
              确定
            </button>
          </div>
        </div>
      </UIAlertSA>
    </div>
  );
};

export default NewCard;
