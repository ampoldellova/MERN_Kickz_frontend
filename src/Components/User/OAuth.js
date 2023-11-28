// OAuth.js
import React, { useState, Fragment } from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";
import app from "../../firebase";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { authenticateGoogle } from "../../utils/helpers";
import GoogleIcon from '@mui/icons-material/Google';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function OAuth() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    let location = useLocation();
    const redirect = location.search
        ? new URLSearchParams(location.search).get("redirect")
        : "";

    const signInWithGoogle = async (email, password) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data } = await axios.post(
                `http://localhost:4002/api/v1/google`,
                {
                    email: user.email,
                    name: user.name || user.email,
                    avatar: user.photoURL,
                },
                config
            );

            setUser(user);
            authenticateGoogle(data, () => {
                if (data.newUser) {
                    navigate(`/login`);
                } else {
                    navigate(`/${redirect}`);
                }
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            });
        } catch (error) {
            console.error(error.message);
        }
    };
    return (
        <Fragment>
            <Button
                variant="contained"
                onClick={signInWithGoogle}
                type="button"
                fullWidth
                sx={{ mb: 3, backgroundColor: 'black' }}
            >
                LOGIN WITH GOOGLE
            </Button>
        </Fragment>

    );

}

export default OAuth;