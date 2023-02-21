const User = require('../models/User')

exports.mustBeLoggedIn = function(req, res, next){
    if(req.session.user){
        next()
    } else {
        req.flash("errors", "You must be logged in to perform that action.")
        req.session.save(function(){
            res.redirect('/')
        })
    }
}

exports.login = function(req,res){
    //console.log(req.body)
    //console.log(JSON.stringify(req.body))
    let user = new User(req.body)
    user.login().then(function(result){
        req.session.user = {username: user.data.username, _id: user.data._id}
        req.session.save(function(){
            res.redirect('/')
        })
    }).catch(function(e){
        console.log('Failed initial login')
        console.log(e)
        req.flash('errors', e)
        req.session.save(function(){
            res.redirect('/')
        })
    })
}

exports.logout = function(req,res){
    console.log('Logging Out')
    req.session.destroy(function(){
        res.redirect('/')
    })
}

exports.register = function(req,res){
    let user = new User(req.body)
    user.register().then(() => {
        req.session.user = {username: user.data.username, _id:user.data._id}
        req.session.save(function(){
            res.redirect('/')
        })
    })
}

exports.home = async function(req,res){
    console.log('Home')
    if(req.session.user){
        let user = new User(req.session.user)
        await user.getSteps(req.session.user.username).then((returnedUser)=>{
            res.locals.user = returnedUser
        })
        console.log(res.locals.user)
        res.render('home-dashboard')
    } else{
        //render non logged in user homepage
        console.log('Home-Guest')
        res.render('home-guest')
    }
}

exports.addStaircase = async function(req,res){
    if(req.session.user){
        //console.log('Ses User: ' + JSON.stringify(req.session.user))
        //console.log(req.body.staircaseName)
        //console.log(req.body.stairCount)
        let user = new User(req.session.user)
        await user.addStairCase(req.body.staircaseName, req.body.stairCount).then((returnedUser)=>{
            res.locals.user.data = returnedUser
            console.log(returnedUser)
        })
        res.redirect('/')
    }
}

exports.incrementStairTraversal = async function(req,res){
    //console.log(req.body)
    if(req.session.user){
        let user = new User(req.session.user)
        await user.incrementCount(req.body.dayIndex, req.body.stairIndex).then((returnedUser)=>{
            //console.log(returnedUser)
            res.json(returnedUser)
        }).catch((e)=>{
            res.send('failed')
        })
    }else{
        console.log('notcalled')
        res.send('failed')
    }
    
}

exports.getFrontEndData = async function(req,res){
    if(req.session.user){
        //console.log('FrontEnd Data' + JSON.stringify(req.body))
        //console.log('FrontEnd Data 2' + JSON.stringify(req.session.user))
        //console.log("USER ID: " + req.session.user._id)
        console.log('called')
        let user = new User(req.session.user)
        await user.getAllData(req.session.user._id).then((returnedData)=>{
            //console.log("RETURNED DATA: " + JSON.stringify(returnedData))
            res.json(returnedData)
        })
    }else{
        res.send('must be logged in')
    }
}

exports.decrementStairTraversal = async function(req,res){
    //console.log(req.body)
    if(req.session.user){
        let user = new User(req.session.user)
        await user.decrementCount(req.body.dayIndex, req.body.stairIndex).then((returnedUser)=>{
            //console.log(returnedUser)
            res.json(returnedUser)
        }).catch((e)=>{
            res.send('failed')
        })
    }else{
        console.log('notcalled')
        res.send('failed')
    }    
}

exports.deleteStaircase = async function(req,res){
    if(req.session.user){
        let user = new User(req.session.user)
        console.log(req.body)
        res.send(req.body)
    }else{
    res.send('done')}
}

exports.editStaircaseName = async function(req,res){

}