import { memo, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import {
  selectOpenMinicart,
  selectBagTotalPrice,
  selectCartItems,
} from "../../store/minicart.selector";
import { toggleMinicart } from "../../store/minicart.reducer";

import CartItem from "./cart-item.component.jsx";
import "./minicart.styles.scss";
import "./../button/button.styles.scss";
import { useIntl } from "react-intl";

// eslint-disable-next-line react/display-name
const Minicart = memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const openMinicart = useSelector(selectOpenMinicart);
  const bagTotalPrice = useSelector(selectBagTotalPrice);
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    if (openMinicart) {
      dispatch(toggleMinicart(false));
    }
  }, [location]); //eslint-disable-line react-hooks/exhaustive-deps

  const closeMinicart = useCallback(() => {
    dispatch(toggleMinicart(false));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const intl = useIntl();
  return (
    <div
      data-testid="minicart"
      className={`minicart-container ${
        openMinicart && location.pathname !== "/cart" && "to-show"
      }`}
    >
      <div className="minicart-content">
        <button
          type="button"
          className="close-minicart"
          onClick={closeMinicart}
        >
          &#10005;
        </button>
        {!cartItems.length ? (
          <h2 className="empty-message">
            {intl.formatMessage({ id: "cart.empty" })}
          </h2>
        ) : (
          <>
            <div className="minicart-items has-custom-scrollbar">
              {cartItems.map((item) => (
                <CartItem key={item.id} cartItem={item} />
              ))}
            </div>
            <div className="minicart-total medium-barlow-cond">
              <span>₪ {bagTotalPrice.toFixed(2)}</span>
            </div>
            <Link className="button-container" to={"/cart"}>
              {intl.formatMessage({ id: "go_to_cart" })}
            </Link>
          </>
        )}
      </div>
    </div>
  );
});

export default Minicart;
