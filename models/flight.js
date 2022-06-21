import mongoose from "mongoose"

const Schema = mongoose.Schema

const flightSchema = new Schema ({
  airline: {
    type: String,
    enum:['American', 'Southwest', 'United']
  },
  airport: {
    type: String,
    enum: ['AUS', 'DFW', 'DEN', 'LAX', 'SAN'],
    default: 'DEN'
  },
  flightNo: {
    type: Number,
    min: 10,
    max: 9999,
    required: true
  },
  departs: {
    type: Date,
    default: function () {
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1))

    }
  }
  })

const Flight = mongoose.model("Flight", flightSchema)

export {
  Flight
}

// Had to console.log to see what date looked like to create the correct default. RIGHT NOW was: new Date().toISOString()
// Had to figure out how to add another year to the date. After lots of research https://stackoverflow.com/questions/8609261/how-to-determine-one-year-from-now-in-javascript which I got new Date(new Date().setFullYear(new Date().getFullYear() + 1)) and then just added .toISOString