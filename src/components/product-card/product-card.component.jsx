import { memo } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart, toggleMinicart } from "../../store/minicart.reducer";
import addtocartimage from "../../assets/icons8-add-to-cart-48.png";
import Button from "../button/button.component";
import "./product-card.styles.scss";
import { useNavigate } from "react-router-dom";

const ProductCard = memo(({ product }) => {
  const { name, imageUrl, price, price2 } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addProductToCart = () => {
    dispatch(addItemToCart(product));
    dispatch(toggleMinicart(true));
  };

  return (
    <div className="product-card-container">
      <div className="img-container">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          onClick={() => navigate(`${product.id}`)}
        />
      </div>
      <div className="product-footer">
        <h3 className="name">{name}</h3>
        <div className="footer-card">
          <p className="price">
            <div className="price1">₪{price?.toFixed(2)}</div>
            {price2 && <div className="price2">₪{price2?.toFixed(2)}</div>}
          </p>
         
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
