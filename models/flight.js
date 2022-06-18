import mongoose from "mongoose"

const Schema = mongoose.Schema

const flightSchema = new Schema ({
  airline: {
    type: String,
    enum:['American', 'Southwest', 'United'],
    required: true
  },
  airport: {
    type: String,
    enum: ['AUS', 'DFW', 'DEN', 'LAX', 'SAN'],
    default: 'DEN',
    required: true
  },
  fightNo: {
    type: Number,
    min: 10,
    max: 9999,
    required: true
  },
  departs: Date,
  default: function () {
    const now = new Date()
    return now.getFullYear() + 1
    
  },
  required: true,
}, {
  timestamps: true
})

const Flight = mongoose.model("Flight", flightSchema)

export {
  Flight
}