import React  from "react";

const CardItem = (props) => {
  const {
    label,
    time,
    value,
    status,
    index,
    className,
    obj,
    onSetKey,
    setKey,
  } = props;
  //成功 SUCCESS
  //失败 FAILURE
  //未审核 UNREVIEWED
  //出款中 WITHDRAWING
  let statusText = "";
  let classStatus = "";
  let cancel = false;
  let fail = false;
  if (status === "成功") {
    statusText = "成功";
    classStatus = "success";
  }

  if (status === "失败") {
    statusText = "失败";
    classStatus = "failure";
    fail = true;
  }

  if (status === "未审核") {
    statusText = "未审核";
    classStatus = "unreviewed";
    cancel = true;
  }

  if (status === "出款中") {
    statusText = "出款中";
    classStatus = "withdrawing";
  }

  if (status === "汇款中") {
    statusText = "汇款中";
    classStatus = "remittance";
  }

  return (
    <div
      className={`withdrawal-history-card-item ${className ? className : ""}`}
    >
      <div className="cl-item withdrawal-history-card-text">
        <p className="cl-card-text">{label}</p>
        <p className="cl-card-time">{time}</p>
      </div>
      <div className="cl-item withdrawal-history-card-value">
        {cancel && (
          <span className="cancel" onClick={() => props.onCancel(obj)}>
            取消提款
          </span>
        )}
        <p className="cl-card-amount">
          金额: <span>{value}</span>
        </p>
        <p className={`cl-card-status ${classStatus}`}>
          <span>
            {statusText}
            {fail && (
              <span className="fail" onClick={() => onSetKey(index)}>
                {setKey === index && <span>{obj.verifyComment}</span>}
                <i />
              </span>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CardItem