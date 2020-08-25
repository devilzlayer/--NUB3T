import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import moment from "moment";
import { find } from "lodash";
import { User, Transaction } from "../../service";

import { vipSlideValue, vipProgress } from "../../pwa/view/vip/values";

import Wrap from './Wrap'

const Landing = (props) => {
  const [avatar, setAvatar] = useState(null);
  const { setUserAuthFN, userAuth } = useContext(User.Context);
  const [tableValue, setTableValue] = useState({});

  const [vipDays, setVipDays] = useState(0);
  const [vipCount, setVipCount] = useState(0);
  const [vipLevel, setVipLevel] = useState(1);
  const [vipAmount, setVipAmount] = useState(0.0);
  const [viProgVal, setViProgVal] = useState(0);

  useEffect(() => {
    const response = Transaction.read({
      ...User.read(),
      type: "get_vip_level",
    });

    response.promise.then(
      (r) => {
        // console.log(r);

        if (r.status === 1) {
          const vlvp = Number(r.info.viplevel);
          const vamn = Number(r.info.accountnum);
          setVipCount(vlvp);
          setVipLevel(vlvp);
          const vpP = find(vipProgress, (obj) => obj.level === vlvp);
          setVipAmount(vamn);
          const valPer = (vamn * 100) / vpP.amount;
          setViProgVal(valPer);

          if (vlvp < 10) {
            setVipLevel(Number(vlvp) + 1);
          }
        }
      },
      (e) => {}
    );

    // console.log( )
    if (userAuth && userAuth.data) {
      var a = moment(userAuth.data.regTime).format("MM/DD/YYYY");
      var b = moment();
      var diffDays = b.diff(a, "days");
      setVipDays(diffDays);
    }
  }, []);

  useEffect(() => {
    const tableVal = find(vipSlideValue, (obj, i) => i == vipCount);
    setTableValue(tableVal);
    // console.log(tableVal)
  }, [vipCount]);

  // console.log(userAuth)

  return (
    <Wrap className="profile-landing">
      <section>
        <div className="profile-section section-box">
          <div className="profile-section-title">我的VIP等级</div>

          <div className="profile-section-vip">
            <div className="profile-section-vip-head">
              我的VIP等级 : <span>VIP{vipCount}</span>{" "}
            </div>

            <div className="profile-section-vip-range-body">
              <div className="profile-section-vip-range">
                <div className={`p-section-range-span vip-${vipCount}`}>
                  VIP{vipCount}
                </div>
                <div className={`p-section-range-span vip-${vipLevel}`}>
                  VIP{vipLevel}
                </div>
                <div className="profile-section-vip-range-line">
                  <span style={{ width: `${viProgVal}%` }} />
                </div>
              </div>

              <Link className="default" to="/vip">查看VIP详情</Link>
            </div>

            <div className="profile-section-vip-value">
              <span>提示：升级需要</span>
              <span className="price">¥{vipAmount}元 </span>
              <span>流水 （每日16点更新）</span>
            </div>
          </div>
        </div>

        <div className="profile-section section-box">
          <div className="profile-section-title">我享有的特权</div>

          <div className="profile-section-body">
            <div className="profile-section-body-item">
              <table>
                <tbody>
                  <tr>
                    <td>日提款次数</td>
                    <td>{tableValue.item3}次</td>
                  </tr>
                  <tr>
                    <td>每日提款额度</td>
                    <td>￥{tableValue.item4}0000.00元</td>
                  </tr>
                  <tr>
                    <td>升级礼金</td>
                    <td>￥{tableValue.item1}.00元</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="profile-section-body-item">
              <table>
                <tbody>
                  <tr>
                    <td>生日礼金</td>
                    <td>
                      ￥{tableValue.special ? tableValue.special : 0}.00元
                    </td>
                  </tr>
                  <tr>
                    <td>每月免费红包</td>
                    <td>￥{tableValue.item2}.00元</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="profile-section section-box">
          <div className="profile-section-title">我的VIP详情</div>

          <div className="profile-section-body">
            <div className="profile-section-body-item">
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>VIP豪礼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="h255">
                    <td>豪礼赠送</td>
                    <td>无</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="profile-section-body-item">
              <table>
                <thead>
                  <tr>
                    <th colSpan={2}>VIP返水比例</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>体育返水</td>
                    <td>{tableValue.grid1}%</td>
                  </tr>
                  <tr>
                    <td>电子返水</td>
                    <td>{tableValue.grid2}%</td>
                  </tr>
                  <tr>
                    <td>真人返水</td>
                    <td>{tableValue.grid3}%</td>
                  </tr>
                  <tr>
                    <td>篮球返水</td>
                    <td>{tableValue.grid4}%</td>
                  </tr>
                  <tr>
                    <td>电子竞技返水</td>
                    <td>{tableValue.grid5}%</td>
                  </tr>
                  <tr>
                    <td>棋牌返水</td>
                    <td>{tableValue.grid6}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button className="default">进入查看vip特权</button>
        </div>
      </section>
    </Wrap>
  );
};

export default Landing;
