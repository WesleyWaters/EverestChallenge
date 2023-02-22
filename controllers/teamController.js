const Team =require('../models/Team')

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
    console.log('User to add to team: ' + req.session.user)
    console.log('Joined Team')
    res.json('JoinedTeam')
}