const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const app = express()
const router = require('./router')
const flash = require('connect-flash')
const teamController = require('./controllers/teamController')


let sessionOptions = session({
    secret: "WB is the greatest place to work on earth!!",
    store: MongoStore.create({client:require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly:true}
})

app.use(sessionOptions)
app.use(flash())

app.use(function(req,res,next){
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    
    if(req.session.user) {req.visitorId = req.session.user._id} else {req.visitorId = 0}

    res.locals.user = req.session.user
    res.locals.testThis = 'testing'
    next()
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views','views')
app.set('view engine', 'ejs')

app.use('/', router)


function update(){
    console.log('updating')
    teamController.UpdateTotals()
    setTimeout(()=>{
        update()
    }, 30000)
}

setTimeout(()=>{
    update()
}, 5000)

module.exports = app