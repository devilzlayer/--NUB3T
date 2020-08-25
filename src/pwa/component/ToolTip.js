import React from "react";

const ToolTip = (props) => {
  const { show } = props;
  return (
    <div className={`tool-tip-copied ${show ? "show" : ""}`}>复制成功</div>
  );
};

export default ToolTip;
