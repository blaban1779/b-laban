import { Link } from "react-router-dom";
import "./category-item.styles.scss";
import { FormattedMessage } from "react-intl";

const CategoryItem = ({ category }) => {
  const { titleId, imageUrl, route } = category;

  return (
    <div className="category-container large">
      <Link
        to={route}
        className="background-image"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></Link>
      <div className="category-body-container">
        <h2>
          <FormattedMessage id={titleId} defaultMessage={titleId} />
        </h2>
      </div>
    </div>
  );
};

export default CategoryItem;
