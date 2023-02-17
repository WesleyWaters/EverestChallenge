let incrementButtons = document.querySelectorAll('.incrementButton')
let decrementButtons = document.querySelectorAll('.decrementButton')
let totalStepsDisplay = document.querySelectorAll('.totalStepsDisplay')
let userData = document.querySelector('.userData')
let totalSteps

document.addEventListener('DOMContentLoaded', function(x){
  console.log('dom')
  let user = JSON.parse(userData.getAttribute('data-user'))
  axios.post('./getFrontEndData', {user}).then(response=>{
    totalSteps = response.data.totalSteps
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
      x.parentNode.parentNode.querySelector('p').innerHTML = `${currentStaircase.name} has ${currentStaircase.steps} steps. It was traversed ${updatedTraversals} times. Accounting for ${currentStaircase.steps * updatedTraversals} steps climbed.`
      updateScreen()
    })
  })
})

function updateScreen(){
  totalStepsDisplay.forEach((x)=>{
    x.closest('h3').innerHTML = `Total Steps: ${totalSteps}/46,446: ${Math.round(totalSteps/46446*10000)/100}%`
  })
}

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
      x.parentNode.parentNode.querySelector('p').innerHTML = `${currentStaircase.name} has ${currentStaircase.steps} steps. It was traversed ${updatedTraversals} times. Accounting for ${currentStaircase.steps * updatedTraversals} steps climbed.`
      updateScreen()
    })
  })
})

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
