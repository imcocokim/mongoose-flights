import methodOverride from 'method-override'
import { Flight } from '../models/flight.js'
import { Meal } from '../models/meal.js'

function newFlight(req, res) {
  const newFlight = new Flight()
  const dt = newFlight.departs
  const departsDate = dt.toISOString().slice(0, 16)
  res.render('flights/new', {
    title: 'Add Flight',
    departsDate

  })
}

function create(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
	}
  Flight.create(req.body)
  .then(flight => {
    res.redirect(`/flights/${flight._id}`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function index(req, res) {
  Flight.find({}).sort({departs: 1}) 
  .then(flights => {
    flights.forEach(flight => {
      if (flight.departs < new Date()) 
        flight.color = 'red'
    })
    res.render("flights/index", {
      flights: flights,
      title: "All Flights",
    })
  })

  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function deleteFlight(req, res) {
  Flight.findByIdAndDelete(req.params.id)
  .then(flight => {
    res.redirect('/flights')
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function show(req, res) {
  Flight.findById(req.params.id)
  .populate('meals')
  .then(flight => {
    Meal.find({_id: {$nin: flight.meals}})
    .then(meals => {
      res.render("flights/show", {
        flight: flight,
        title: "Flight Detail",
        meals
      })
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function edit(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    res.render('flights/edit', {
      flight: flight,
      title: "Edit Flight"
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function update(req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
	}
  Flight.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(flight => {
    res.redirect(`/flights/${flight._id}`)
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function createTicket(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.tickets.push(req.body)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })

}

function deleteTicket(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.tickets.remove({_id: req.params.ticketId})
    flight.save()
    .then(() =>{
      res.redirect(`/flights/${flight._id}`)
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function addToMeals(req, res) {
  Flight.findById(req.params.id)
  .then(flight => {
    flight.meals.push(req.body.mealId)
    flight.save()
    .then(() => {
      res.redirect(`/flights/${flight._id}`)

    })
  })

}

export {
  newFlight as new,
  create,
  index,
  deleteFlight as delete,
  show,
  edit,
  update,
  createTicket,
  deleteTicket,
  addToMeals
}

// line 4-6 date of where the server is and not the user.

// .sort() was a bit harder to find the correct syntax since I was just looking in javascript. searched "dates mongoDB sort by date" which led to the link that helped us (Emily and I) https://www.educba.com/mongodb-sort-by-date/?source=leftnav

// finding childId (ticketId) was frustrating then found this link https://stackoverflow.com/questions/53699000/mongoose-find-child-by-id