// const stripe = require('stripe')('YOUR_SECRET_TEST_KEY');
const stripe = require('stripe')('sk_test_51KhZteLQtMQ2ylO4GG6BUveRTUFTSGrMiy65g4SqTU2LTjMwoNTzQMus6zWdSGAKxTDz6A58snfD6R1Q4l7aGFcg00Yta5NrF0');

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