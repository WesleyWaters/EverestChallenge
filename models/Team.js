const teamCollection = require('../db').db().collection('Teams')
const ObjectID = require('mongodb').ObjectId

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

Team.prototype.setTotal = function(teamName, totalSteps){
    teamCollection.findOneAndUpdate({name: teamName}, {$set:{totalSteps:totalSteps}})
}

Team.prototype.joinTeam = function(teamName, user){
    return new Promise(async (resolve, reject)=>{
        await teamCollection.findOne({name:teamName}).then(async (foundTeam)=>{
            if(foundTeam != null){
                alreadyOnTeam = false
                foundTeam.teamMembers.forEach(member => {
                    if(user.name == member.name) alreadyOnTeam = true
                });
                if(!alreadyOnTeam){
                    console.log('Adding user')
                    foundTeam.teamMembers.push(user)
                    console.log(foundTeam)

                    teamCollection.updateOne(
                        {_id: new ObjectID(foundTeam._id)},
                        {$set: {
                            teamMembers: foundTeam.teamMembers
                        }},
                        {upsert: true}
                    )
                    console.log('Added user')
                    resolve(foundTeam)
                }else{
                    reject('Already on team')
                }
            }else{
                //create team
                console.log('Team Not found')
            }
        }).catch(function(){
            reject("Please try again later.")
        })
    })
}

module.exports = Team