import React, { useEffect, useState, useMemo, useContext } from "react";
import { map, filter, head, find, reverse  , isNumber , toInteger} from "lodash";
import * as moment from "moment";
import BigNumber from "bignumber.js";

import { Service } from "./";
import { toDate } from "../../util";

import "../../assets/scss/profile/Withdrawal.scss";

import CardWrap from "./withdrawal/card";
import HistoryItem from "./withdrawal/historyItem";

import Wrap from "./Wrap";

const Withdrawal = () => {
  const { setUserAuthFN, userAuth } = useContext(Service.User.Context);

  const [loadmore, setLoadMore] = useState(null);
  const [key, setKey] = useState(null);
  const [userData, setUserData] = useState({});
  const [cards, setCards] = useState(null);
  const [range, setRange] = useState("today");

  const [balancesRaw, setBalancesRaw] = useState([]);
  const [items, setItems] = useState({
    status: 0,
    list: [],
  });
  const [customRange, setCustomRange] = useState({
    from: moment().subtract(30, "days").toDate(),
    to: moment().toDate(),
  });
  const [form, setForm] = useState({
    debit_bank: "",
    amount: "",
  });

  const [refresh, setFresh] = useState(false);
  const [cardPicker, toggleCardPicker] = useState(false);
  const [load, setLoad] = useState(false);
  const [showBank, setShowBank] = useState(null);


  useEffect(() => {
    Service.Game.balances({
      ...Service.User.read(),
    }).then((balances) => {
      // console.log(balances)
      setBalancesRaw(balances.filter((b) => !b.error));
    });

    const req = Service.Card.read({
      ...Service.User.read(),
    });

    req.promise.then((r) => {
        const newItems = reverse(r.info);
        const debBnk = head(newItems);
        if (debBnk) {
          setForm((f) => ({
            ...f,
            debit_bank: debBnk.debit_bank,
          }));
          setCards(newItems);
          setFresh(false);
        }
    },(e) => {});

 

  }, [refresh]);

  useEffect(() => {
    if (userAuth.data) {
      setUserData(userAuth.data);
    }

    const fetch = () => {
      const response = Service.Transaction.read({
        ...Service.User.read(),
        record_type: "debit",
      });

      response.promise.then((result) => {
          // console.log(result);
          if (result.status === 1) {
            // setItems(result.info);
            setItems({
              status: 1,
              list: result.info.map((t) => ({
                ...t,
                ts: toDate(t.requestTime, true),
              })),
            });
            setLoad(false);
          }
        },
        (e) => {
          console.log("Unable to response:", e);
        }
      );
    };
    fetch();
  }, [load]);

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

    // return withdraws.list.filter((t) => t.ts >= from && t.ts < to);
    return filter(items.list, (t) => t.ts >= from && t.ts < to);
  }, [items.list, customRange, range]);

  const onCancel = async (w) => {
    // console.log(w);
    // const r = await Service.User.withdrawCancel({ id: w.id }).promise;
    const response = await Service.User.withdrawCancel({ id: w.id }).promise;
    // console.log(response);
    if (response.status === 1) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: response.info,
      });
      setLoad(true);
    }
  };

  const onSetKey = (value) => {
    setKey(null);
    if (key !== value) setKey(value);
  };

  const onMax = () => {
    setForm({
      ...form,
      amount: Math.floor(userAuth.data.balance),
    });
  };

  const onHideBank = () => {
    setShowBank(null);
    setFresh(true);
  };

  const onTransfer = () => {
    const { debit_bank, amount } = form;

    if (!debit_bank) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "必须选择一张银行卡",
      });
      return false;
    }

    if (!amount) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "取款金额不能为空",
      });
      return false;
    }

    if (amount < 100) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "取款金额最低100元",
      });
      return false;
    }

    const selectedBnk = find(cards, (obj) => obj.debit_bank == debit_bank);

    const _form = {
      ...form,
      debit_bank: selectedBnk.id,
    };

    Service.User.withdraw({
      ...Service.User.read(),
      ..._form,
    }).promise.then(
      (r) => {
        console.log(`You've successfully withdrawn:`, r);

        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: r.info,
        });
        setLoad(true);
      },
      (e) => {
        console.warn("Unable to withdraw:", e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
      }
    );
  };

  const wallet = async (e) => {
    Service.Game.transferToWallet().promise.then((r) => {
      Service.User.session({
        ...Service.User.read(),
      }).promise.then((r) => {

        setUserAuthFN(1, r.info, {
          text: "转账成功",
          success: true,
        });
        setLoad(true);
        setFresh(true)

      });

      },
      (e) => {
        console.warn(e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
      }
    );
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


  const onTransferPerGame = (obj) =>{
    const _from = {
      id: 0,
      name: 'wallet'
    }
    const _to = obj
    // console.log(_from , _to) 
    // return false
    console.info(
      `You are transferring ${Math.floor(userData.balance)} ¥ from ${_from.name} to ${_to.game.name}`
    );
    Service.Game.transfer({
      ...Service.User.read(),
      amount: Math.floor(userData.balance),
      from: _from.id,
      to: _to.game.id,
    }).then(
      (r) => {
        console.info(
          `You have successfully transferred ${Math.floor(userData.balance)} ¥ from ${_from.name} to ${_to.game.name}: ${r.info}`
        );
        Service.User.session({
          ...Service.User.read(),
        }).promise.then((r) => {

          setUserAuthFN(1, r.info, {
            text: "转账成功",
            success: true,
          });
          setLoad(true);
          setFresh(true)

        });

        
      },
      (e) => {
        // console.log(e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
    });


  }

  // console.log(items.list)

  return (
    <Wrap className="profile-withdrawal-desktop" title={"提款"}>
      <div className="profile-section section-box">
        <div className="profile-section-title">
          中心钱包 :<span className="value"> ¥{userData.balance}</span>
          <div className="one-transfer" onClick={wallet}>
            <span>
              <i />
              一键回收
            </span>
          </div>
        </div>

        <div className="withdral-boxes">
          {balancesRaw &&
            map(balancesRaw, (obj, i) => {
              return (
                <div key={i} className="withdral-boxes-item">
                  <div className="withdral-boxes-title">{obj.game.name}</div>
                  <div className="withdral-boxes-value">
                    {BigNumber(obj.balance).toFormat(2)}
                  </div>
                  <div className="withdral-boxes-button" onClick={()=> onTransferPerGame(obj)} >一键转入</div>
                </div>
              );
            })}
        </div>
        <div className="withdrawal-boxes-loadmore" onClick={() => setLoadMore(!loadmore)}>
          <span className={loadmore ? 'show' : ''}>显示所有场馆 </span>
        </div>
      </div>

      {/* SECTION */}

      <div
        className={`profile-section section-box relative ${
          showBank ? "h727" : ""
        }`}
      >
        <div className="profile-section-relative">
          <div className="profile-section-subtitle">选择银行卡</div>

          <div className="withdrawal-form-section">
            <div className="withdrawal-form-group transfer">
              <div
                className="input"
                onClick={() => toggleCardPicker(!cardPicker)}
              >
                {form.debit_bank}
                <i />
              </div>
              <div className={`card-toggle ${cardPicker ? "active" : ""}`}>
                {cards &&
                  map(cards, (obj, i) => {
                    return (
                      <div
                        key={i}
                        className={`card-toggle-item  ${
                          form.debit_bank === obj.debit_bank ? "active" : ""
                        } `}
                        onClick={() => [
                          setForm({ ...form, debit_bank: obj.debit_bank }),
                          toggleCardPicker(false),
                        ]}
                      >
                        {obj.debit_bank}
                      </div>
                    );
                  })}
              </div>

              <button onClick={onTransfer}>立即提款</button>
            </div>
            <div className="withdrawal-form-group max">
              <span>￥</span>
              <input
                value={form.amount}
                placeholder="金额"
                name="amount"
                pattern="^-?[0-9]\d*\.?\d*$"
                onChange={(e) =>onlyNumbers(e)}
                // onKeyDown={(e) => onlyNumbers(e)}
              />
              <button onClick={() => onMax()}>最大金额</button>
            </div>
          </div>

          <div className="withdrawal-form-section-button">
            <button
              className="new-button-card"
              onClick={() => setShowBank("new")}
            >
              新增银行卡
            </button>
            <button
              className="untie-button-card"
              onClick={() => setShowBank("del")}
            >
              解绑银行卡
            </button>
          </div>
        </div>

        <CardWrap show={showBank} onHide={onHideBank} />
      </div>

      {/* SECTION */}

      <div className="withdrawal-history-card-head">
        <div className="withdrawal-history-card-title">
          <span>提款记录</span>
          <i className={load ? "reload" : ""} onClick={() => setLoad(true)} />
        </div>
        <div className="withdrawal-history-card-body">
          {items.list  ? (
            map(items.list, (obj, i) => {
              return (
                <HistoryItem
                  obj={obj}
                  key={i}
                  index={i}
                  label={obj.cardNumber}
                  time={obj.requestTime}
                  value={obj.amount}
                  status={obj.status}
                  onCancel={(val) => onCancel(val)}
                  onSetKey={(val) => onSetKey(val)}
                  setKey={key}
                />
              );
            })
          ) : (
            <div className="no-transactions">
              <div className="image-box" />
              <span>暂无记录</span>
            </div>
          )}
        </div>
      </div>
    </Wrap>
  );
};

export default Withdrawal;
