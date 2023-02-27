let incrementButtons = document.querySelectorAll('.incrementButton')
let decrementButtons = document.querySelectorAll('.decrementButton')
let totalStepsDisplay = document.querySelectorAll('.totalStepsDisplay')
let totalDaysDisplay = document.querySelectorAll('.totalDaysDisplay')
let createTeamButton = document.querySelector('.createTeamButton')
let weeklyTotalsSection = document.querySelector('.weeklyTotals')
let teamMemberDays = document.querySelectorAll('.teamMember__day')
let teamList = document.querySelector('.teamList')
let userData = JSON.parse(document.querySelector('.userData').getAttribute('data-user'))
let collapsible = document.querySelectorAll('.collapsible')
let totalSteps
let dayCount

document.addEventListener('DOMContentLoaded', function(x){
  console.log('dom')
  //let user = JSON.parse(userData.getAttribute('data-user'))
  axios.post('./getFrontEndData', {userData}).then(response=>{
    totalSteps = response.data.totalSteps
    dayCount = response.data.date.length
    updateScreen()
    addStaircases()
  }).catch((e)=>{
    console.log(e)
  })
})

incrementButtons.forEach((x)=>{
  x.addEventListener('click', (e)=>{
    e.preventDefault()
    let traversals = x.getAttribute('data-traversals')
    x.setAttribute('data-traversals', traversals++)
    let date = x.getAttribute('data-date')
    let staircase = x.getAttribute('data-staircase')
    axios.post('/incrementStairTraversal', {dayIndex: date, stairIndex: staircase}).then(response=>{
      totalSteps = response.data.totalSteps
      currentStaircase = response.data.stairCases[staircase]
      updatedTraversals = response.data.date[date].count[staircase]
      x.parentNode.parentNode.querySelector('.staircase__data__traversals').innerHTML = 'Traveled: ' + updatedTraversals
      stringDate = formatDate(response.data.date[date].date)
      dayTotal = response.data.date[date].daySteps
      x.parentNode.parentNode.parentNode.parentNode.querySelector('.collapsible').innerHTML = `${stringDate}: Day ${parseInt(date) + 1} Total: ${dayTotal}`
      updateScreen()
    })
  })
})

async function updateScreen(){
  totalStepsDisplay.forEach((x)=>{
    x.innerHTML = `Total Steps: ${totalSteps}/46,446: ${Math.round(totalSteps/46446*10000)/100}%`
  })
  totalDaysDisplay.forEach((x)=>{
    x.innerHTML = `Days: ${dayCount}/56 - ${Math.round(dayCount/56*10000)/100}%`
  })
  let userTotals = []
  await axios.get('/allUserTotalSteps').then((retrievedUserTotals)=>{
    userTotals = retrievedUserTotals.data
  })
  console.log('Retrieved User Totals')
  console.log(userTotals)
  await axios.get('teamList').then((retrievedTeamList)=>{
    console.log(retrievedTeamList.data)
    teamList.innerHTML = ''
    retrievedTeamList.data.forEach((team, index) => {
      teamList.insertAdjacentHTML('beforeend',`
      <div>
      <li>${team.name}: ${JSON.stringify(team.totalSteps)}</li>
      <p>Team Members:<br>${team.teamMembers.map(x=>{
        thisUserTotalSteps = userTotals.filter((total)=>{
          return total.username == x.username
        })
        console.log('This User Total Steps: ' + JSON.stringify(thisUserTotalSteps))
        console.log(thisUserTotalSteps.totalSteps)
        return `${x.username}: ${thisUserTotalSteps[0].totalSteps}`
      }).join('<BR>')}</p>
      
      </div>
      `)
    });
  })
/*<button data-teamName="${team.name}" class="joinTeamButton">Join Team</button>*/

  let weeklyTotalsHTML = userData.weeklyTotals.map(function(weeklyTotal,index){
    return `
    <ul>
    <button data-visible="true" data-index="${index}" class="weekButton">Week ${index+1}: ${weeklyTotal}</button>
    </ul>
    `
  }).join('')
  weeklyTotalsSection.innerHTML = weeklyTotalsHTML

  let weekButtons = document.querySelectorAll('.weekButton')
  weekButtons.forEach((weekButton)=>{
    weekButton.addEventListener('click',(e)=>{
      e.preventDefault()
      isVisible = weekButton.getAttribute('data-visible')
      console.log('IsVisible: ' + isVisible)
      index = weekButton.getAttribute('data-index')
      id = `week_${index}`
      weekUL = document.getElementById(id)
      console.log(isVisible == 'true')
      console.log(isVisible == true)
      if(isVisible == 'true'){
        console.log('hide')
        weekUL.style.display = 'none';
        weekButton.setAttribute('data-visible', 'false')
      }else{
        console.log('show')
        weekUL.style.display = "block";
        weekButton.setAttribute('data-visible', 'true')
      }      
    })
  })

  let joinTeamButtons = document.querySelectorAll('.joinTeamButton')
  joinTeamButtons.forEach((joinButton)=>{
    joinButton.addEventListener('click',(e)=>{
      e.preventDefault()  
      axios.post('joinTeam',{teamName: joinButton.getAttribute('data-teamName')}).then((response)=>{
        console.log(response)
      })
  })    
  })
}

collapsible.forEach((x, index)=>{
  let buttonDate = formatDate(userData.date[index].date)
  let buttonCurrentTotal = userData.date[index].daySteps
  x.innerHTML = `${buttonDate}: Day ${index+1} Total: ${buttonCurrentTotal}`
  x.addEventListener('click',function(){
    this.classList.toggle('active');
    let content = this.nextElementSibling;
    if(content.style.display === "block"){
      content.style.display = "none";
    } else{
      content.style.display = "block";
    }
  })
})

let list = []
teamMemberDays.forEach((day, index)=>{
  weekIndex = Math.floor(index/7)
  if(index%7 == 0){
      day.insertAdjacentHTML('beforebegin', `<ul class="week" id="week_${weekIndex}">`)
      list.push(document.getElementById(`week_${weekIndex}`))
      list[weekIndex].insertBefore(day,null)
  }else{
    list[weekIndex].insertBefore(day,null)
  }
})

decrementButtons.forEach((x)=>{
  x.addEventListener('click', (e)=>{
    e.preventDefault()
    let traversals = x.getAttribute('data-traversals')
    x.setAttribute('data-traversals', traversals++)
    let date = x.getAttribute('data-date')
    let staircase = x.getAttribute('data-staircase')
    axios.post('/decrementStairTraversal', {dayIndex: date, stairIndex: staircase}).then(response=>{
      totalSteps = response.data.totalSteps
      currentStaircase = response.data.stairCases[staircase]
      updatedTraversals = response.data.date[date].count[staircase]
      x.parentNode.parentNode.querySelector('.staircase__data__traversals').innerHTML = 'Traveled: ' + updatedTraversals
      stringDate = formatDate(response.data.date[date].date)
      dayTotal = response.data.date[date].daySteps
      x.parentNode.parentNode.parentNode.parentNode.querySelector('.collapsible').innerHTML = `${stringDate}: Day ${parseInt(date) + 1} Total: ${dayTotal}`
      updateScreen()
    })
  })
})

createTeamButton.addEventListener('click', (e)=>{
  e.preventDefault()
  let teamNameInput = document.querySelector('#teamName')
  console.log('Inner HTML: ' + teamNameInput.innerHTML)
  console.log('Value: ' + teamNameInput.value)
  axios.post('./addTeam', {teamName: teamNameInput.value}).then(response=>{
    console.log('Response: ' + response)
  })
})

function formatDate(date) {
  var d = new Date(date);
  d.setHours(10)
  month = '' + (d.getMonth() +1),
  day = '' + (d.getDate() +1),
  year = '' + d.getFullYear();


    if(month.length < 2){
      month = '0' + month;
    }
    if(day.length < 2){
      day = '0' + day;
    }
    console.log('Output Date' + [year, month, day])
    return [year,month, day].join('/');
}

function calculateSteps(user) {
  let totalSteps = 0
  user.date.forEach(day => {
      console.log(day)
      day.count.forEach((traversals, index) => {
          console.log(traversals)
          totalSteps += user.stairCases[index].steps * traversals
      });
  });
  user.totalSteps = totalSteps
}

function staircaseTemplate(staircase, index) {
  return `
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="staircase-text">${staircase.name}</span>
    <span class="staircase-count">${staircase.steps}</span>
    <div>
      <button data-index="${index}" class="edit-staircaseName btn btn-secondary btn-sm mr-1">Edit Name</button>
      <button data-index="${index}" class="edit-staircaseCount btn btn-secondary btn-sm mr-1">Edit Step Count</button>
    </div>
  </li>`
}

function addStaircases(){
  console.log(userData.stairCases)
  let ourStaircaseHTML = userData.stairCases.map(function(staircase, index){
    return staircaseTemplate(staircase, index)
  }).join('')
  document.getElementById('staircaseList').insertAdjacentHTML('beforeend', ourStaircaseHTML)
  
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('edit-staircaseName')){
      let newName = prompt('Enter new staircase name')
      if(newName != null){
        axios.post('/editStaircaseName', {id: e.target.getAttribute('data-index'), newName: newName}).then(function(x){
          console.log('New StaircaseName')
          console.log(x.data.stairCases)
          userData.stairCases = x.data.stairCases
          document.getElementById('staircaseList').innerHTML = ''
          addStaircases()
          //e.target.parentElement.parentElement.remove()
        })
      }
    }
  })

  document.addEventListener('click', function(e){
    if(e.target.classList.contains('edit-staircaseCount')){
      let newCount = prompt('Enter new step count for staircase')
      if(newCount != null){
        axios.post('/editStaircaseCount', {id: e.target.getAttribute('data-index'), newCount: newCount}).then(function(x){
          console.log('New StaircaseCount')
          console.log(x.data.stairCases)
          userData.stairCases = x.data.stairCases
          document.getElementById('staircaseList').innerHTML = ''
          addStaircases()
        })
      }
    }
  })

  document.addEventListener('click', function(e){
    if(e.target.classList.contains('delete-staircase')){
      if(confirm("Do you really want to delete this staircase permanently?")){
        axios.post('/deleteStaircase', {id: e.target.getAttribute('data-index')}).then(function(x){
          console.log(x)
        })
      }
    }
  })
}
