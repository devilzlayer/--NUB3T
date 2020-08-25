import React  ,{ useEffect, useState }from "react";
import { map , isEmpty} from 'lodash'

import { Service } from '../'


const CardItem = (props) => {
    const { label, time, value, status, className } = props;
    return (
      <div className={`promo-history-card-item ${className ? className : ""}`}>
        <div className="cl-item promo-history-card-text">
          <p className="cl-card-text">{label}</p>
          <p className="cl-card-time">{time}</p>
        </div>
        {value && (
          <div className="cl-item promo-history-card-value">
            <p className="cl-card-amount">
              金额: <span>{value}</span>
            </p>
            <p className={`cl-card-status ${status ? "success" : "failure"}`}>
              <span> {status ? "成功" : "失败"}</span>
            </p>
          </div>
        )}
      </div>
    );
};

const PromoHistory = (props) => {
    const { id ,refresh , onStop } = props

    const [items, setItems] = useState([]);
    const [load, setLoad] = useState(false);

    useEffect(() =>{
      if(refresh == id ){
        setLoad(true)
      }
    },[refresh])

    useEffect(() => {
        const fetch = () => {
        // console.log(User.read())

        const req = Service.Transaction.read({
            ...Service.User.read(),
            record_type: "promotion",
            type: "record_list",
        });

        req.promise.then((result) => {
            // console.log(result);
            if (result.status === 1) {
                setItems(result.info);
                setLoad(false);
                onStop()

            }
        },(e) => {
            // console.log("Unable to response:", e);
        })
        };
        fetch();
    }, [load]);

    if(!isEmpty(items)){
        return  <div className="promo-history-card-body">
                    {
                    map(items, (obj, i) => {
                        return (
                        <CardItem
                            key={i}
                            label={obj.title}
                            time={obj.addTime}
                            value={obj.promMoney}
                            status={true}
                        />
                        );
                    })
                    }

                </div>
    }

    return  <div className="no-transactions">
                <div className="image-box" />
                <span>暂无记录</span>
            </div>


}

export default PromoHistory