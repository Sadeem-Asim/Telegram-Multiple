/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./account.css";
import { TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions";
import Message from "./../messages/messages";
import { Circles } from "react-loader-spinner";

const Account = ({ account }) => {
  let { apiId, apiHash, token, phoneNo } = account;
  const stringSession = new StringSession(token);
  apiId = parseInt(apiId);
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    retryDelay: 1_000,
    autoReconnect: true,
    connectionRetries: 5,
    useWSS: true,
    requestRetries: 2,
  });
  const [contacts, setContacts] = useState(null);
  const [allContacts, setAllContacts] = useState(null);
  const [currentChatBox, setCurrentChatBox] = useState(null);
  const [message, setMessage] = useState("");
  const sendMessage = async () => {
    if (currentChatBox) {
      client.connect().then(async () => {
        setMessage("");
        if (currentChatBox.className === "Chat") {
          await client.invoke(
            new Api.messages.GetAllChats({
              exceptIds: [7475723],
            })
          );
        }
        client
          .sendMessage(currentChatBox.id, {
            message: message,
          })
          .then(() => {
            client.disconnect();
          });
      });
      setCurrentChatBox(currentChatBox);
    } else {
      console.log("Select A Chat To Start Messaging");
    }
  };

  const searchContacts = (e) => {
    let search = e.target.value.toLowerCase();
    let searchResult = allContacts.filter((el) => {
      if (el.firstName) {
        return el.firstName.toLowerCase().includes(search);
      } else if (el.title) {
        return el.title.toLowerCase().includes(search);
      } else {
        return null;
      }
    });
    setContacts(searchResult);
  };

  useEffect(() => {
    client.connect().then(async () => {
      console.log("You should now be connected.");

      const allChats = await client.invoke(
        new Api.messages.GetAllChats({
          exceptIds: [7475723],
        })
      );
      const allContacts = await client.invoke(
        new Api.contacts.GetContacts({
          hash: 3457568,
        })
      );
      const { users } = allContacts;
      const { chats } = allChats;
      const allUsers = users.concat(chats);
      setContacts(allUsers);
      setAllContacts(allUsers);
      client.addEventHandler(async (update) => {
        if (update.className === "UpdateNewChannelMessage") {
          console.log("Received new Update");
          console.log(update);
        } else if (update.className === "UpdateShortMessage") {
          console.log("Received new Update");
          console.log(update.message);
          setCurrentChatBox(currentChatBox);
        }
      });
    });
  }, []);

  if (contacts) {
    return (
      <>
        <div className="account-container">
          <div className="left-side">
            <div className="dialog">
              <div className="dialog-header">
                <span className="dialog-heading">Telegram</span>
              </div>
              <div className="search-container">
                <TextField
                  id="standard-basic"
                  label="Search"
                  variant="standard"
                  onChange={searchContacts}
                />
              </div>
            </div>
            <div className="chats">
              {contacts.map((el, i) => {
                let name;
                let { firstName } = el;
                let { title } = el;
                if (firstName) {
                  name = firstName;
                } else if (title) {
                  name = title;
                } else {
                  name = "null";
                }
                return (
                  <div
                    className="chats-container"
                    key={i}
                    onClick={() => {
                      setCurrentChatBox(el);
                    }}
                  >
                    <div className="user-avatar">{`${name.substring(
                      0,
                      1
                    )}`}</div>
                    <div className="user-name">
                      {`${name.substring(0, 7)}`}..
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="right-side">
            {currentChatBox ? (
              <div className="header">
                <div className="chat-name">{`${
                  currentChatBox.firstName
                    ? currentChatBox.firstName.substring(0, 15)
                    : currentChatBox.title.substring(0, 15)
                }`}</div>

                <div className="accountNo">{phoneNo}</div>
              </div>
            ) : (
              <div className="header">
                <div className="chat-name">Welcome</div>
                <div className="accountNo">{phoneNo}</div>
              </div>
            )}
            <Message
              stringSession={stringSession}
              apiId={apiId}
              apiHash={apiHash}
              element={currentChatBox}
            />
            <div className="sendMessage">
              <input
                className="input-message"
                placeholder="Write A Message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <SendIcon className="send-icon" onClick={sendMessage} />
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className="account-container spinner">
        <Circles
          height="120"
          width="120"
          radius="9"
          color="blue"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
          visible={true}
        />
      </div>
    );
  }
};
export default Account;
