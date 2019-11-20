// DEBUG=app:* node src/scripts/mongo/seedProducts.js

const chalk = require('chalk')
const debug = require('debug')('app:scripts:api-keys')
const MongoLib = require('../../lib/mongo')

const products = [
    {
        nameProduct: 'Top Deportivo',
        description: 'Top sin arco con copas triangulartes y con buen cubrimiento del busto, al interior están forradas con tela suave para dar mayor confort y evitar marcas. Suave elástico ancho en la base que se ajusta perfectamente al cuerpo brindando gran sostenimiento y cuenta con cargaderas ajustables',
        maxPrice: 100000,
        minPrice: 0,
        images: [
            '../src/assets/static/temp/top/top-1.jpg',
            '../src/assets/static/temp/top/top-2.jpg'
        ],
        tags: [
            'mujer', 'destacado',
        ],
        inStock: [
            {
                size: 'S', amount: 1
            },
            {
                size: 'L', amount: 30
            }
        ]
    },
    {
        nameProduct: 'Buso',
        description: 'Fabricado en tela licrada, Con microporos transpirable, Ideal para entrenamiento deportivo',
        maxPrice: 40000,
        minPrice: 0,
        images: [
            '../src/assets/static/temp/buso/buso-1.jpg',
            '../src/assets/static/temp/buso/buso-2.jpg'
        ],
        tags: [
            'hombre',
        ],
        inStock: [
            {
                size: 'S', amount: 13
            },
            {
                size: 'L', amount: 11
            }
        ]
    },
    {
        nameProduct: 'Sudadera',
        description: 'Combinando los icónicos looks Nike Tech Pack del pasado, los pantalones Nike Sportswear Tech Fleece para mujer brindan calidez liviana con detalles modernos como cremalleras en los tobillos y detalles unidos.',
        maxPrice: 45000,
        minPrice: 40000,
        images: [
            '../src/assets/static/temp/sudadera/sudadera-1.jpg',
            '../src/assets/static/temp/sudadera/sudadera-2.jpg'
        ],
        tags: [
            'mujer',
        ],
        inStock: [
            {
                size: 'S', amount: 33
            },
            {
                size: 'L', amount: 3
            }
        ]
    },
    {
        nameProduct: 'Jogger',
        description: 'Fabricado en algodón licrado Elásticos en tobillos y cabera Bolsillo trasero para objetos pequeños Confortable y cómodo –unisex Especial para el dia de pierna',
        maxPrice: 67000,
        minPrice: 0,
        images: [
            '../src/assets/static/temp/jogger/jogger-1.jpg',
            '../src/assets/static/temp/jogger/jogger-2.jpg'
        ],
        tags: [
            'hombre',
        ],
        inStock: [
            {
                size: 'S', amount: 43
            },
            {
                size: 'L', amount: 2
            }
        ]
    },
]

const seedProducts = async () => {
    try{
        const MongoDB = new MongoLib()
        const promises = products.map(async product => {
            const today = new Date()
            await MongoDB.create('products', {...product, createdAt: today})
        })

        await Promise.all(promises)
        debug(chalk.green(`${promises.length} products have been generated succesfully`))
        return process.exit(0)
    }catch(err){
        debug(chalk.red(err))
        process.exit(1)
    }
}

seedProducts()
