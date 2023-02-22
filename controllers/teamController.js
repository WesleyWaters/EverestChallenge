const Team =require('../models/Team')

exports.createTeam = function(req,res){
    console.log('Create a team')
    let team = new Team('TeamName')
    console.log('after new team')

}

exports.home = async function(req,res){
    console.log('Home')
    if(req.session.user){
        let user = new User(req.session.user)
        await user.getSteps(req.session.user.username).then((returnedUser)=>{
            res.locals.user = returnedUser
        })
        //console.log(res.locals.user)
        res.render('home-dashboard')
    } else{
        //render non logged in user homepage
        console.log('Home-Guest')
        res.render('home-guest')
    }
}
