/**
 *
 * HELPER
 *
 */
const deb = console.log.bind(window.console)
const select = document.querySelector.bind(document)
const selectAll = document.querySelectorAll.bind(document)

/**
 *
 * VARS
 *
 */
// https://dev.to/pulljosh/how-to-load-html-css-and-js-code-into-an-iframe-2blc
var editor = {}
var data = {}
var html, css, js
let filename = 'HCJPen'
var iframe = select('.resultBox iframe')
const runButton = select('header .run')
const fullpageLink = select('header .fullpageLink')
const downloadButton = select('header .download')
window.onload = function () {
  loadFileContent('default')
}

/**
 *
 * eventListener
 *
 */
runButton.addEventListener('click', () => {
  createIframe(data)
})
downloadButton.addEventListener('click', () => {
  downloadAsFile(data, true)
})

/**
 *
 * download html file
 *
 */
function downloadAsFile () {
  downloadString(html_string, 'text/csv', 'index.html')
  function downloadString (text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType })
    var a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(function () {
      URL.revokeObjectURL(a.href)
    }, 1500)
  }
}

/**
 *
 * detect changes in editors and reload the iframe (if checkbox)
 *
 */
function reloadIframeOnChange () {
  editor['html'].getModel().onDidChangeContent(event => {
    runButton.classList.add('change')
    if (select('#cbhtml').checked) {
      createIframe(data)
    }
  })

  editor['css'].getModel().onDidChangeContent(event => {
    runButton.classList.add('change')
    if (select('#cbcss').checked) {
      createIframe(data)
    }
  })

  editor['javascript'].getModel().onDidChangeContent(event => {
    runButton.classList.add('change')
    if (select('#cbjs').checked) {
      createIframe(data)
    }
  })
}

/**
 *
 * create iframe and load all content to it
 *
 */
function createIframe (data) {
  // get values (content) from editors
  data[0] = editor['html'].getValue()
  data[1] = editor['css'].getValue()
  data[2] = editor['javascript'].getValue()

  // save to localStorage & reload iframe
  localStorage.setItem(filename, JSON.stringify(data))
  iframe.src = 'iframe.html?console&file=' + filename

  // add filename to fullpage link
  fullpageLink.href = 'iframe.html?file=' + filename

  // reset bitton boarder
  runButton.classList.remove('change')
}

/**
 *
 * load three file contents & load it to the editor
 *
 */
function loadFileContent (file) {
  fetch(`./code/${file}/${file}.json`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      loadEditor(select('.HTMLbox .editor'), data.html, 'html')
      loadEditor(select('.CSSbox .editor'), data.css, 'css')
      loadEditor(select('.JSbox .editor'), data.js, 'javascript')
      return data
    })
    .then(data =>
      setTimeout(() => {
        createIframe(data)
        reloadIframeOnChange()
      }, 1000)
    )
}

/**
 *
 * load monaco editor
 *
 */
var require = { paths: { vs: 'assets/vs' } }
function loadEditor (element, fileContent, lang) {
  monaco.editor.defineTheme('OneDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '#7f848e' },
      { token: 'attribute.value.html', foreground: '#98C379' },
      { token: 'attribute.name.html', foreground: '#D19A66' },
      { token: 'tag.html', foreground: '#E06C75' },
      { token: 'tag.css', foreground: '#D19A66' }
    ],
    colors: {
      'editor.background': '#151515'
    }
  })

  editor[lang] = monaco.editor.create(element, {
    value: fileContent,
    language: lang,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: true,
    readOnly: false,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
      enabled: false
    },
    automaticLayout: true,
    contextmenu: true,
    fontSize: 14,
    scrollbar: {
      useShadows: false,
      vertical: 'hidden',
      horizontal: 'visible',
      horizontalScrollbarSize: 12,
      verticalScrollbarSize: 0
    },
    theme: 'OneDark'
  })
}

// read all items in locasStorage
// for (var i = 0; i < localStorage.length; i++) {
//     var key = localStorage.key(i);
//     var value = localStorage.getItem(key);
//     // console.log('Key: ' + key + ', Value: ' + value);
// }

/**
 *
 * add resize function
 *
 */
document.addEventListener('DOMContentLoaded', function () {
  resize(
    select('.divider'),
    select('.codeBoxes'),
    select('.resultBox'),
    (direction = 'horizontal')
  )
  resize(
    select('.CSSbox .header'),
    select('.HTMLbox'),
    select('.CSSbox'),
    (direction = 'vertical')
  )
  resize(
    select('.JSbox .header'),
    select('.CSSbox'),
    select('.JSbox'),
    (direction = 'vertical')
  )
})

/**
 *
 * resize elements
 *
 */
function resize (resizer, prevEl, nextEl, direction = 'horizontal') {
  let x = 0
  let y = 0
  let NextMaxWidth = 0
  let PrevMaxWidth = 0
  let NextMaxHeight = 0
  let PrevMaxHeight = 0

  const mouseDownHandler = function (e) {
    // deb('resizer', resizer)
    // deb('direction', direction)
    // deb('prevEl', prevEl)
    // deb('nextEl', nextEl)
    // deb(' ')

    if (direction === 'horizontal') {
      x = e.clientX
      PrevWidth = prevEl.getBoundingClientRect().width
      PrevMaxWidth = prevEl.getBoundingClientRect().width
      NextMaxWidth = nextEl.getBoundingClientRect().width
    }
    // vertically
    else {
      y = e.clientY
      PrevHeight = prevEl.getBoundingClientRect().height
      PrevMaxHeight = prevEl.getBoundingClientRect().height
      NextMaxHeight = nextEl.getBoundingClientRect().height
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }

  const mouseMoveHandler = function (e) {
    if (direction === 'horizontal') {
      const dx = e.clientX - x
      const newPrevMaxWidth = PrevMaxWidth + dx
      const newNextMaxWidth = NextMaxWidth - dx
      const newPrevWidth =
        ((PrevWidth + dx) * 100) /
        resizer.parentNode.getBoundingClientRect().width
      prevEl.style.width = `${newPrevWidth}%`
      prevEl.style.maxWidth = `${newPrevMaxWidth}px`
      nextEl.style.maxWidth = `${newNextMaxWidth}px`
      // STYLE
      resizer.style.cursor = 'col-resize'
      document.body.style.cursor = 'col-resize'
    }
    // vertically
    else {
      const dy = e.clientY - y
      const newPrevMaxHeight = PrevMaxHeight + dy
      const newNextMaxHeight = NextMaxHeight - dy
      const newPrevHeight =
        ((PrevHeight + dy) * 100) /
        resizer.parentNode.getBoundingClientRect().height
      if (newNextMaxHeight > 23) {
        prevEl.style.height = `${newPrevHeight}%`
        prevEl.style.maxHeight = `${newPrevMaxHeight}px`
        nextEl.style.maxHeight = `${newNextMaxHeight}px`
      }

      resizer.style.cursor = 'row-resize'
      document.body.style.cursor = 'row-resize'
    }
    // STYLE
    prevEl.style.userSelect = 'none'
    prevEl.style.pointerEvents = 'none'
    nextEl.style.userSelect = 'none'
    nextEl.style.pointerEvents = 'none'
  }

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
    // STYLE
    resizer.style.removeProperty('cursor')
    document.body.style.removeProperty('cursor')
    prevEl.style.removeProperty('user-select')
    prevEl.style.removeProperty('pointer-events')
    nextEl.style.removeProperty('user-select')
    nextEl.style.removeProperty('pointer-events')
  }
  resizer.addEventListener('mousedown', mouseDownHandler)
}
