let incrementButtons = document.querySelectorAll('.incrementButton')
let decrementButtons = document.querySelectorAll('.decrementButton')
let totalStepsDisplay = document.querySelectorAll('.totalStepsDisplay')
let totalDaysDisplay = document.querySelectorAll('.totalDaysDisplay')
let userData = document.querySelector('.userData')
let collapsible = document.querySelectorAll('.collapsible')
let totalSteps
let dayCount

document.addEventListener('DOMContentLoaded', function(x){
  console.log('dom')
  let user = JSON.parse(userData.getAttribute('data-user'))
  axios.post('./getFrontEndData', {user}).then(response=>{
    totalSteps = response.data.totalSteps
    dayCount = response.data.date.length
    console.log(response.data)
    console.log(response.data.date)
    console.log(response.data.date.length)
    updateScreen()
  }).catch((e)=>{
    console.log(e)
  })
})

console.log('ran')
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
      x.parentNode.parentNode.querySelector('.staircase__data__traversals').innerHTML = updatedTraversals
      stringDate = formatDate(response.data.date[date].date)
      dayTotal = response.data.date[date].daySteps
      x.parentNode.parentNode.parentNode.parentNode.querySelector('.collapsible').innerHTML = `${stringDate}: Day ${parseInt(date) + 1} Total: ${dayTotal}`
      updateScreen()
    })
  })
})

function updateScreen(){
  totalStepsDisplay.forEach((x)=>{
    x.innerHTML = `Total Steps: ${totalSteps}/46,446: ${Math.round(totalSteps/46446*10000)/100}%`
  })
  totalDaysDisplay.forEach((x)=>{
    x.innerHTML = `Days: ${dayCount}/56 - ${Math.round(dayCount/56*10000)/100}%`
  })
}

collapsible.forEach((x)=>{
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
      x.parentNode.parentNode.querySelector('.staircase__data__traversals').innerHTML = updatedTraversals
      stringDate = formatDate(response.data.date[date].date)
      dayTotal = response.data.date[date].daySteps
      x.parentNode.parentNode.parentNode.parentNode.querySelector('.collapsible').innerHTML = `${stringDate}: Day ${parseInt(date) + 1} Total: ${dayTotal}`
      updateScreen()
    })
  })
})

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() +1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear();

    if(month.length < 2){
      month = '0' + month;
    }
    if(day.length < 2){
      day = '0' + day;
    }

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
