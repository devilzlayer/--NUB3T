import React , { useRef , useEffect , useState } from "react";
import { map, filter , head } from "lodash";

const PickerWrap = (props) =>{
    const { show, onHide ,options , selected , onSelect } = props

    const [ pick  , SetPick ] = useState(null)
    const bodyItem  = useRef(null)

    useEffect(() =>{
        SetPick(selected)
    },[selected])


    const onPick = (e) =>{
        SetPick(e)
    }
    const onClick  = () =>{
        onSelect(pick)
    }


    return      <div className={`bank-picker ${show ? 'show' : ''}`}>
                    <div className="bank-picker-wrap">
                        <div className="bank-picker-content">
                            <div className="bank-picker-head"><span>选择开户银行</span></div>
                            <div className="bank-picker-body">
                                <div className="bank-picker-body-wrap"  ref={bodyItem}>
                                    {options && map(options , (obj ,i ) =>{
                                        return <div key={i} className={`bank-picker-item ${pick == obj ? 'active' : ''}`} onClick={() => onPick(obj)}>{obj}</div>
                                    })}
                                </div>
                                {/* <div className="bank-picker-body-item-highlight" /> */}
                                
                            </div>
                        </div>

                        <div className="bank-picker-footer">
                            <button onClick={onHide}>取消</button>
                            <button className="active" onClick={onClick}>确定</button>
                        </div>
                    </div>
                </div>
}

export default PickerWrap
