import React, { useEffect, useState } from "react";
import { map , isEmpty} from "lodash";
import { withAuth } from "../../util";

import { Service } from "./";

import Wrap from "./Wrap";

const status = ["未读", "已读"];
const Inbox = () => {
  const [messages, setMessages] = useState({
    status: 0,
    list: null,
  });

  const [read, setRead] = useState(null);

  useEffect(() => {
    const req = Service.Inbox.read({
      record_type: "message",
    });
    req.promise.then(
      (r) => {
        // console.info(r);
        setMessages({
          status: 1,
          list: r.info,
        });
      },
      (e) => {
        console.warn(e);
      }
    );
  }, []);

  const onRead = (id) => {
    Service.Inbox.readCurrent({ id }).promise.then(
      (r) => {
        console.info(r);
        setRead(r.info);
      },
      (e) => {
        console.warn(e);
      }
    );
  };

  console.log( messages.list )

  return (
    <Wrap className="profile-inbox-desktop" title={"信息"}>
      <div className="profile-section section-box">
        
        {/* <div className="profile-section-title">信息</div> */}

        <div className="profile-section-message-wrap">
          {!isEmpty(messages.list) ? (
            <div className="profile-section-message-list">
              {map(messages.list, (obj, i) => {
                return (
                  <div
                    key={i}
                    className="p-section-m-item"
                    onClick={() => onRead(obj.id)}
                  >
                    <div className="p-section-m-subject">{obj.subject}</div>
                    <div className="p-section-m-time">{obj.send_time}</div>
                    <div className="p-section-m-status">
                      <span className={obj.message_status == 0 ? "unread" : ""}>
                        {status[obj.message_status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="profile-section-message-norecord">
              <div className="profile-section-message-norecord-wrap">
                <i />
                <span>找不到讯息</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {read && (
        <div className="read-message">
          <div className="read-message-wrap">
            <div className="read-message-title">信息</div>

            <div className="read-message-content">
              <div className="read-message-subject-time">
                <span>{read.subject}</span>
                <span>{read.send_time}</span>
              </div>
              <div className="read-message-text">{read.content}</div>
            </div>
            <div className="read-message-button">
              <button onClick={() => setRead(null)}>确定</button>
            </div>
          </div>
        </div>
      )}
    </Wrap>
  );
};

export default Inbox;
