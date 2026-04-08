import {
  useEffect,
  lazy,
  Suspense,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IntlProvider } from "react-intl";
import {
  authChangedListener,
  createUserDocFromAuth,
} from "./utils/firebase/firebase.utils.js";
import { setCurrentUser } from "./store/user.reducer.js";
import SpinnerComponent from "./components/spinner/spinner.component.jsx";

import arMessages from "./locales/ar.json";
import hebMessages from "./locales/heb.json";

const messages = {
  ar: arMessages,
  heb: hebMessages,
};

const Navigation = lazy(() =>
  import("./routes/navigation/navigation.component")
);
const Home = lazy(() => import("./routes/home/home.component"));
const Login = lazy(() => import("./routes/login/login.component"));
const Shop = lazy(() => import("./routes/shop/shop.component"));
const CartComponent = lazy(() => import("./routes/cart/cart.component"));
const Product = lazy(() => import("./routes/cart/cart.component"));

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [locale, setLocale] = useState("heb");

  const switchLanguage = useCallback((language) => {
    setLocale(language);
  }, []);

  useEffect(() => {
    const unsubscribe = authChangedListener((user) => {
      if (user) {
        createUserDocFromAuth(user);
      }
      const pickedUser = user
        ? (({ accessToken, email }) => ({ accessToken, email }))(user)
        : "logged-out";
      dispatch(setCurrentUser(pickedUser));
    });
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <Suspense fallback={<SpinnerComponent />}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Routes>
          <Route
            path="/"
            element={<Navigation switchLanguage={switchLanguage} />}
          >
            <Route index element={<Home />} />
            <Route path="shop/*" element={<Shop />} />
            <Route path="login" element={<Login />} />
            <Route path="cart" element={<CartComponent />} />
            <Route path="product/:id" element={<Product />} />
          </Route>
        </Routes>
      </IntlProvider>
    </Suspense>
  );
};

export default App;
