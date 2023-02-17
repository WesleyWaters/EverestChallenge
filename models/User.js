const bcrypt = require('bcryptjs')
const userCollection = require('../db').db().collection('Users')
const stairsCollection = require('../db').db().collection('Stairs')
const progressCollection = require('../db').db().collection('progress')
const ObjectID = require('mongodb').ObjectId
const validator = require('validator')

let User = function(data){
    this.data = data
    this.username = data.username
    this._id = data._id
    this.password = data.password
    this.errors = []
}

User.prototype.cleanUp = function(){
    if(typeof(this.data.username) != "string") {this.data.username = ""}
    if(typeof(this.data.email) != "string") {this.data.email=""}
    if(typeof(this.data.password) != "string") {this.data.password = ""}

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password,
        stepsCLimbed: this.data.stepsCLimbed
    }
}

User.prototype.validate = function(){
    return new Promise(async (resolve,reject)=>{
        if (this.data.username == "") {this.errors.push("You must provide a username.")}
        if(this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
        if(!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
        if(this.data.password == ""){this.errors.push("You must provide a password")}
        if(this.data.password.length > 0 && this.data.password.length < 5){this.errors.push("Password must be at least 12 characters")}
        if(this.data.password.length > 50) {this.errors.push('Password cannot exceed 50 characters')}
        if(this.data.username.length > 0 && this.data.username.length < 3){this.errors.push("Username must be at least 3 characters.")}
        if(this.data.username.length > 30){this.errors.push("username cannot exceed 30 characters.")}

        if(this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)){
            let usernameExists = await userCollection.findOne({username: this.data.username})
            if(usernameExists){this.errors.push("That username is already taken.")}
        }

        if(validator.isEmail(this.data.email)){
            let emailExists = await userCollection.findOne({email: this.data.email})
            if(emailExists){this.errors.push("that email is already being used")}
        }
        resolve()
    })
}

User.prototype.login = function(){
    return new Promise((resolve, reject)=>{
        userCollection.findOne({username:this.data.username}).then((attemptedUser)=>{
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)){
                console.log(attemptedUser)
                this.data = attemptedUser
                console.log("'Logged In'")
                resolve("Congrats")
            } else{
                console.log("Invalid Username/password")
                reject("Invalid username / password.")
            }
        }).catch(function(){
            console.log("Other failure")
            reject("Please try again later.")
        })
    })
}

User.prototype.register = function(){
    return new Promise(async(resolve, reject)=>{
        this.cleanUp()
        await this.validate()

        if(!this.errors.length){
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await userCollection.insertOne(this.data)
            resolve()
        } else{
            reject(this.errors)
        }
    })
}

User.prototype.getSteps = function(userName){
    return new Promise(async(resolve,reject)=>{
        userCollection.findOne({username:userName}).then((attemptedUser)=>{
            calculateSteps(attemptedUser)
            resolve(attemptedUser)
        }).catch(function(e){
            reject('Failed: ' + e)
        })
    })
}

User.prototype.addStairCase = function(name, steps){
    return new Promise(async(resolve,reject)=>{
        userCollection.findOne({_id: new ObjectID(this._id)}).then((returnedUser)=>{
            returnedUser.stairCases.push({name, steps})
            returnedUser.date.forEach((date,index) => {
                date.count.push(0)
            });
            userCollection.updateOne(
                {_id: new ObjectID(this._id)},
                {$set: {
                    stairCases:returnedUser.stairCases,
                    date: returnedUser.date
                }},
                {upsert: true}
                )
            resolve('Completed')
        }).catch((e)=>{
            reject('failed: ' + e)
        })
    })
}

User.prototype.incrementCount = function(dateIndex, stairIndex){
    console.log('Increment')
    return new Promise(async(resolve, reject)=>{
        userCollection.findOne({_id: new ObjectID(this._id)}).then((returnedUser)=>{
            returnedUser.date[dateIndex].count[stairIndex] += 1
            calculateSteps(returnedUser)
            userCollection.updateOne(
                {_id: new ObjectID(this._id)},
                {$set: {
                    date: returnedUser.date,
                    totalSteps: returnedUser.totalSteps
                }},
                {upsert: true}
            )
            delete returnedUser.password
            resolve(returnedUser)
        }).catch((e)=>{
            reject('failed: ' + e)
        })
    })
}

function calculateSteps(user) {
    let totalSteps = 0
    user.date.forEach(day => {
        day.count.forEach((traversals, index) => {
            totalSteps += user.stairCases[index].steps * traversals
        });
    });
    user.totalSteps = totalSteps
}

User.prototype.decrementCount = function(dateIndex, stairIndex){
    console.log('Decrement')
    return new Promise(async(resolve, reject)=>{
        userCollection.findOne({_id: new ObjectID(this._id)}).then((returnedUser)=>{
            returnedUser.date[dateIndex].count[stairIndex] -= 1
            calculateSteps(returnedUser)
            userCollection.updateOne(
                {_id: new ObjectID(this._id)},
                {$set: {
                    date: returnedUser.date
                }},
                {upsert: true}
            )
            delete returnedUser.password
            resolve(returnedUser)
        }).catch((e)=>{
            reject('failed: ' + e)
        })
    })
}

User.prototype.removeStairCase = function(name){
    this.stairCases = this.stairCases.filter((staircase)=>{
        return staircase != name
    })
}

module.exports = User