/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { TelegramClient, Api } from "telegram";
import { RotatingSquare } from "react-loader-spinner";

import "./messages.css";

const Message = ({ element, stringSession, apiId, apiHash }) => {
  let client = new TelegramClient(stringSession, apiId, apiHash, {
    retryDelay: 1_000,
    autoReconnect: true,
    connectionRetries: Infinity,
    useWSS: true,
    requestRetries: 2,
  });
  const [currentMessages, setCurrentMessages] = useState(null);
  const [loaderState, setLoaderState] = useState(false);
  useEffect(() => {
    if (element) {
      setLoaderState(true);
      let msgs;
      client.connect().then(async () => {
        console.log("You should now be connected.");
        if (element.className === "Chat") {
          await client.invoke(
            new Api.messages.GetAllChats({
              exceptIds: [7475723],
            })
          );
          msgs = await client.getMessages(element.id, {
            limit: 10,
          });
        } else {
          msgs = await client.getMessages(element.id, {
            limit: 10,
          });
        }
        console.log(msgs);
        setCurrentMessages(msgs);
        setLoaderState(false);
        client.disconnect();
      });
    }
    // setLoaderState(false);
  }, [element]);

  if (currentMessages)
    if (currentMessages.length >= 1) {
      return (
        <>
          <div className="messages-box">
            {currentMessages
              .map((el, i) => {
                const { message } = el;
                if (message === "") return null;
                return (
                  <span className="message" key={i}>
                    {message}
                  </span>
                );
              })
              .reverse()}
          </div>
        </>
      );
    }
  if (loaderState === true) {
    return (
      <div className="messages-box spinner">
        <RotatingSquare
          height="80"
          width="80"
          radius="9"
          color="blue"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
          visible={loaderState}
        />
      </div>
    );
  }
  return (
    <>
      <div className="messages-box-default">
        <span className="message me">Select A Chat To Start Messaging</span>
      </div>
    </>
  );
};
export default Message;
