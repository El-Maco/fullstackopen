const mongoose = require('mongoose')

arg_count = process.argv.length
if (arg_count != 3 && arg_count < 5) {
  console.log(
    'Please provide the password, name and number as an argument: node mongo.js <password> <name> <number>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://user1:${password}@cluster0-shard-00-00.5rf92.mongodb.net:27017,cluster0-shard-00-01.5rf92.mongodb.net:27017,cluster0-shard-00-02.5rf92.mongodb.net:27017/Phonebook?ssl=true&replicaSet=atlas-glpv2z-shard-0&authSource=admin&retryWrites=true&w=majority`

mongoose.connect(url)

const schema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', schema)

const add_person = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

const get_persons = () => {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (arg_count === 3) {
  get_persons()
} else if (arg_count === 5) {
  add_person(process.argv[3], process.argv[4])
} else {
  console.log('wrong amount of arguments:', arg_count)
}

