import { useEffect, useReducer } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUserApi } from "../fakeAuthApi";

const initialForFieldsState = {
  email: "",
  password: "",
  loginError: "",
};

const formFieldsReducer = (state, action) => {
  switch (action.type) {
    case "EMAIL":
      return { ...state, email: action.payload.email };

    case "PASSWORD":
      return { ...state, password: action.payload.password };

    case "LOGIN_ERROR":
      return { ...state, loginError: action.payload.loginError };

      default:
        return state;
  }
};

export const Login = () => {
  const [{ email, password, loginError }, dispatchFormFields] = useReducer(
    formFieldsReducer,
    initialForFieldsState
  );

  const { state } = useLocation();
  const navigate = useNavigate();

  const { isUserLoggedIn,dispatchAuth } = useAuth();

  useEffect(()=>{
    console.log("state from ",state?.from)
    isUserLoggedIn && navigate(state?.from ? `${state.from}` : "/");
  },[])



  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  let emailError = "";
  let passwordError = "";

  if (email !== "" && !emailRegex.test(email)) {
    emailError = "please enter valid email";
  } else {
    emailError = "";
  }

  const loginUser = async (enteredEmail, enteredPassword) => {
    try {
      dispatchFormFields({ type: "LOGIN_ERROR", payload: { loginError: "" } });
      const response = await loginUserApi(enteredEmail, enteredPassword);
      if (response.status === 200) {
        const { name, email, password } = response.data;
        dispatchAuth({
          type: "SET_CREDENTIALS",
          payload: { name, email, password },
        });
        dispatchAuth({ type: "LOGIN_USER" });
        localStorage?.setItem(
          "login",
          JSON.stringify({
            isUserLoggedIn: true,
            name: name,
            email: email
          })
        );
        navigate(state?.from ? state.from : "/");
      }
    } catch (error) {
      console.log("error while logging in", error);
      dispatchFormFields({
        type: "LOGIN_ERROR",
        payload: { loginError: "email or password incorrect" },
      });
    }
  };
  const loginUserOnSubmit=(event)=>{
    event.preventDefault();
    loginUser(email,password);
  }

  return (
   
    <div className={styles.container}>
       
      <h3 className={styles.title}>Login</h3>
      <form onSubmit={loginUserOnSubmit}>
        <div className={styles.inputContainer}>
          <input
            className={styles.loginInput + " input"}
            placeholder="Email"
            value={email}
            onChange={(e) =>
              dispatchFormFields({
                type: "EMAIL",
                payload: { email: e.target.value },
              })
            }
            type="text"
          />
          {emailError !== "" && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input
            className={styles.loginInput + " input"}
            placeholder="Password"
            value={password}
            onChange={(e) =>
              dispatchFormFields({
                type: "PASSWORD",
                payload: { password: e.target.value },
              })
            }
            type="password"
          />
          {passwordError !== "" && (
            <p className={styles.error}>{passwordError}</p>
          )}
        </div>

        <button
          disabled={email === "" || password === "" || emailError !== ""}
          className={styles.loginButton + " btn primary"}
          type="submit"
        >
          Login
        </button>
        {loginError !== "" && <p className={styles.error}>{loginError}</p>}
      </form>
      <p className={styles.footer}>
        Don't have an account?{" "}
        <a className={styles.signupLink} href="/account/signup">
          Sign up!
        </a>
      </p>
    </div>
  );
};
