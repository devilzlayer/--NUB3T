import React, { forwardRef, useState, useEffect } from "react";
import cx from "classnames";
import useClickOutside from "click-outside-hook";

import "../assets/scss/LiveChat.scss";

const FrameURL = "https://vm.providesupport.com/01kenrfglk04u0n305fdg0321r";

const LiveChat = (props) => {
  const { popup, onPop, idkey, withoutTop } = props;
  const [shown, setVisibility] = useState(false);

  const ref = useClickOutside(() => {
    setTimeout(() => {
      if (popup) {
        onPop();
      }
    }, 100);
  });

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={ref} className={cx("live-chat-wrap", { shown: popup })}>
      {withoutTop ? null : (
        <>
          <button className="live-chat-icon" onClick={() => onPop()}>
            <i />
            <span>在线客服</span>
          </button>
          <button className="live-chat-top" onClick={() => goTop()}>
            <i />
            <span>回到顶部</span>
          </button>
        </>
      )}
      <div className="live-chat-chat">
        {popup ? (
          <iframe title="live chat" src={FrameURL} frameBorder="0" />
        ) : null}
      </div>
    </div>
  );
};

export default LiveChat;
