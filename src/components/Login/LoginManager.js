import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

export const initializeLoginFramework = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
    }
}

export const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider).then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
            isSignedIn: true,
            name: displayName,
            photo: photoURL,
            email: email,
            success: true
        }
        return signedInUser;
    }).catch(err => {
        console.log(err);
        console.log(err.message);
    })
};

export const handleFacebookSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            const credential = result.credential;
            const user = result.user;
            const accessToken = credential.accessToken;

            const { displayName, photoURL, email } = user;
            const signedInUser = {
                isSignedIn: true,
                name: displayName,
                photo: photoURL,
                email: email,
                success: true
            }
            // setUser(signedInUser);
            return signedInUser;
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;

            console.log(errorMessage);
        });
}

export const handleSignOut = () => {
    return firebase.auth().signOut().then(res => {
        const signedOutUser = {
            isSignedIn: false,
            name: '',
            photo: '',
            email: '',
            error: '',
            success: false
        }
        return signedOutUser;
    }).catch(err => {
        console.log(err);
        console.log(err.message)
    })
};

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const newUserInfo = { user };
            newUserInfo.error = '';
            newUserInfo.success = true;
            updateUsername(name);
            return newUserInfo;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const newUserInfo = {};
            newUserInfo.error = errorMessage;
            newUserInfo.success = false;
            return newUserInfo;
        });
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const newUserInfo = user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            return newUserInfo;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const newUserInfo = {};
            newUserInfo.error = errorMessage;
            newUserInfo.success = false;
            return newUserInfo;
        });
}

export const updateUsername = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: name
    }).then(function () {
        // Update successful.
        console.log("Username updated successfully");
    }).catch(function (error) {
        // An error happened.
        console.log(error)
    });
}
