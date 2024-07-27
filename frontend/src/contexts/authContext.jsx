import axios from "../helper/axios";
import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const AuthReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        localStorage.setItem("user", JSON.stringify(action.payload));
        return { user: action.payload };
      case "LOGOUT":
        localStorage.removeItem("user");
        return { user: null };
        case "REGISTER":
        localStorage.setItem("user",JSON.stringify(action.payload));
        return { user: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
  });

  useEffect(() => {
    try {
      axios('/api/users/me').then(res => {
        let isUserExisted = res.data
        if (isUserExisted) {
            dispatch({ type: "LOGIN", payload: isUserExisted });
          } else {
            dispatch({ type: "LOGOUT" });
          }
      })
    } catch (error) {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
