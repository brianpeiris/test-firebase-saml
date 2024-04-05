import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  SAMLAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import "./App.css";

const SAML_PROVIDER_ID = "saml.test";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBR5iZfnnoK3nnQfKcxtEp1Ti07WQEoMxY",
  authDomain: "localhost:5173",
  projectId: "test-saml-9038e",
  storageBucket: "test-saml-9038e.appspot.com",
  messagingSenderId: "13023318515",
  appId: "1:13023318515:web:8b747bc5f0a80b006ec286",
};
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("foo@example.com");
  const [password, setPassword] = useState("passw0rd");

  async function signUp(email: string, password: string) {
    try {
      createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  }

  async function samlSignIn() {
    try {
      const samlProvider = new SAMLAuthProvider(SAML_PROVIDER_ID);
      console.log(await signInWithRedirect(auth, samlProvider));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log("Got user from redirect", user.email);
        } else {
          console.log("No user from redirect");
        }
      } catch (error) {
        console.log(error);
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user.email);
      } else {
        console.log("User is signed out");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={() => signUp(email, password)}>
          Sign Up
        </button>
        <button type="button" onClick={() => signIn(email, password)}>
          Sign In
        </button>
        <button type="button" onClick={() => samlSignIn()}>
          SAML Sign In
        </button>
        <button type="button" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </form>
    </>
  );
}

export default App;
