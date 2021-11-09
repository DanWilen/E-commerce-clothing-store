
const Product = require('../models/product');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping'); //connect db_name: shopping
let products = [
    
    new Product({
        imagePath: 'https://i.pinimg.com/236x/f9/dc/bf/f9dcbf9a14fb738a6845bc476bc6d722.jpg',
        title: 'Tottenham shirt',
        description: 'Tottenham Hotspur shirt for 2021/2022',
        price: 105
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/2a/d6/27/2ad627de4ade4dd4d713d712b667c4f7.jpg',
        title: 'Chelsea shirt',
        description: 'Away shirt of Chelsea FC for 2021/2022',
        price: 115
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/9a/1c/69/9a1c69cd729d64214c8a4562129a8550.jpg',
        title: 'Phoenix suns shirt',
        description: 'awesome shirt of NBA team Phoenix suns',
        price: 90
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/63/ca/d8/63cad83193033667daa445bfe8766e43.jpg',
        title: 'Nike shoes',
        description: 'Black Nike shoes',
        price: 280
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/17/92/9c/17929c9fa150764dbaa9300d4e9565cd.jpg',
        title: 'Adidas shirt',
        description: 'Casual Adidas white shirt',
        price: 100
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/ce/7b/05/ce7b050a54faeea5ae9c2b4fdb6bfc87.jpg',
        title: 'Adidas shoes',
        description: 'White Adidas shoes',
        price: 250
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/0c/75/b9/0c75b98e591ac1873b7048db73d6eee8.jpg',
        title: 'New York Yankees hat',
        description: 'Black New York Yankees hat',
        price: 60
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/d0/9c/5d/d09c5d79fdb4abf8bd2022bb6bd34aa4.jpg',
        title: 'Puma shoes',
        description: 'Red and black Puma shoes',
        price: 160
    }),
    new Product({
        imagePath: 'https://i.pinimg.com/236x/3b/bc/87/3bbc879f637adf24d0b8068e26433488.jpg',
        title: 'Nike soccer shoes',
        description: 'Brand new nike soccer shoes at gray and orange',
        price: 340
    })

];

//save products into mongodb
let done = 0;
for (let i=0; i<products.length;i++)
{
    products[i].save(function(err,result)
    {
        //Saving to DB is syncronize so we need to disconnect in callback function
        done++;
        if (done == products.length)
        {
            exit();
        }
    });
}

function exit()
{
    mongoose.disconnect();
}


