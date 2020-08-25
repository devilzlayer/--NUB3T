import React  ,{ useEffect, useState }from "react";
import { map , isEmpty} from 'lodash'

import { Service } from '../'



const CardItem = (props) => {
    const { label, time, value, status, className } = props;
    return (
      <div className={`deposity-history-card-item ${className ? className : ""}`}>
        <div className="cl-item deposity-history-card-text">
          <p className="cl-card-text">{label}</p>
          <p className="cl-card-time">{time}</p>
        </div>
        <div className="cl-item deposity-history-card-value">
          <p className="cl-card-amount">
            金额: <span>{value}</span>
          </p>
          <p
            className={`cl-card-status ${
              status === "成功" ? "success" : "failure"
            }`}
          >
            {/* <span>	{status? "成功" : "失败"}</span> */}
            <span>{status}</span>
          </p>
        </div>
      </div>
    );
  };

const RebateHistory = (props) => {
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
              record_type: "deposit",
              type: "record_list",
          });

          req.promise.then((result) => {
              if (result.status === 1) {
                  setItems(result.info);
                  setLoad(false)
                  onStop()
              }
          },(e) => {
              console.log("Unable to response:", e);
          })
        };
        fetch();
    }, [load]);

    if(!isEmpty(items)){
        return  <div className="deposit-history-card-body">
                    {
                    map(items, (obj, i) => {
                        return (
                        <CardItem
                            key={i}
                            label={obj.payType}
                            time={obj.endTime}
                            value={obj.amount}
                            status={obj.status}
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

export default RebateHistory