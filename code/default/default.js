console.log('default');

document.getElementById('test').addEventListener('click', () => {
  console.log('test clicked')
})

let li = document.querySelectorAll('li');
console.log(li)