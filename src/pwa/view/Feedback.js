import React , { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Wrap } from "../view/profile/";
import ToolTip from '../component/ToolTip'
import "../assets/scss/Feedback.scss";





const Feedback = () => {
  const history = useHistory();
  const [ tool , setTool] = useState(false)

  useEffect(() =>{
    setTimeout(() => {
        setTool(false)
    }, 3000);
  },[tool])

  const copyToClipboard = (e) => {
    // navigator.clipboard.writeText(qrLink);
    const el = document.createElement("textarea");
    el.value = "manager.ued@gmail.com";
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setTool(true)

  };

  // console.log(tool)

  return (
    <Wrap
      className="feedback-wrap"
      centerName="意见反馈"
      faq={false}
      sublevel={[true, () => history.goBack()]}
    >
      <div className="feedback-wrap-inner">
        <div className="feedback-wrap-inner-content">
          <div className="feedback-logo">
            <div className="logo"></div>
          </div>
          <div className="feedback-wrap-body">
            <div className="feedback-body-text">
              <p>尊敬的会员,欢迎说出您对本公司的意见,建议甚至投诉。</p>
              <p>
                公司经理将会亲自查收您的邮箱, 并在工作日的24小时候内回复您。
              </p>
              <p>您的建议是我们前进的动力,我们会对有价值的信息给与奖励。</p>
            </div>

            <div className="feedback-action">
              <div className="feedback-action-caption">经理邮箱:</div>
              <button onClick={copyToClipboard}>
                  <ToolTip show={tool} />
                  manager.ued@gmail.com
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default Feedback;
