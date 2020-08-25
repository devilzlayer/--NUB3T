import React , {useEffect , useState , useMemo , useContext } from "react";
import { map, filter , head , size } from "lodash";
import * as moment from "moment";
import Picker from "react-mobile-picker";

import { Service } from '../'

import PickerWrap from './picker'


const banks = [
    "中国工商银行",
    "中国建设银行",
    "中国银行",
    "中国农业银行",
    "中国邮政储蓄银行",
    "招商银行",
    "交通银行",
];

const CardWrap = (props) =>{
    const { show , onHide} = props

    const { setUserAuthFN ,userAuth } = useContext(Service.User.Context);

    const [tempBank, setTempBank] = useState(head(banks));


    const [cardList, setCardList]   = useState(null);
    const [delKey, setDelKey]       = useState(null);

    const [ animate , setAnimate ]      = useState(false)
    const [ showCard , setShowCard ]    = useState(false)

    const [form, setForm] = useState({
        bank_type       : "中国工商银行",
        bank_province   : "贵州",
        bank_city       : "遵义市",
        realname        : userAuth.data.realName || "",
        bank_addr       : "",
        bank_no         : "",
    });
      
    useEffect(() =>{
        if(show){
            setTimeout(() => {
                setAnimate(true)
            }, 500);
        }

        const res = Service.Card.read({
            ...Service.User.read(),
        });
      
        res.promise.then( (r) => {
              // console.log(r)
              setCardList(r.info);
        },(e) => {
              console.warn("Unable to get cards:", e);
         });
    }, [show])


    const onAddBnk = () =>{
        const { bank_addr , bank_no  } = form
        if(size(cardList) == 5){
            setUserAuthFN( userAuth.status , userAuth.data , {
                text    : '系统提示',
                message : "绑定的银行信息不能超过5条",
            })
        }
        if(!bank_addr || ! bank_no){
            return false
        }

        Service.Card.create({
            ...Service.User.read(),
            ...form,
        }).promise.then((r) => {
              setForm((f) => ({
                ...f,
                bank_addr: "",
                bank_no: "",
              }));
              Hide()
        },(e) => {
            console.info("Unable to bind the card:", e);
         });
    }

    const Hide = () => {
        setAnimate(false)
        setTimeout(() => {
            onHide()
        }, 500);
    }


    const onDel = (i) => {
        setDelKey(null);
        if (delKey != i) setDelKey(i);
    };
    
    const onSelectBnk = (event) =>{
        setShowCard(false)
        setForm( e =>({
            ...e,
            bank_type: event
        }))
    }

    const onChange =(e) =>{
        const { name, value } = e.target;
        setForm( f => ({
            ...f,
            [name]: value,
        }));
    }
    
    
    let delCount = 0;
    return  <div className={`withdrawal-card-wrap ${show ? 'show' : ''}`}>

                <div className={`withdrawal-card-wrap-box new ${animate && show == 'new' ? 'animate' : ''}`}>
                    <span className="w-n-c-arrow" onClick={Hide} />
                    <div className="withdrawal-card-wrap-content">
                        <div className="wcwc-title">新增银行卡</div>

                        <div className="wcwc-form">
                            <div className="wcwc-form-field" onClick={() => setShowCard(true)}>
                                <label>开户银行</label>
                                <div className="wcwc-input">{form.bank_type}</div>
                            </div>
                            <div className="wcwc-form-field">
                                <label>开户支行</label>
                                <input className="wcwc-input" name="bank_addr" onChange={onChange}/>
                            </div>
                            <div className="wcwc-form-field">
                                <label>开户人姓名</label>
                                <div className="wcwc-input">{form.realname}</div>
                            </div>
                            <div className="wcwc-form-field">
                                <label>银行卡号</label>
                                <input className="wcwc-input" name="bank_no" onChange={onChange} />
                            </div>

                            <div className="w-n-c-set-defaul-wrap"><span className="active">默认银行卡</span></div>
                            <button className="wcwc-add-button" onClick={onAddBnk}>新增银行卡</button>
                        </div>
                    </div>

                </div>
                
                <div className={`withdrawal-card-wrap-box del ${animate && show == 'del' ? 'animate' : ''}`}>
                    <span className="w-n-c-arrow" onClick={Hide} />
                    <div className="withdrawal-card-wrap-content">
                        <div className="wcwc-title">删除卡</div>

                        <div className="w-n-c-del-wrap">
                            {cardList && map(cardList, (obj, i) => {
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
                </div>

                <PickerWrap 
                    options={banks} 
                    show={showCard}
                    onHide={() => setShowCard(false)}
                    selected={form.bank_type}
                    onSelect={onSelectBnk}
                />

                
            </div>
}

export default CardWrap