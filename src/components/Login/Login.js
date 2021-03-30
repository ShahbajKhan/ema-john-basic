import React, { useContext, useState } from 'react';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, handleFacebookSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';


const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
    })
    initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    let history = useHistory();
    let location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };

    const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        redirect && history.replace(from);
    }

    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
            if (user.password === user.confirmPassword) {
                createUserWithEmailAndPassword(user.name, user.email, user.password)
                    .then(res => {
                        handleResponse(res, true);
                    })
            }
            else {
                console.log(user.password, user.confirmPassword);
            }
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    handleResponse(res, true);
                })
        }

        e.preventDefault();
    }

    const googleSignIn = () => {
        handleGoogleSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const fbSignIn = () => {
        handleFacebookSignIn()
            .then(res => {
                handleResponse(res, true);
            })
    }

    const signOut = () => {
        handleSignOut()
            .then(res => {
                handleResponse(res, false)
            })
    }

    const handleBlur = (e) => {
        let isFieldValid = true;
        let password = '';
        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
        }
        if (e.target.name === 'password') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value)
            isFieldValid = isPasswordValid && passwordHasNumber;
        }
        if (e.target.name === 'confirmPassword') {
            const isPasswordValid = e.target.value.length > 6;
            const passwordHasNumber = /\d{1}/.test(e.target.value)
            isFieldValid = isPasswordValid && passwordHasNumber;
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }
    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSignedIn ? <button onClick={signOut}>Sign Out</button> : <button onClick={googleSignIn}>Sign In With Google</button>
            }
            <br />
            <button onClick={fbSignIn}>Sign In using facebook</button>
            {
                user.isSignedIn && <div className="">
                    <p>Welcome {user.name}</p>
                    <p>{user.email}</p>
                    <img src={user.photo} alt="" />
                </div>
            }
            <h1>Our own authentication</h1>
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />New User
            <br />
            <form onSubmit={handleSubmit} action="">
                {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" required />}
                <br />
                <input type="text" name="email" onBlur={handleBlur} placeholder="Email" required />
                <br />
                <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required />
                <br />
                {newUser && <input type="password" name="confirmPassword" onBlur={handleBlur} placeholder="Confirm Password" required />}
                <br />
                <input type="submit" value={newUser ? "Submit" : "Sign In"} />
            </form>
            {user.error && <p style={{ color: 'red' }}>{user.error}</p>}
            {user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'logged in'} successfully!</p>}
        </div>
    );
};

export default Login;