import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import User from "./pages/User/user";

import { Button, Container, Grid, Typography } from "@mui/material";

function App() {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/isLoggedIn",
    }).then((res) => {
      console.log(res.data.user);
      setData(res.data.user);
      setAuthentication(true);
    });
  }, []);

  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:4000/register",
    }).then((res) => console.log(res));
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:4000/login",
    }).then((res) => {
      console.log(res);
      if (res.data.message === "success") {
        console.log("true");
        setData(res.data.user);
        setAuthentication(true);
      }
      // window.location.reload();
    });
  };
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/user",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  const logOut = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:4000/logOut",
    }).then((res) => {
      console.log(res);
      setAuthentication(false);
    });
  };

  if (isAuthenticated === true && data) {
    return (
      <div className="App">
        <Button variant="contained" onClick={logOut} id="logoutBtn">
          Log Out
        </Button>
        <User data={data} />
      </div>
    );
  } else {
    return (
      <Container maxWidth="lg">
        <div className="App">
          <Typography variant="h1" component="h1">
            Telegram Multiple Accounts
          </Typography>
          <div>
            <Typography variant="h2" component="h6">
              Register
            </Typography>
            <input
              placeholder="username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
              placeholder="password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button onClick={register}>Submit</button>
          </div>

          <div>
            <Typography variant="h2" component="h6">
              Login
            </Typography>
            <input
              placeholder="username"
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              placeholder="password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={login}>Submit</button>
          </div>

          <div>
            <Typography variant="h2" component="h6">
              Get User
            </Typography>
            <button onClick={getUser}>Submit</button>
            {data ? (
              <Typography variant="h2" component="h6">
                Welcome Back {data.username}
              </Typography>
            ) : null}
          </div>
        </div>
      </Container>
    );
  }
}

export default App;
// https://painor.gitbook.io/gramjs/working-with-messages/messages.getmessages
