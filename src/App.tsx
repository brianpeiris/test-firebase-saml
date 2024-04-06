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
  apiKey: "YOUR_API_KEY",
  authDomain: "localhost:5173",
  projectId: "testsaml-7d26f",
  storageBucket: "testsaml-7d26f.appspot.com",
  messagingSenderId: "1087230248080",
  appId: "1:1087230248080:web:aa8e35f5c320907720c415",
};
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("foo@example.com");
  const [password, setPassword] = useState("passw0rd");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function signUp(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (error) {
      console.log(error);
      setError(String(error));
    }
  }

  async function signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (error) {
      console.log(error);
      setError(String(error));
    }
  }

  async function samlSignIn() {
    try {
      const samlProvider = new SAMLAuthProvider(SAML_PROVIDER_ID);
      console.log(await signInWithRedirect(auth, samlProvider));
      setError("");
    } catch (error) {
      console.log(error);
      setError(String(error));
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log("Got user from redirect", user.email);
          setError("");
        } else {
          console.log("No user from redirect");
        }
      } catch (error) {
        console.log(error);
        setError(String(error));
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user.email);
        setUserEmail(user.email);
      } else {
        console.log("User is signed out");
        setUserEmail(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <form>
        {error && <div className="error">{error}</div>}
        {userEmail ? (
          <div>Signed in as {userEmail}</div>
        ) : (
          <div>Not signed in</div>
        )}
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
        <button
          type="button"
          onClick={() => {
            signOut(auth);
            setError("");
          }}
        >
          Sign Out
        </button>
      </form>
    </>
  );
}

export default App;
