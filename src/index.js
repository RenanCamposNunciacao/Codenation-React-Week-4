const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

function getShoppingCart(ids, productsList) {
	let products = productsList.filter((product) => { return ids.indexOf(product.id) > -1 });
	let promotion = getPromotion(products);

	let result = products.reduce((acc, val) => {
		acc.products.push({ name: val.name, category :val.category });
		let price = getPrice(val, acc.promotion);
		acc.totalPrice += price.totalPrice;
		acc.discountValue += price.discountValue;
		price = null;
		return acc;
	}, { products: [], promotion: promotion, totalPrice: 0, discountValue: 0, discount: 0});
	
	result.discount = (result.discountValue * 100 / (result.totalPrice + result.discountValue)).toFixed(2) + "%";
	result.discountValue = result.discountValue.toFixed(2);
	result.totalPrice = result.totalPrice.toFixed(2);
	
	return result;
}

function getPromotion(productsList) {
	let categories = productsList.reduce((acc, val) => {
		if (acc.indexOf(val.category) == -1)
			acc.push(val.category);

		return acc;
	}, []);
	
	switch (categories.length)
	{
		case 1:
			return promotions[0];
		case 2:
			return promotions[1];
		case 3:
			return promotions[2];
		case 4:
		default:
			return promotions[3];
	}
}

function getPrice(product, promotion)
{
	let price = { totalPrice: product.regularPrice, discountValue: 0 };
	let promotionalValue = product.promotions.filter((promo) => {
		return promo.looks.indexOf(promotion) > -1;
	});

	if (promotionalValue.length == 0)
		return price;

	price.totalPrice = promotionalValue[0].price;
	price.discountValue = product.regularPrice - promotionalValue[0].price;

	return price;
}

module.exports = { getShoppingCart };
