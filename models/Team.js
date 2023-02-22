const teamCollection = require('../db').db().collection('Teams')

let Team = function(teamName){
    this._id
    this.totalSteps
    this.name = teamName
    this.teamMembers = []
}

Team.prototype.getTeam = function(name){
    console.log('Get team: ' + name)
    return new Promise(async (resolve, reject)=>{
        await teamCollection.findOne({username:name}).then(async (foundTeam)=>{
            if(foundTeam != null){
                console.log('found team')
                console.log(foundTeam)
                resolve(foundTeam)
            }else{
                //create team
                this.name = name
                this.totalSteps = 0
                await teamCollection.insertOne(this).then((createdTeam)=>{
                    resolve(createdTeam)
                })
            }
        }).catch(function(){
            reject("Please try again later.")
        })
    })
}

Team.prototype.getAllTeams = function(){
    return new Promise(async (resolve, reject)=>{
        let allTeams = await teamCollection.find().toArray()
        console.log(allTeams)
        resolve(allTeams)
    })
}

module.exports = Team