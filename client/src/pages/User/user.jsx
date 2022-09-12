import {
  Button,
  Container,
  Grid,
  Typography,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import "./user.css";
import Axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Account from "./../../components/account/account";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// My Account Details
// const apiId = 17720656;
// const apiHash = "db2355877197069b70d88dfb586a4fd8";
// const phoneNo = "+923494965651";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  rowGap: 5,
};

const User = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  let [apiId, setApiId] = useState(false);
  const [apiHash, setApiHash] = useState(false);
  const [phoneNo, setPhoneNo] = useState(false);
  const stringSession = new StringSession("");
  const handleClose = () => {
    setOpenModal(false);
  };
  const activeModal = () => {
    setOpenModal(true);
  };
  const addAccount = async () => {
    try {
      console.log("Loading interactive example...");
      apiId = Number(apiId);
      const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        useWSS: true,
      });
      await client.start({
        phoneNumber: phoneNo,
        phoneCode: () => prompt("Enter Code"),
        onError: (err) => console.log(err),
      });
      console.log("You should now be connected.");
      const token = client.session.save();
      if (token) {
        const newAccount = await Axios({
          method: "POST",
          url: "http://localhost:4000/createAccount",
          withCredentials: true,
          data: {
            apiId: apiId,
            apiHash: apiHash,
            token: token,
            phoneNo: phoneNo,
          },
        });
        console.log(newAccount);
        window.location.reload();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={activeModal} id="addAccountBtn">
        Add Account
      </Button>

      <div className="userSection">
        <Modal
          open={openModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Button id="modal-close" onClick={handleClose}>
              <CloseIcon />
            </Button>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter Your Telegram Account Details
            </Typography>
            <TextField
              onChange={(e) => setApiId(e.target.value)}
              label="Api Id"
              placeholder="1224353"
              color="secondary"
              focused
              id="modal-text"
            />
            <TextField
              onChange={(e) => setApiHash(e.target.value)}
              label="Api Hash"
              placeholder="38398989738792232"
              color="secondary"
              focused
              id="modal-text"
            />
            <TextField
              onChange={(e) => setPhoneNo(e.target.value)}
              label="Phone No"
              placeholder="+923111111111"
              color="secondary"
              focused
              id="modal-text"
            />
            <Button variant="contained" onClick={addAccount}>
              Submit
            </Button>
          </Box>
        </Modal>

        <Container maxWidth="lg" className="userSection-container">
          <h1 id="title">Telegram Multiple Accounts</h1>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {data.accounts.map((el, i) => (
              <Grid item xs={6} key={i}>
                <Account account={el} key={i} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
};
export default User;
