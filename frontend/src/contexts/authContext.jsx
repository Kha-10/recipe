import { createContext, useReducer } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const AuthReducer = (state,action) => {
    switch (action.type) {
        case "LOGIN":
            return {user : action.payload};
        case "LOGOUT":
            return {user : null};
        default:
            return state
    }
  }
  const [state,dispatch] = useReducer(AuthReducer,{
    user : null
  })

  return (
    <AuthContext.Provider value={{...state,dispatch}}>
    {children}
    </AuthContext.Provider>
  );
};

export {AuthContext,AuthContextProvider}