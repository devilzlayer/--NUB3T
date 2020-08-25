import React, { useState, useRef, useEffect } from "react";
import { map , find} from 'lodash'
import { withAuth , getAuthKey } from "../util/";
import { User, Transaction } from "../service";


import "../assets/scss/Vip.scss";

import { vipSlideValue, vipProgress ,vipTitles ,vipVal } from "./vip/values";
 

const VipWrap = () =>{
    const icons = [0,1,2,3,4,5,6,7,8,9,10]


    const refIcon = useRef(null)
    const [loading, setLoading] = useState(false);
    const [fixed, setFixed] = useState(false);
    const [animate, setAnimate] = useState(false);
    
    const [vipActive, setVipActive] = useState(null);
    const [vipCount, setVipCount]   = useState(null);
    const [vipLevel, setVipLevel]   = useState(1);
    const [vipAmount, setVipAmount] = useState(0.0);
    const [viProgVal, setViProgVal] = useState(0);


    useEffect( () =>{
        // console.log(refIcon.current.offsetTop)
        let fix  = refIcon.current.offsetTop
        let nav 
        map(document.getElementsByClassName("nav") , obj =>{
            nav = obj
        })
        
        window.addEventListener('scroll' , (event) =>{
            // console.log(window.scrollY , fix , window.scrollY >=  fix )
            // console.log(nav)
           
            if(window.scrollY >=  fix ){
                setFixed(true)
                nav.classList.add('hide');
                // setTimeout(() => {
                //     setAnimate(true)
                //     nav.classList.add('hide');
                // }, 200);

                return false
            }

            setFixed(false)
            nav.classList.remove('hide');

            // setAnimate(false)
            // setTimeout(() => {
            //     setFixed(false)
            //     nav.classList.remove('hide');
            // }, 200);

           
            
        })

    },[]) 
    useEffect(() => {
        const response = Transaction.read({
        ...User.read(),
        type: "get_vip_level",
        });

        response.promise.then((r) => {
            // console.log(r)
            setLoading(false);
            if (r.status === 1) {
                const vlvp = Number(r.info.viplevel);
                const vamn = Number(r.info.accountnum);

                setVipActive(vlvp);
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
        },(e) => {
            // console.log(e)
            setLoading(false);
        });
    }, []);

    // console.log(vipCount , vipLevel , vipAmount , viProgVal)

    return  <div className={`vip-maincontainer ${fixed? 'fixed' : ''}`}>
                <div className="vip-bannerbg" />

                <div className="vip-wrapper">
                    <div className="vip-header">
                        <div className="vip-head">
                            <div className="vip-head-text vipT1" >
                                {/* U体育 */}
                            </div>
                            <div className="vip-head-icon" />
                            <div className="vip-head-text vipT2" >
                                {/* VIP */}
                            </div>
                        </div>

                        <div className="vip-icons-container">
                        <div className={`vip-icons ${fixed? 'fixed' : ''} ${animate? 'animate' : ''} `} ref={refIcon}>
                            <div className="vip-icons-wraps">
                                { map(icons , (obj , i) =>{
                                    return  <div key={i} className={`vip-icons-list-item ${vipCount == i ? 'active' : ''}`} onClick={() => setVipActive(i)}>
                                                <div className={`vip-icon-item-${i}`} />
                                                <span>VIP{i}</span>
                                            </div>
                                }) }
                            </div>
                        </div>
                        </div>

                    </div>

                    <div className="vip-body">
                        <div className="vip-body-section">
                            <div className="vip-banner-data">
                                <div className="vip-banner-card-wrap">
                                    { map(icons , (obj , i) =>{
                                        return  <div key={i} className={`vip-banner-card vip${i} ${vipActive == i ? `active` : ''} ${vipCount >= i ? `unlocked` : ''}`}/>
                                    })}
                                    
                                </div>

                                
                                <div className="vip-data-range-wrap">
                                    <div className="vip-data-range">
                                        <div className={`vip-data-range-span vp-${vipCount}`}>VIP{vipCount}</div>
                                        <div className="vip-data-range-line">
                                            <div className="vip-data-per-val" style={{ left: viProgVal }}>{viProgVal}%</div>
                                            <div className="vip-data-per-range" style={{ width: `${viProgVal}%` }} ></div>
                                        </div>
                                        <div className={`vip-data-range-span vp-${vipLevel}`}>VIP{vipLevel}</div>


                                    </div>
                                    <div className="vip-wrap-t-b-caption">
                                        您已完成{vipAmount}流水 （每日16点更新）
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* DATA */}
                        <div className="vip-body-section">
                            <div className="vip-section-title">
                                <span>VIP特权</span>
                            </div>
                            
                            <div className="vip-body-data">
                                <div className="vip-card-wrap">
                                    
                                    {map(vipSlideValue , (obj , i) =>{
                                        return  <div key={i} className={`vip-card-item ${vipActive == i ? `active` : ''}`}>
                                                    <div className="vip-card-item-box rocket">
                                                        
                                                        <div className="vci-box-cont rocket">
                                                            <div className="vci-box-icon rocket"/>

                                                            <div className="vci-box-body rocket">
                                                                <div className="vci-box-body-value">
                                                                    <span className="val">{obj.item1}</span>
                                                                    <span>元</span>
                                                                </div>
                                                                <div className="vci-box-body-caption">升级礼金</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="vip-card-item-box pocket">
                                                        
                                                        <div className="vci-box-cont pocket">
                                                            <div className="vci-box-icon pocket"/>

                                                            <div className="vci-box-body pocket">
                                                                <div className="vci-box-body-value">
                                                                    <span className="val">{obj.item2}</span>
                                                                    <span>元</span>
                                                                </div>
                                                                <div className="vci-box-body-caption">每月红包</div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="vip-card-item-box graph">
                                                        
                                                        <div className="vci-box-cont graph">
                                                            <div className="vci-box-icon graph"/>

                                                            <div className="vci-box-body graph">
                                                                <div className="vci-box-body-value">
                                                                    <span className="val">{obj.item3}</span>
                                                                    <span>元</span>
                                                                </div>
                                                                <div className="vci-box-body-caption">提款次数提升</div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="vip-card-item-box coins">
                                                        
                                                        <div className="vci-box-cont coins">
                                                            <div className="vci-box-icon coins"/>

                                                            <div className="vci-box-body coins">
                                                                <div className="vci-box-body-value">
                                                                    <span className="val">{obj.item4} </span>
                                                                    <span>万<small>/日</small></span>
                                                                </div>
                                                                <div className="vci-box-body-caption">提款额度提升</div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                   
                                                </div>
                                    })}
                                
                                </div>
                            </div>

                        </div>
                        {/*  GRID */}
                        <div className="vip-body-section">
                            <div className="vip-section-title">
                                <span>VIP优惠</span>
                            </div>

                            <div className="vip-body-grid">
                                <div className="vip-grid-wrap">
                                    {map(vipSlideValue , (obj , i) =>{

                                        return  <div key={i} className={`vip-grid-item ${vipActive == i ? `active` : ''}`}>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid1}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            体育返水
                                                        </div>
                                                    </div>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid2}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            电竞返水
                                                        </div>
                                                    </div>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid3}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            篮球返水
                                                        </div>
                                                    </div>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid4}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            真人返水
                                                        </div>
                                                    </div>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid5}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            棋牌返水
                                                        </div>
                                                    </div>
                                                    <div className="vip-s-i-body-cont-item">
                                                        <div className="vip-s-i-body-cont-item-title">
                                                            {obj.grid6}%
                                                        </div>
                                                        <div className="vip-s-i-body-cont-item-text">
                                                            电子返水
                                                        </div>
                                                    </div>
                                                </div>
                                    })}

                                </div>
                            </div>


                        </div>
                        {/* TABLE */}
                        <div className="vip-body-section">
                            <div className="vip-section-title">
                                <span>返水与比例</span>
                            </div>

                            <div className="vip-body-table">
                                <div className="vip-body-table-wrap">
                                    <div className="vip-body-table-col">
                                        {map(vipTitles , (obj ,i ) => {
                                            return  <div key={i} className="v-body-t-r-box title">
                                                        <span>{obj}</span>
                                                     </div>
                                        })}

                                        
                                    </div>
                                    {map(vipVal , (obj ,i ) => {
                                        return  <div key={i} className="vip-body-table-col">
                                                    <div key={i} className={`v-body-t-r-box title vip${i} ${vipCount == i ? `active` : ''}`}>
                                                        <span>VIP{i}</span>
                                                     </div>
                                                    {map(obj ,(val,key) =>{
                                                        return  <div key={key} className={`v-body-t-r-box ${vipCount == i ? `active` : ''}`} >
                                                                    <span>{val.value}%</span>
                                                                </div>
                                                    })}
                                                </div>
                                            
                                    })}
                                </div>
                            </div>


                        </div>
                        {/* RULES */}
                        <div className="vip-body-section">
                            <div className="vip-section-title">
                                <span>条款与规则</span>
                            </div>

                            <div className="vip-body-rules">
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">VIP多端共享原则</div>
                                    <div className="vip-body-rules-parag">
                                    在UEDBet综合、UEDBet体育、UEDBet棋牌进行打码都会被计算成VIP的晋级策略；打造全平台终端共享VIP的极致体验。
                                    </div>
                                </div>
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">保级策略</div>
                                    <div className="vip-body-rules-parag">
                                    会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求从新按照当前等级计算。
                                    </div>
                                </div>
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">降级惩罚</div>
                                    <div className="vip-body-rules-parag">
                                    如果会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。
                                    </div>
                                </div>

                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">实物名品</div>
                                    <div className="vip-body-rules-parag">
                                        达到相应等级的VIP会员可联系在线客服进行申请，礼品不能折算为现金，每个级别的名贵礼品每位会员仅能获得1次。UEDBet娱乐对名贵礼品拥有最终解释权。
                                    </div>
                                    <div className="vip-body-rules-caption">(名贵礼品仅针对VIP6/VIP7/VIP8/VIP9/VIP10会员)</div>

                                </div>
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">升级礼金</div>
                                    <div className="vip-body-rules-parag">
                                    升级礼金在会员达到该会员级别后系统自动派发，每个级别的升级礼金每位会员仅能获得1次。
                                    </div>
                                    <div className="vip-body-rules-caption">(升级礼金1倍流水即可提款）</div>

                                </div>
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">每月红包</div>
                                    <div className="vip-body-rules-parag">
                                    会员在上个月有过至少1次成功存款，即可在每月1号获得上个月相应等级的每月红包彩金。
                                    </div>
                                    <div className="vip-body-rules-caption">(每月红包彩金1倍流水即可提款）</div>

                                </div>
                                <div className="vip-body-rules-section">
                                    <div className="vip-body-rules-title">天天返水</div>
                                    <div className="vip-body-rules-parag">
                                    每天返水在15:00~15:30期间发放完毕。
                                    </div>
                                </div>
                            </div>

                            <div className="vip-footer">UEDBet保留对活动的修改，停止及最终解释权</div>

                        </div>

                    </div>
                </div>

            </div>


}

export default withAuth(VipWrap, 1);
