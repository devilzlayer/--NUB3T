import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LiveChatSA } from "../../component/";

const Wrap = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { className, isLoading, name, centerName, faq = true } = props;
  const [livechat, setLiveChat] = useState(false);

  return (
    <div
      className={`profile-wrap-sa ${className} with-loader${
        isLoading ? " loading" : ""
      }`}
    >
      <div className="load-spin"></div>
      <div className="profile-wrap-sa-head">
        {props.sublevel && props.sublevel[0] ? (
          <button onClick={() => props.sublevel[1]()}>
            <div className="next-arrow" />
            {props.sublevel[2] || name ? (
              <span>{props.sublevel[2] || name}</span>
            ) : null}
          </button>
        ) : (
          <Link to="/profile">
            <div className="next-arrow" />
            <span>{name}</span>
          </Link>
        )}
        {centerName ? <div className="center-name">{centerName}</div> : null}
        {faq ? (
          <div className="faq-button" onClick={() => setLiveChat(true)} />
        ) : null}
      </div>
      <div className="profile-wrap-sa-content">
        <div className="content-inner">{props.children}</div>
      </div>
      <LiveChatSA shown={livechat} onClose={() => setLiveChat(false)} />
    </div>
  );
};

export default Wrap;
