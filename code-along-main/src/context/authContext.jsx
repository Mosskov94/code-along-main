import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

// Opretter en AuthContext, der bruges til at dele autentificeringsdata globalt
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, saveAuth] = useLocalStorage("auth", {});
  const [user, setUser] = useLocalStorage("user", {});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      // Tjekker, om brugeren er i backoffice-området og ikke på login-siden
      if (
        location.pathname.includes("backoffice") &&
        !location.pathname.includes("login")
      ) {
        if (auth.token !== undefined) {
          let response = await fetch("http://localhost:3042/auth/token", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: auth.token }),
          });

          let result = await response.json();

          // Hvis tokenen er udløbet
          if (result.message === "Token Expired") {
            saveAuth({});
            setUser({});

            return navigate("/login");
          } else {
            setUser(result.data);
          }
        } else {
          // Hvis der ikke er en token, navigér til backoffice-login
          return navigate("/login");
        }
      }
    };

    checkUser();
  }, [location.pathname, auth.token, navigate, saveAuth]);

  // Funktion til at hente token fra auth-objektet
  const token = auth.token ? auth.token : "";

  // Funktion til at tjekke, om brugeren er logget ind
  const signedIn = auth.token !== undefined;

  // Funktion til at logge brugeren ind
  const signIn = async (email, password) => {
    let response = await fetch("http://localhost:3042/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let result = await response.json();
    console.log(result);

    const user = jwtDecode(result.data.token); // Dekodér brugeren fra tokenen

    saveAuth({ token: result.data.token });
    setUser(user);
    navigate("/");

    return user;
  };

  // Funktion til at hente brugerdata fra den gemte token
  const getUser = () => {
    return token !== "" ? jwtDecode(token) : {};
  };

  // Funktion til at logge brugeren ud
  const signOut = () => {
    saveAuth({});
    setUser({});
  };

  // Værdi, der leveres til AuthContext.Provider for at blive brugt af komponenter
  const value = { token, user, getUser, signIn, signOut, signedIn };

  // Returnér en AuthContext.Provider, der deler værdien med børnene i komponenttræet
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
