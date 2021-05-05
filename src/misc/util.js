export const discountCalc = (price, discountPercent) => {
  return price - ((price * discountPercent) / 100).toFixed(2);
};

export const cartPriceCalculator = (cart) => {
  const cartPrice = {
    price: 0,
    discountedPrice: 0,
  };
  return {
    ...cartPrice,
    price: cart.reduce((acc, curr) => {
      return !curr.wishlisted && acc + Number(curr.product.price * curr.quantity);
    }, 0),
    discountedPrice: cart.reduce((acc, curr) => {
      return !curr.wishlisted && (
        acc +
        ((curr.product.price * curr.quantity).toFixed(2) -
          discountCalc(curr.product.price * curr.quantity, curr.product.discount))
      );
    }, 0),
  };
};
