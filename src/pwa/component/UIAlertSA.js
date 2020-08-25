import React, { useEffect } from "react";
import useClickOutside from "click-outside-hook";
import cx from "classnames";

import { Icon } from "../../component/";

import "../assets/scss/UIAlertSA.scss";

const UIAlertSA = (props) => {
  const { shown, title, message, onClose, children } = props;

  const ref = useClickOutside(onClose);

  useEffect(() => {
    if (shown && children) {
      window.scrollTo(0, 0);
      document.body.classList.add("no-scroll");
    } else if (!shown) document.body.classList.remove("no-scroll");
  }, [shown]);

  if (!shown) {
    return null;
  }

  return (
    <div
      className={cx(
        "ui-alert-sa",
        { shown: shown },
        children && "with-background"
      )}
    >
      <div className="ui-alert-sa--sublayer" ref={ref}>
        {children ? (
          children
        ) : (
          <div className="ui-alert-sa--layer">
            <div className="ui-alert-sa--head">
              <h1>{title}</h1>
              <button onClick={onClose}>
                <Icon name="close-circle-sharp" />
              </button>
            </div>
            <div className="ui-alert-sa--body">
              <p>{message}</p>
              <div className="button-wrap">
                <button className="button-stylized" onClick={onClose}>
                  确认
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIAlertSA;
