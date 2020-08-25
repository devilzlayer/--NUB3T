import React , { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Wrap } from "../view/profile/";
import ToolTip from '../component/ToolTip'

import "../assets/scss/JoinUs.scss";
import qrCodeImage from "../assets/img/joinus/wechat-qr-code.png";



const JoinUs = () => {
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
    el.value = "agent.ued@gmail.com";
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
      className="joinus-wrap"
      centerName="加入我们"
      faq={false}
      sublevel={[true, () => history.goBack()]}
    >
      <div className="joinus-wrap-inner">
        <div className="joinus-wrap-inner-content">
          <div className="joinus-logo">
            <div className="logo"></div>
          </div>
          <div className="joinus-wrap-body">
            <div className="joinus-body-text">
              <p>如果您有合作意向请通过以下渠道联系我们</p>
            </div>

            <div className="joinus-details-list">
              <div className="joinus-details-item">
                <i className="qq-code" />
                <span>QQ: 3336967374</span>
              </div>
              <div className="joinus-details-item">
                <i className="we-chat" />
                <span>代理微信: lzcwxh1 </span>
              </div>
            </div>

            <div className="joinus-qr-code">
              <img src={qrCodeImage} alt="QR Code WeChat" />
            </div>

            <div className="joinus-action">
              <div className="joinus-action-caption">邮箱:</div>
              <button onClick={() => [copyToClipboard() , setTool(true)]}>
                <ToolTip show={tool} />
                agent.ued@gmail.com</button>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default JoinUs;
