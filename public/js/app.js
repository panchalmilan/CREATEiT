const form = document.querySelector('form')

const t1 = {}
const t2 = {}
const fetchedData = {}

const baseURL = 'https://www.omdbapi.com/?&apikey=258b4c28'
let url1
let url2

form.addEventListener('submit', (e) => {
  clearHook()

  let movie1 = form.querySelector('.movie1').value
  let year1 = form.querySelector('.year1').value
  let season1 = form.querySelector('.season1').value
  let episode1 = form.querySelector('.episode1').value

  let movie2 = form.querySelector('.movie2').value
  let year2 = form.querySelector('.year2').value
  let season2 = form.querySelector('.season2').value
  let episode2 = form.querySelector('.episode2').value

  t1.movie1 = movie1
  t1.season1 = season1
  t1.year1 = year1
  t1.episode1 = episode1

  t2.movie2 = movie2
  t2.season2 = season2
  t2.year2 = year2
  t2.episode2 = episode2

  checkData()

  retrieveData()
    .then((filteredObject) => {
      attachment(filteredObject)
    })
    .catch((err) => console.log(err))

  e.preventDefault()
})

//  title provided can be movie or series
//  if client provides season or episode or both of them, then search is specified under SERIES categories
// OTHERWISE, search is not categorized on any on basis
const checkData = () => {
  let type1 = 'series'
  let type2 = 'series'

  if (t1.season1 === '' && t1.episode1 === '') {
    type1 = 'movies'
    url1 = baseURL + '&t=' + t1.movie1
    if (t1.year1 !== '') {
      url1 += '&y=' + t1.year1
    }
  } else {
    console.log('1: Searched as SERIES')
  }

  if (t2.season2 === '' && t2.episode2 === '') {
    type2 = 'movies'
    url2 = baseURL + '&t=' + t2.movie2
    if (t2.year2 !== '') {
      url2 += '&y=' + t2.year2
    }
  } else {
    console.log('2: Searched as SERIES')
  }
}

const attachment = ({ data1, data2 }) => {
  // console.log(data1,data2)
  const attachmentObj = { data1: {}, data2: {} }

  if (data1 && data2) {
    for (key in data1) {
      if (key in data2) {
        attachmentObj.data1[key] = data1[key]
        attachmentObj.data2[key] = data2[key]
      }
    }
  } else if (data1) {
    for (key in data1) {
      attachmentObj.data1[key] = data1[key]
    }
    attachmentObj.data2 = false
  } else if (data2) {
    for (key in data2) {
      attachmentObj.data2[key] = data2[key]
    }
    attachmentObj.data1 = false
  }

  // console.log('This is attachment object', attachmentObj)
  const excludedKeys = ['Poster', 'Ratings', 'imdbID']

  if (attachmentObj.data1 && attachmentObj.data2) {
    for (key in attachmentObj.data1) {
      if (excludedKeys.includes(key)) {
        continue
      }
      const label = key
      const cont1 = attachmentObj.data1[key]
      const cont2 = attachmentObj.data2[key]

      appends(label, cont1, cont2)
    }
  } else if (attachmentObj.data1) {
    appends('Error', '', "DOES NOT EXIST'S")
  } else {
    appends('Error', "DOES NOT EXIST'S", '')
  }
}

const retrieveData = async () => {
  const Obj = {}
  const response1 = await fetch(url1)
  const data1 = await response1.json()

  const response2 = await fetch(url2)
  const data2 = await response2.json()

  if (data1.Response === 'True') {
    Obj.data1 = data1
  } else {
    Obj.data1 = false
  }
  if (data2.Response === 'True') {
    Obj.data2 = data2
  } else {
    Obj.data2 = false
  }
  return Obj
}

const appends = (label, cont1, cont2) => {
  const hook = document.querySelector('.containerX')

  // label
  const divLabelX = document.createElement('div')
  divLabelX.classList.add('labelX')
  const titleLabelX = document.createElement('div')
  titleLabelX.classList.add('title')
  titleLabelX.textContent = label
  divLabelX.appendChild(titleLabelX)

  // cont1
  const divCont1X = document.createElement('div')
  divCont1X.classList.add('cont1X')
  const titleCont1X = document.createElement('div')
  titleCont1X.classList.add('title')
  titleCont1X.textContent = cont1
  divCont1X.appendChild(titleCont1X)

  // cont2
  const divCont2X = document.createElement('div')
  divCont2X.classList.add('cont2X')
  const titleCont2X = document.createElement('div')
  titleCont2X.classList.add('title')
  titleCont2X.textContent = cont2
  divCont2X.appendChild(titleCont2X)

  hook.appendChild(divLabelX)
  hook.appendChild(divCont1X)
  hook.appendChild(divCont2X)
}

const clearHook = () => {
  const parent = document.querySelector('.containerX')
  // const parent = document.getElementById('foo')
  while (parent.firstChild) {
    parent.firstChild.remove()
  }
}
