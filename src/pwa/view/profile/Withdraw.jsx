import React, { useState, useEffect, useMemo, useContext } from "react";
// import { Link } from "react-router-dom";
// import Picker from "react-mobile-picker";
import DatePicker from "react-mobile-datepicker";
import cx from "classnames";
import * as moment from "moment";
import BigNumber from "bignumber.js";
import { reverse, isEmpty, size } from "lodash";

import { Wrap } from "./";
import { toDate } from "../../../util/";
import {
  FormField,
  //  UITabs
} from "../../../component/";
import { UIAlertSA } from "../../component/";
import { Service } from "./";

import NewCard from "./withdrawal/newCard";
import { withAuth } from "../../util";


const CardItem = (props) => {
  const {
    label,
    time,
    value,
    status,
    index,
    className,
    obj,
    onSetKey,
    setKey,
  } = props;
  //成功 SUCCESS
  //失败 FAILURE
  //未审核 UNREVIEWED
  //出款中 WITHDRAWING
  let statusText = "";
  let classStatus = "";
  let cancel = false;
  let fail = false;
  if (status === "成功") {
    statusText = "成功";
    classStatus = "success";
  }

  if (status === "失败") {
    statusText = "失败";
    classStatus = "failure";
    fail = true;
  }

  if (status === "未审核") {
    statusText = "未审核";
    classStatus = "unreviewed";
    cancel = true;
  }

  if (status === "出款中") {
    statusText = "出款中";
    classStatus = "withdrawing";
  }

  if (status === "汇款中") {
    statusText = "汇款中";
    classStatus = "remittance";
  }

  return (
    <div
      className={`withdrawal-history-card-item ${className ? className : ""}`}
    >
      <div className="cl-item withdrawal-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item withdrawal-history-card-value">
        {cancel && (
          <span className="cancel" onClick={() => props.onCancel(obj)}>
            取消提款
          </span>
        )}
        <p className="cl-card-amount">
          金额: <span>{value}</span>
        </p>
        <p className={`cl-card-status ${classStatus}`}>
          <span>
            {statusText}
            {fail && (
              <span className="fail" onClick={() => onSetKey(index)}>
                {setKey === index && <span>{obj.verifyComment}</span>}
                <i />
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

const Withdraws = ({ update, alert }) => {
  const [key, setKey] = useState(null);
  const [reload, setReload] = useState(null);

  const [withdraws, setWithdraws] = useState({
    status: 0,
    list: [],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await Service.Transaction.read({
          record_type: "debit",
          ...Service.User.read(),
        }).promise;

        // console.log("R", r);

        setWithdraws({
          status: 1,
          list: r.info.map((t) => ({ ...t, ts: toDate(t.requestTime, true) })),
        });
        setReload(false);
      } catch (e) {
        if (!e.is_aborted) {
          console.warn(e);
        }
        setReload(false);
      }
    };

    fetch();
  }, [update, reload]);

  const [range, setRange] = useState("today");

  const [customI, setCustomI] = useState(0);

  const [customRange, setCustomRange] = useState({
    from: moment().subtract(30, "days").toDate(),
    to: moment().toDate(),
  });

  const [customRangeOpened, openCustomRange] = useState({
    from: false,
    to: false,
  });

  const [overlayShown, setOverlay] = useState(false);

  const __withdraws = useMemo(() => {
    const _rangeMap = {
      today: () => {
        const today = moment();
        return [today.startOf("day").unix(), today.endOf("day").unix()];
      },
      yesterday: () => {
        const yesterday = moment().subtract(1, "days");
        return [yesterday.startOf("day").unix(), yesterday.endOf("day").unix()];
      },
      week: () => {
        return [
          moment().subtract(1, "weeks").startOf("day").unix(),
          moment().endOf("day").unix(),
        ];
      },
      month: () => {
        return [
          moment().subtract(30, "days").startOf("day").unix(),
          moment().endOf("day").unix(),
        ];
      },
      custom: () => {
        let { from, to } = customRange;
        return [
          moment(from).startOf("day").unix(),
          moment(to).endOf("day").unix(),
        ];
      },
    };

    const [from, to] = _rangeMap[range]();

    return withdraws.list.filter((t) => t.ts >= from && t.ts < to);
  }, [withdraws.list, customRange, range]);

  const UI = {
    async cancel(w) {
      try {
        const r = await Service.User.withdrawCancel({ id: w.id }).promise;

        console.info(r);

        setWithdraws((ws) => ({
          ...ws,
          list: ws.list.map((ws) =>
            ws.id === w.id ? { ...w, status: "失败" } : ws
          ),
        }));

        alert.showAlert("系统提示", r.info);
      } catch (e) {
        console.warn(e);

        alert.showAlert("系统提示", e);
      }
    },
    toggle(w) {
      setWithdraws((ws) => ({
        ...ws,
        list: ws.list.map((ws) =>
          ws.id === w.id ? { ...w, shown: !w.shown } : ws
        ),
      }));
    },
    applyCustomRange() {
      setOverlay(false);

      setCustomI(customI + 1);

      setRange("custom");
    },
  };

  const monthMap = {
    "1": "一月",
    "2": "二月",
    "3": "三月",
    "4": "四月",
    "5": "五月",
    "6": "六月",
    "7": "七月",
    "8": "八月",
    "9": "九月",
    "10": "十月",
    "11": "十一月",
    "12": "十二月",
  };

  const DatePickerWrap = ({ type, header, min }) => (
    <>
      <p
        onClick={(e) =>
          openCustomRange({
            ...customRangeOpened,
            [type]: true,
          })
        }
      >
        {moment(customRange[type]).format("YYYY-MM-DD")}
      </p>
      <DatePicker
        theme="ios"
        confirmText="好吧"
        headerFormat={header}
        value={customRange[type]}
        isOpen={customRangeOpened[type]}
        min={min}
        dateConfig={{
          year: {
            format: "YYYY",
          },
          month: {
            format: (v) => monthMap[v.getMonth() + 1],
          },
          date: {
            format: "D",
          },
        }}
        onSelect={(date) => {
          openCustomRange({
            ...customRangeOpened,
            [type]: false,
          });
          setCustomRange({
            ...customRange,
            [type]: date,
          });
        }}
        onCancel={(e) =>
          openCustomRange({
            ...customRangeOpened,
            [type]: false,
          })
        }
      />
    </>
  );

  const _withdraws = withdraws.list.map((withdraw, i) => {
    // console.log(withdraw)

    const onSetKey = (value) => {
      setKey(null);
      if (key !== value) setKey(value);
    };

    return (
      <CardItem
        key={i}
        obj={withdraw}
        index={i}
        label={withdraw.cardNumber}
        time={withdraw.requestTime}
        value={withdraw.amount}
        status={withdraw.status}
        onCancel={(val) => UI.cancel(val)}
        onSetKey={(val) => onSetKey(val)}
        setKey={key}
      />
    );
  });

  // console.log(_withdraws)

  return (
    <div className="withdraws transactions-sa">
      {/* <h1>提款记录</h1>
			<div className="transactions-range">
				<UITabs
					tab={range}
					onSet={r => r !== 'custom' ? setRange(r) : setOverlay(true)}
					tabs={[
						{ index: 'today', name: '今天' },
						{ index: 'yesterday', name: '昨天' },
						{ index: 'week', name: '本周' },
						{ index: 'month', name: '本月' },
						{ index: 'custom', name: '自选' },
					]} />
			</div> */}
      {/* <div className="transactions-list">
				{_withdraws}
			</div> */}
      {/* ============================================================= */}
      <div className="withdrawal-history-wrap">
        <div className="withdrawal-history-wrap-inner">
          <div className="withdrawal-history-wrap-inner-content">
            <div className="withdrawal-history-card">
              <div className="withdrawal-history-card-head">
                <div className="withdrawal-history-card-title">
                  <span>最近30天</span>
                  <i
                    className={reload ? "reload" : ""}
                    onClick={() => setReload(true)}
                  />
                </div>
              </div>

              <div className="withdrawal-history-card-body">
                {!isEmpty(_withdraws) ? (
                  _withdraws
                ) : (
                  <div className="no-transactions">
                    <div className="image-box" />
                    <span>暂无记录</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ============================================================= */}

      <div className={cx("transactions-overlay", { shown: overlayShown })}>
        <div className="transactions-overlay--inner">
          <div className="transactions-overlay--wrap">
            <div className="custom-range-form">
              <h2>选择开始时间</h2>
              <div className="form-wrap">
                <div className="field">
                  <label>开始日期</label>
                  <DatePickerWrap type="from" header="选择开始时间" />
                </div>
                <div className="field">
                  <label>结束日期</label>
                  <DatePickerWrap
                    type="to"
                    min={customRange.from}
                    header="选择结束时间"
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button className="cancel" onClick={(e) => setOverlay(false)}>
                  取消
                </button>
                <button
                  className="update"
                  onClick={(e) => UI.applyCustomRange()}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Withdraw = () => {
  const [balanceTransferred, setBalanceTransferred] = useState(false);
  const [showVenue, setShowVenue] = useState(false);
  const [showNewCard, setShowNewCard] = useState(false);
  const [showDelCard, setShowDelCard] = useState(false);

  const [status, setStatus] = useState(1);

  const [balancesRaw, setBalancesRaw] = useState([]);

  const { userAuth } = useContext(Service.User.Context);

  const [update, setUpdate] = useState(0);

  const [cards, setCards] = useState([]);
  const [cardsMap, setCardsMap] = useState({});

  const [form, setForm] = useState({
    debit_bank: "",
    amount: "",
  });

  const [cardPicker, toggleCardPicker] = useState(false);

  const [alert, setAlert] = useState({
    shown: false,
    title: "",
    message: "",
    onClose: () => hideAlert(),
  });

  const showAlert = (title, message) => {
    setAlert((a) => ({ ...a, shown: true, title, message }));
  };

  const hideAlert = () => {
    setAlert((a) => ({ ...a, shown: false }));
  };

  useEffect(() => {
    // const r = Service.User.withdraw({
    // 	record_type: 'debit',
    // 	...Service.User.read(),
    // });

    // r.promise.then( result =>{
    // 	console.log('result',result)
    // } , e =>{
    // 	console.log(e)
    // })

    Service.Game.balances({
      ...Service.User.read(),
    }).then((balances) => {
      // console.log(balances)
      setBalancesRaw(balances.filter((b) => !b.error));
    });

    const req = Service.Card.read({
      ...Service.User.read(),
    });

    setStatus(0);

    req.promise.then(
      (r) => {
        // console.log("Got cards:", r);

        const _cardsMap = {};

        const _cards = r.info.map((c) => {
          if (!_cardsMap[c.debit_bank]) {
            _cardsMap[c.debit_bank] = c.id;
          }

          return c.debit_bank;
        });

        setCardsMap(_cardsMap);

        if (!_cards.length) {
          _cards.push("");
        }

        setForm((f) => ({
          ...f,
          debit_bank: _cards[0] || "",
        }));

        setCards(_cards);

        setStatus(1);
      },
      (e) => {
        console.warn("Unable to get cards:", e);

        setStatus(1);
      }
    );

    return () => req.cancel();
  }, []);

  const fields = [
    { id: "debit_bank", label: "选择银行卡", placeholder: "银行卡号" },
  ];
  const fieldss = [{ id: "amount", label: "￥", placeholder: "金额" }];

  const withdraw = () => {
    const { debit_bank, amount } = form;

    if (!debit_bank) {
      // return void showAlert("系统提示", "必须选择一张卡");
      return void showAlert("系统提示", "必须选择一张银行卡");
    }

    const _amount = +amount;

    if (!_amount || isNaN(_amount)) {
      return void showAlert("系统提示", "取款金额不能为空");
    }

    // if (_amount < 100 || _amount > 60000) {
    //   return void showAlert("系统提示", "系统提示");
    // }

    if (_amount < 100) {
      return void showAlert("系统提示", "取款金额最低100元");
    }

    console.info(`You're about to withdraw ${amount}¥`);

    setStatus(0);

    const _form = { ...form };
    _form.debit_bank = cardsMap[debit_bank] || "";

    Service.User.withdraw({
      ...Service.User.read(),
      ..._form,
    }).promise.then(
      (r) => {
        console.log(`You've successfully withdrawn:`, r);

        showAlert("系统提示", r.info);

        setStatus(1);

        setUpdate((u) => u + 1);
      },
      (e) => {
        console.warn("Unable to withdraw:", e);

        showAlert("系统提示", e);

        setStatus(1);
      }
    );
  };

  const wallet = async (e) => {
    setStatus(0);

    Service.Game.transferToWallet().promise.then(
      (r) => {
        // console.log(r)
        setStatus(1);
        setBalanceTransferred(true);
      },
      (e) => {
        console.warn(e);
        setStatus(1);
      }
    );
  };

  const onMax = () => {
    setForm({
      ...form,
      amount: Math.floor( userAuth.data.balance ),
    });
  };

  const onNewAddCard = () => {
    const req = Service.Card.read({
      ...Service.User.read(),
    });
    setStatus(0);
    req.promise.then(
      (r) => {
        const _cardsMap = {};
        const _cards = reverse(r.info).map((c) => {
          if (!_cardsMap[c.debit_bank]) {
            _cardsMap[c.debit_bank] = c.id;
          }
          return c.debit_bank;
        });
        setCardsMap(_cardsMap);
        if (!_cards.length) {
          _cards.push("");
        }
        setForm((f) => ({
          ...f,
          debit_bank: _cards[0] || "",
        }));

        setCards(_cards);

        setStatus(1);
      },
      (e) => {
        console.warn("Unable to get cards:", e);
        setStatus(1);
      }
    );
    return () => req.cancel();
  };

  // console.log(form)

  const onShowVenue = () => {
    setShowVenue(!showVenue);
  };

  const onlyNumbers = (e) => {
    const { name , value } = e.currentTarget
    let regexp  = /^[0-9\b]+$/
    if (!value || regexp.test(value)) {
      setForm((f) => ({
        ...f,
        [name]: value,
      }));
    }

  };


  // console.log(update)

  return (
    <Wrap className="profile-withdraw" name="马上提款" isLoading={!status}>
      <div className="form-field user-balance">
        <div className="user-balance-wrap wallet">
          <span className="user-balance-label">
            <i /> 中心钱包
          </span>
          <span className="user-balance-amount">{userAuth.data.balance}</span>
        </div>
        <div className="user-balance-wrap hr" />
        <div className="user-balance-wrap refresh" onClick={wallet}>
          <i />
          <span className="user-balance-label">一键回收</span>
        </div>
      </div>

      <div className="form-field-section">
        <div className="form-field balances-list">
          {balancesRaw.map((balance, i) => (
            <div key={i} className="balances-list--item">
              <div className="game-name">{balance.game.name}</div>
              <div className="game-balance">
                {BigNumber(balance.balance).toFormat(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="balances-list-load-more" onClick={() => onShowVenue()}>
          <span className={showVenue ? "show" : ""}>显示所有场馆</span>
        </div>
      </div>

      <div className="withdraw-form">
        <div className="fields">
          {fields.map((f, i) => (
            <FormField
              key={i}
              field={{
                label: f.label,
                placeholder: f.placeholder,
                select: f.id === "debit_bank",
                onClick: () => toggleCardPicker(!cardPicker),
              }}
              input={{
                ...f,
                name: f.id,
                value: form[f.id],
                onChange: (e) => {
                  const { name, value } = e.target;
                  setForm((f) => ({
                    ...f,
                    [name]: value,
                  }));
                },
              }}
            />
          ))}
          {cardPicker && (
            <div className="cardtogglepicker">
              {cards &&
                cards.map((obj, i) => {
                  return (
                    <div
                      key={i}
                      className={`cardtogglepicker-wrap ${
                        form.debit_bank === obj ? "active" : ""
                      }`}
                      onClick={() => [
                        setForm({ ...form, debit_bank: obj }),
                        toggleCardPicker(false),
                      ]}
                    >
                      {obj}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="withdraw-two-buttons">
          <button
            onClick={() => setShowNewCard(true)}
            className="w-t-btn new-button-card"
          >
            新增银行卡
          </button>
          <button
            onClick={() => setShowDelCard(true)}
            className="w-t-btn untie-button-card"
          >
            解绑银行卡
          </button>
        </div>

        <div className="fields-fields">
          {fieldss.map((f, i) => (
            <FormField
              key={i}
              field={{
                label: f.label,
                placeholder: f.placeholder,
                select: f.id === "debit_bank",
                onClick: () => toggleCardPicker(true),
              }}
              input={{
                ...f,
                name: f.id,
                value: form[f.id],
                onChange: (e) => onlyNumbers(e)
                // onKeyDown: (e) => onlyNumbers(e)  

              }}
            />
          ))}
          <button onClick={() => onMax()} className="btn-field-max">
            最大金额
          </button>
        </div>

        <div className="submit">
          <button className="button-stylized" onClick={withdraw}>
            提交
          </button>
        </div>
      </div>

      <div className={cx("withdraw-list")}>
        <Withdraws update={update} alert={{ showAlert, hideAlert }} />
      </div>

      {/* <div className={cx('card-select-overlay', { shown: cardPicker })}>
				<div className="picker-wrap">
					<div className="picker-head">
						<button onClick={() => toggleCardPicker(false)}>取消</button>
						<p>选择卡</p>
						<button onClick={() => toggleCardPicker(false)}>确定</button>
					</div>
					<div className="picker-body">
						{cardPicker ? (
						<Picker
							height={120}
							valueGroups={{ debit_bank: form.debit_bank }}
							optionGroups={{ debit_bank: cards }}
							onChange={(k, v) => setForm({ ...form, [k]: v, })}/>
						) : null}
					</div>
				</div>
			</div> */}

      <UIAlertSA {...alert} />
      <NewCard
        show={showNewCard}
        delCard={showDelCard}
        onHide={() => [setShowNewCard(false), setShowDelCard(false)]}
        onNewAddCard={() => onNewAddCard()}
      />
      <UIAlertSA onClose={() => null} shown={balanceTransferred}>
        <div className={`game-sa-overlay`}>
          <div className="overlay-layer">
            <div className="form response">
              <div className="form-head">
                <i />
                <h2>转账成功</h2>
              </div>
              <div className="form-body">
                <button onClick={() => setBalanceTransferred(false)}>
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      </UIAlertSA>
    </Wrap>
  );
};

export default withAuth(Withdraw, 1);
