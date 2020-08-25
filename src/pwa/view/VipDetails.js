import React, { useState , useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { map } from "lodash";
import { Wrap } from "../view/profile/";

import "../assets/scss/Vip.scss";

import { vipTitles, vipVal } from "./vip/values";
import { withAuth } from "../util/";

import { User , Transaction} from "../../service";

const Vip = () => {
  // const history 	= useHistory();


  // const [ vipPrivilege ,setVipPrivilege ] = useState(true)
  const [roll, setRoll] = useState(0);
  const [tab, setTab] = useState(1);

  const [vipLvl, setVipLvl]   = useState(0);
  const [vipList, setVipList] = useState(vipVal);

  const checkScrollTop = () => {
    // console.log(window.pageYOffset)
    if (window.pageYOffset > 80) {
      setRoll(true);
    } else {
      setRoll(false);
    }
  };

  useEffect(() =>{
    const response = Transaction.read({
      ...User.read(),
      type: "get_vip_level",
    });

    response.promise.then((r) => {
        console.log(r)
        const vlvp = Number(r.info.viplevel);
        setVipLvl(vlvp)
    },(e) => {
        // console.log(e)
    });
  },[])

  window.addEventListener("scroll", checkScrollTop);

  return (
    <Wrap
      className={`vip-wrap privilege vip-detaiils ${roll ? "roll" : ""}`}
      centerName="VIP详情"
      faq={false}
    >
      <div className="vip-wrap-inner-bg" />
      <div className={`vip-wrap-inner-top-header tab-${tab}`}>
        <Link to="vip" className={`vip-wrap-inner-h-text`}>
          VIP特权
        </Link>
        <Link to="vip-details" className={`vip-wrap-inner-h-text active`}>
          VIP详情
          {tab === 1 ? <div className={`vip-wrap-inner-h-switch`} /> : null}
        </Link>
      </div>

      <div className="vip-wrap-inner">
        <div className="vip-wrap-inner-details">
          <div className="vip-wrap-inner-details-title">返水与比例</div>

          <div className="vip-wrap-inner-details-grid-box">
            <div className="v-w-i-d-grid-item head">
              {vipTitles &&
                map(vipTitles, (obj, i) => {
                  return (
                    <div key={i} className="v-w-i-d-grid-col-text caption">
                      {obj}
                    </div>
                  );
                })}
            </div>
            {vipList &&
              map(vipList, (obj, i) => {
                return (
                  <div key={i} className="v-w-i-d-grid-item">
                    <div
                      key={i}
                      className={`v-w-i-d-grid-col-text caption  vip-icon${i} ${vipLvl == i ? 'active' : ''}`}
                    >
                      <span>V{i}</span>
                    </div>
                    {obj &&
                      map(obj, (val, key) => {
                        // console.log(val.value)
                        return (
                          <div
                            key={`${i}${key}`}
                            className={`v-w-i-d-grid-col-text value ${
                              val.active ? "active" : ""
                            }`}
                          >
                            {val.value}%
                          </div>
                        );
                      })}
                  </div>
                );
              })}
          </div>

          <div className="vip-wrap-inner-details-title">条款与规则</div>

          <div className="vip-wrap-inner-details-list-box">
            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">VIP多端共享原则</div>
              <div className="vip-inner-details-text">
                在UEDBet综合、UEDBet体育、UEDBet棋牌进行打码都会被计算成VIP的晋级策略；打造全平台终端共享VIP的极致体验。
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">保级策略</div>
              <div className="vip-inner-details-text">
                会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求从新按照当前等级计算。
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">降级惩罚</div>
              <div className="vip-inner-details-text">
                如果会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">实物名品</div>
              <div className="vip-inner-details-text">
                达到相应等级的VIP会员可联系在线客服进行申请，礼品不能折算为现金，每个级别的名贵礼品每位会员仅能获得1次。UEDBet娱乐对名贵礼品拥有最终解释权。
                <span>(名贵礼品仅针对VIP6/VIP7/VIP8/VIP9/VIP10会员)</span>
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">升级礼金</div>
              <div className="vip-inner-details-text">
                升级礼金在会员达到该会员级别后系统自动派发，每个级别的升级礼金每位会员仅能获得1次。
                <span>（升级礼金1倍流水即可提款）</span>
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">每月红包</div>
              <div className="vip-inner-details-text">
                会员在上个月有过至少1次成功存款，即可在每月1号获得上个月相应等级的每月红包彩金。
                <span>(每月红包彩金1倍流水即可提款）</span>
              </div>
            </div>

            <div className="vip-inner-details-list">
              <div className="vip-inner-details-title">天天返水</div>
              <div className="vip-inner-details-text">
                每天返水在15:00~15:30期间发放完毕。
              </div>
            </div>
          </div>

          <div className="vip-inner-details-footer">
            UEDBet保留对活动的修改，停止及最终解释权
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default withAuth(Vip, 1);
