import React, { useEffect, useState, useContext } from "react";
import Picker from "react-mobile-picker";
import cx from "classnames";
import BigNumber from "bignumber.js";
import { map  ,toInteger , isNumber} from 'lodash'
// import { UIAlert } from "../../component";
import { User, Game } from "../../service";
import { withAuth } from "../../util";
import Wrap from "./Wrap";

import "../../assets/scss/profile/Transfer.scss";

const Transfer = () => {
  const { userAuth, setUserAuthFN } = useContext(User.Context);

  const [balances, setBalances] = useState({
    from: [],
    to: [],
  });

  const [balancesFill, setBalancesFill] = useState({
    wallet: [],
    games: [],
  });

  const [balancesRaw, setBalancesRaw] = useState([]);

  const [balanceTransferred, setBalanceTransferred] = useState(false);
  const [balanceLoad, setBalanceLoad] = useState(false);
  const [balanceUpdateI, setBalanceUpdateI] = useState(0);
  const [balancesMap, setBalancesMap] = useState({});
  const [balanceOver, setBalanceOver] = useState(null);
  const [balanceForm, setBalanceForm] = useState({
    from: null,
    to: null,
    amount: "",
  });
  const [balanceTime, setBalanceTime] = useState(false);

  useEffect(() => {
    setBalances({
      from: [],
      to: [],
    });

    setBalancesMap({});

    setBalancesFill({
      wallet: [],
      games: [],
    });

    Game.balances({
      ...User.read(),
    }).then((_balances) => {
      setBalancesRaw(_balances.filter((b) => !b.error));

      // const __balances = _balances.map(b => `${b.game.name}: ${b.balance} ¥`);
      // 			__balances.unshift(`中央钱包: ${userAuth.data.balance} ¥`);
      const __balances = _balances
        .filter((b) => !b.error)
        .map((b) => `${b.game.name}`);
      __balances.unshift(`中心钱包`);

      const _bFillWallet = [`中心钱包`];
      const _bFillGames = _balances
        .filter((b) => !b.error)
        .map((b) => b.game.name);

      setBalancesFill({
        wallet: _bFillWallet,
        games: _bFillGames,
      });

      setBalanceForm((balanceForm) => ({
        ...balanceForm,
        from: __balances[0],
        to: __balances[1],
      }));

      setBalances({
        from: __balances,
        // to: __balances,
        to: _bFillGames,
      });

      const __balancesMap = {};

      _balances
        .filter((b) => !b.error)
        .forEach((b) => {
          __balancesMap[b.game.name] = b;
        });

      __balancesMap["中心钱包"] = {
        game: {
          id: 0,
          name: "wallet",
        },
        wallet: true,
        balance: +userAuth.data.balance,
      };

      setBalancesMap(__balancesMap);
    });
  }, [balanceUpdateI, userAuth.data.balance]);

  useEffect(() => {
    User.session({
      ...User.read(),
    }).promise.then((r) => setUserAuthFN(1, r.info));

    setBalanceForm((bf) => ({
      ...bf,
      amount: "",
    }));

    // eslint-disable-next-line
  }, [balanceUpdateI]);

  const AmountVariants = [100, 500, 1000, 2000, 5000];

  const PickerWrap = ({ dist }) => {
    // console.log( dist )
    // console.log( balances[dist] )
    return  <div className="picker-wrap">
              <div className="bank-picker-body-wrap">
              {balances[dist].length &&
                map( balances[dist] , (obj , i) =>{
                  return  <div key={i} className={`bank-picker-item ${balanceForm[dist] === obj ? 'active' : ''}`}
                            onClick={()=>{
                              if (dist === "from") {
                                const _d = balancesMap[obj].wallet ? "games" : "wallet";
          
                                setBalances((b) => ({
                                  ...b,
                                  to: balancesFill[_d],
                                }));
          
                                setBalanceForm((bf) => ({
                                  ...bf,
                                  to: balancesFill[_d][0],
                                }));
                              }
                              setBalanceForm((bf) => ({
                                ...bf,
                                [dist] : obj,
                              }));
                              
                            }}
                          >
                            {obj}
                          </div>
                })
                // <Picker
                //   height={180}
                //   valueGroups={{ [dist]: balanceForm[dist] }}
                //   optionGroups={{ [dist]: balances[dist] }}
                //   onChange={(key, value) => {
                //     console.log(value)
                //     if (dist === "from") {
                //       console.log(key,value)
                //       const _d = balancesMap[value].wallet ? "games" : "wallet";

                //       setBalances((b) => ({
                //         ...b,
                //         to: balancesFill[_d],
                //       }));

                //       setBalanceForm((bf) => ({
                //         ...bf,
                //         to: balancesFill[_d][0],
                //       }));
                //     }

                //     setBalanceForm((bf) => ({
                //       ...bf,
                //       [key]: value,
                //     }));
                //   }}
                // />

              }
              </div>
              
            </div>
  }
    
  

  const swap = () => {
    const [to, from] = [balanceForm.from, balanceForm.to];

    const _d1 = balancesMap[from].wallet ? "games" : "wallet";
    const _d2 = balancesMap[to].wallet ? "games" : "wallet";

    setBalances((b) => ({
      ...b,
      to: balancesFill[_d1],
      from: balancesFill[_d2],
    }));

    setBalanceForm((bf) => ({
      ...bf,
      to,
      from,
    }));
  };

  const setAmount = (e) => {
    const amount = e.target ? e.target.value : e;

    setBalanceForm((form) => ({ ...form, amount }));
  };

  const setMax = () => {
    const _game = balancesMap[balanceForm.from];

    let _max = _game.balance;

    if (_game.wallet) {
      _max = userAuth.data.balance;
    }

    setAmount( Math.floor(_max) );
  };

  const onlyNumbers = (e) => {
    const { value } = e.currentTarget
    let regexp  = /^[0-9\b]+$/
    if (!value || regexp.test(value)) {
      setAmount(value);
    }

  };

  const transfer = (e) => {
    if (!balanceForm.amount || isNaN(+balanceForm.amount)) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "没有金额",
      });
      return void console.warn("[transfer] No amount");
    }

    const _getMap = (n) => balancesMap[n.split(": ")[0]] || null;

    const _from = _getMap(balanceForm.from);
    const _to = _getMap(balanceForm.to);


  
    if (_from.game.id === _to.game.id) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "同一个游戏",
      });
      return void console.warn("[transfer] Same game");
    }

    if (_from.balance === 0) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "零余额",
      });
      return void console.warn("[transfer] Zero balance");
    }

    if (_from.balance < +balanceForm.amount) {
      setUserAuthFN(userAuth.status, userAuth.data, {
        text: "系统提示",
        message: "余额不足",
      });
      return void console.warn("[transfer] Not enough game balance");
    }

    console.info(
      `You're transfering ${balanceForm.amount} ¥ from ${_from.game.name} to ${_to.game.name}`
    );

    setBalanceLoad(true);

    Game.transfer({
      ...User.read(),
      amount: +balanceForm.amount,
      from: _from.game.id,
      to: _to.game.id,
    }).then(
      (r) => {
        console.info(
          `You have successfully transferred ${balanceForm.amount} ¥ from ${_from.game.name} to ${_to.game.name}: ${r.info}`
        );

        setBalanceLoad(false);

        setBalanceTransferred(true);
      },
      (e) => {
        console.error(e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
        setBalanceLoad(false);
      }
    );
  };

  const wallet = (_e) => {
    setBalanceTime(true);
    setBalanceLoad(true);

    Game.transferToWallet().promise.then(
      (r) => {
        setBalanceLoad(false);

        setBalanceTransferred(true);
      },
      (e) => {
        console.warn(e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
        setBalanceLoad(false);
      }
    );
    setTimeout(() => {
      setBalanceTime(false);
    }, 10000);
  };

  const onTransferPerGame = (obj) =>{
    

    const _from = {
      id: 0,
      name: 'wallet'
    }
    const _to = obj
    // console.log(userAuth.data.balance,Math.floor(userAuth.data.balance) , _from , _to) 
    // return false
    console.info(
      `You are transferring ${Math.floor(userAuth.data.balance)} ¥ from ${_from.name} to ${_to.game.name}`
    );

    Game.transfer({
      ...User.read(),
      amount: Math.floor(userAuth.data.balance),
      from: _from.id,
      to: _to.game.id,
    }).then(
      (r) => {
        console.info(
          `You have successfully transferred ${Math.floor(userAuth.data.balance)} ¥ from ${_from.name} to ${_to.game.name}: ${r.info}`
        );

        setBalanceLoad(false);

        setBalanceTransferred(true);
      },
      (e) => {
        console.error(e);
        setUserAuthFN(userAuth.status, userAuth.data, {
          text: "系统提示",
          message: e,
        });
        setBalanceLoad(false);
      }
    );


  }

  return (
    <Wrap className="transfer-desktop" title={"转账"}>
      <div className="profile-section section-box">
        <div className="user-balance">
          <div className="user-balance-wrap wallet">
            中心钱包 :
            <span className="user-balance-amount">
              ¥{BigNumber(userAuth.data.balance).toFormat(2)}
            </span>
          </div>
          <div
            className="user-balance-wrap refresh"
            onClick={!balanceLoad && !balanceTime ? wallet : null}
          >
            <i />
            <span className="user-balance-label">一键回收</span>
          </div>
        </div>
        <div className="transfer-hr" />
        <div className="balances-list">
          {balancesRaw.map((balance, i) => (
            <div key={i} className="balances-list--item">
              <div className="game-name">{balance.game.name}</div>
              <div className="game-balance">
                {BigNumber(balance.balance).toFormat(2)}
              </div>
              <div className="game-button"
               onClick={!balanceLoad && !balanceTime ? () => onTransferPerGame(balance) : null}
              >一键转入</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-section section-box">
        <div className="form-field-section">
          <div className="form-field--doubler">
            <div className="form-field">
              <label>推出</label>
              <div className="input--wrap with-dot">
                <div
                  className={cx("input-like", {
                    "has-value": balanceForm.from,
                  })}
                  onClick={(e) => setBalanceOver("from")}
                >
                  {balanceForm.from || "推出"}
                </div>
              </div>
            </div>
            <div className="form-field-swap">
              <button onClick={() => swap()} id="swapButton">
                {/* <Icon name="switch" /> */}
              </button>
            </div>
            <div className="form-field">
              <label>进入</label>
              <div className="input--wrap with-dot">
                <div
                  className={cx("input-like", {
                    "has-value": balanceForm.to,
                  })}
                  onClick={(e) => setBalanceOver("to")}
                >
                  {balanceForm.to || "进入"}
                </div>
              </div>
            </div>
          </div>

          <div className="form-field with-max">
            <div className="amount-wrap">
              <div className="input--wrap">
                <span>￥</span>
                <input
                  id="amount"
                  type="text"
                  placeholder="金额"
                  // pattern="[0-9]*"
                  className={cx({ "has-value": balanceForm.amount })}
                  value={balanceForm.amount}
                  onChange={(e) => onlyNumbers(e)}
                  // onKeyDown={(e) => onlyNumbers(e)}
                />
              </div>
            </div>
            <div className="amount-max-wrap">
              <button
                id="maxButton"
                className={cx({
                  disabled:
                    !balancesMap[balanceForm.from] ||
                    !balancesMap[balanceForm.from].balance,
                })}
                onClick={() => setMax()}
              >
                最大金额
              </button>
            </div>
          </div>
        </div>

        <div className="form-field-section bottom">
          <div className="form-field amount-variants">
            {AmountVariants.map((amount, i) => (
              <button
                id="amountVariants"
                key={i}
                className={cx("amount-variant", {
                  disabled: amount > userAuth.data.balance,
                })}
                onClick={() => setAmount(amount)}
              >
                {amount}
              </button>
            ))}
          </div>
          <div className="submit">
            <button onClick={transfer}>立即转账</button>
          </div>
        </div>

        <div className={`modal-container ${balanceOver ? "shown" : null}`}>
          <div className={`game-sa-overlay picker-over`}>
            <div className="picker-container">
              <div className="picker-head">
                <p>{balanceOver === "from" ? "推出" : "进入"}</p>
              </div>

              {balanceOver && <PickerWrap dist={balanceOver} /> }

            </div>
            <div className="picker-footer">
              <button onClick={(e) => setBalanceOver(null)}>取消</button>
              <button className="active" onClick={(e) => setBalanceOver(null)}>
                确定
              </button>
            </div>
          </div>
        </div>

        <div
          className={`modal-container ${balanceTransferred ? "shown" : null}`}
        >
          <div className={`game-sa-overlay`}>
            <div className="overlay-layer">
              <div className="form response">
                <div className="form-head">
                  <i />
                  <h2>转账成功</h2>
                </div>
                <div className="form-body">
                  <button
                    onClick={() => {
                      setBalanceTransferred(false);
                      setBalanceUpdateI((i) => i + 1);
                    }}
                  >
                    确认
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default withAuth(Transfer, 1);
