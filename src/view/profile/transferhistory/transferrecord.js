import React  ,{ useEffect, useState }from "react";
import { map , head,  last , split,isEmpty } from 'lodash'

import { Service } from '../'



const CardItem = (props) => {
    const { label, subLabel, time, value, status, className } = props;
  
    return (
      <div className={`transfer-record-card-item ${className ? className : ""}`}>
        <div className="cl-item transfer-record-card-text">
          <p className="cl-card-text">
            <span>{label}</span>
            {subLabel && <span>{subLabel}</span>}
          </p>
          <p className="cl-card-time">{time}</p>
        </div>
        <div className="cl-item transfer-record-card-value">
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

const TransferRecord = (props) => {
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
              record_type: "transfer",
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
              console.log("Unable to response:", e);
          })
        };
        fetch();
    }, [load]);

    if(!isEmpty(items)){
        return  <div className="transfer-history-card-body">
                    {
                    map(items, (obj, i) => {
                        let reg = split(obj.platName, "-->", 2);
                        return (
                        <CardItem
                            key={i}
                            index={i}
                            label={head(reg)}
                            subLabel={last(reg)}
                            time={obj.requestTime}
                            value={obj.amount}
                            status={obj.tranStatus}
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

export default TransferRecord