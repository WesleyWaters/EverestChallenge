const Team =require('../models/Team')
const User = require('../models/User')

exports.createTeam = async function(req,res){
    console.log('Create a team')
    console.log('Req: ' + req.body.teamName)
    
    let team = new Team()
    await team.getTeam(req.body.teamName).then((response)=>{
        console.log('response')
        res.json(response)
    }).catch((e)=>{
        res.json("Find/CreateTeam failed")
    })
}

exports.getAllTeams = async function(req,res){
    let team = new Team()
    await team.getAllTeams().then((response)=>{
        console.log('All Teams: ' + response)
        res.json(response)
    }).catch((e)=>{
        res.json('failed to find teams')
    })
}

exports.joinTeam = async function(req,res){
    console.log('Team Name to join: ' + req.body.teamName)
    console.log('User to add to team: ' + JSON.stringify(req.session.user))
    let team = new Team()
    await team.joinTeam(req.body.teamName, req.session.user).then((response)=>{
        res.json(response)
    }).catch((e)=>{
        res.json("Failed to join team")
    })
}

exports.UpdateTotals = async function(){
    let team = new Team()
    let user = new User({username: 'Anonymous', password:'1234'})
    let returnedTeams
    await team.getAllTeams().then((allTeams)=>{
        returnedTeams = allTeams
        console.log('Team Totals Updated')
    }).catch((e)=>{
        console.log('Failed to update team totals: ' + e)
    })
    returnedTeams.map(async (individualTeam)=>{
        await user.getStairTotal(individualTeam.teamMembers).then((totals)=>{
            console.log(individualTeam.name + ':' + totals)
            individualTeam.totalSteps = totals
        })
        await team.setTotal(individualTeam.name, individualTeam.totalSteps)
    })
}