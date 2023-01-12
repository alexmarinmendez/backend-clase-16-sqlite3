import options from './sqlite.config.js'
import knex from 'knex'

const database = knex(options)

const articulos = [
    { nombre: "Papas", codigo: "1092", precio: 12.34, stock: 100 },
    { nombre: "Bebida", codigo: "1093", precio: 45.4, stock: 90 },
    { nombre: "Hamburguesa", codigo: "1094", precio: 76.2, stock: 80 },
]

const processDatabase = async() => {
    let tableExists = await database.schema.hasTable('articulos')
    if (tableExists) {
        await database.schema.dropTable('articulos')
    }
    await database.schema.createTable('articulos', table => {
        table.increments('id'),
        table.string('nombre', 15).nullable(false),
        table.string('codigo', 10).nullable(false),
        table.float('precio'),
        table.integer('stock')
    })
    await database('articulos').insert(articulos)
    let results = await database.from('articulos').select('*')
    console.log(JSON.parse(JSON.stringify(results)))
    await database.from('articulos').where('id', 2).del()
    await database.from('articulos').where('id', 3).update({ stock: 10 })
    results = await database.from('articulos').select('*')
    console.log(JSON.parse(JSON.stringify(results)))
}

processDatabase()
    .then(() => console.log('Done'))
    .catch(err => console.log(err))
    .finally(() => database.destroy())