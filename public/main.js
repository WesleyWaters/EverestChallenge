let incrementButtons = document.querySelectorAll('.incrementButton')
let decrementButtons = document.querySelectorAll('.decrementButton')
incrementButtons.forEach((x)=>{
  x.addEventListener('click', (e)=>{
    e.preventDefault()
    let traversals = x.getAttribute('data-traversals')
    x.setAttribute('data-traversals', traversals++)
    let date = x.getAttribute('data-date')
    let staircase = x.getAttribute('data-staircase')
    axios.post('/incrementStairTraversal', {dayIndex: date, stairIndex: staircase}).then(response=>{
      console.log(response.data)
    })
    //x.closest
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
      console.log(response.data)
    })
  })
})
/*
sendRequest() {
    axios.post('/search', {searchTerm: this.inputField.value}).then(response => {
      console.log(response.data)
      this.renderResultsHTML(response.data)
    }).catch(() => {
      alert("Hello, the request failed.")
    })
  }
  */