const teamCollection = require('../db').db().collection('Teams')

let Team = function(teamName){
    this.getTeam(teamName)
    this._id
    this.totalSteps
    this.name = teamName
    this.teamMembers = []
    console.log('ran this')
}

Team.prototype.getTeam = function(name){
    console.log('Get team: ' + name)
    return new Promise(async (resolve, reject)=>{
        await teamCollection.findOne({username:name}).then((foundTeam)=>{
            if(foundTeam != null){
                console.log('found team')
                console.log(foundTeam)
                resolve(foundTeam)
            }else{
                //create team
                console.log('Couldnt find team')
                //await teamCollection.insertOne(this)
            }
            
        }).catch(function(){
            reject("Please try again later.")
        })
    })
}

module.exports = Team