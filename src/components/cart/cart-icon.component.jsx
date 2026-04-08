import { useSelector, useDispatch } from 'react-redux';

import { selectOpenMinicart, selectBagCount } from '../../store/minicart.selector';
import { toggleMinicart } from '../../store/minicart.reducer';

import bagIcon from '../../assets/shopping-bag.svg'
import './cart-icon.styles.scss';
import { useCallback } from 'react';

const CartIcon = () => {
  const dispatch = useDispatch();
  const bagCount = useSelector(selectBagCount);
  const openMinicart = useSelector(selectOpenMinicart);

  const handleMinicartToggle = useCallback(() => {
    dispatch(toggleMinicart(!openMinicart));
  }, [openMinicart]); //eslint-disable-line react-hooks/exhaustive-deps


}

export default CartIcon;
