const stripe = require('stripe')('YOUR_SECRET_TEST_KEY');

exports.genretaPaymentSession = (products, domain) => {
    const configuredProducts = products.map(product => {
        return { 
            name: product.name,
            description: product.description,
            amount: product.price * 100,
            currency: 'gbp',
            quantity: product.quantity
        }
    })

    const stripeConfigurations = {
        payment_method_types: ['card'],
        line_items: configuredProducts,
        success_url: `${domain}/checkout/success`,
        cancel_url: `${domain}/checkout/cancel`
    };

    return stripe
        .checkout
        .sessions
        .create(stripeConfigurations);
}