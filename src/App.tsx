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
  ParsedToken,
} from "firebase/auth";

import "./App.css";

interface ExtendedToken extends ParsedToken {
  sign_in_attributes?: Record<string, string>;
}

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
  const [userDetails, setUserDetails] = useState<string | null>(null);
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
          console.log("Got user from redirect", {
            email: user.email,
            user: user,
            tokenResult: await user.getIdTokenResult(),
          });
          setError("");
        } else {
          console.log("No user from redirect");
        }
      } catch (error) {
        console.log(error);
        setError(String(error));
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const attributes =
          (tokenResult.claims?.firebase as ExtendedToken)?.sign_in_attributes ||
          {};
        console.log("User is signed in", {
          email: user.email,
          user,
          tokenResult,
        });
        setUserDetails(
          `Email: ${user.email}\n` +
            `Firebase UID: ${user.uid}\n` +
            `Provider UID: ${(user.providerData || [])[0]?.uid}\n` +
            `Provider Attributes: ${JSON.stringify(attributes, null, 2)}`,
        );
      } else {
        console.log("User is signed out");
        setUserDetails(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <form>
        {error && <div className="error">{error}</div>}
        {userDetails ? (
          <div className="userDetails">
            Signed in
            <br />
            {userDetails}
          </div>
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
