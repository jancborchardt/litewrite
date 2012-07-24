function $(id) {
	return document.getElementById(id)
}
var id = localStorage.last_id = localStorage.last_id || 0


function show(id) { // fill the editor and memorize the current document
	$('editor').value = localStorage.getItem(id + '_html') || ''
	localStorage.setItem('current-document', id)
}

function select() { // not sure what this does
	document.createRange().setStart($('editor'), 0)
	getSelection().removeAllRanges()
	getSelection().addRange(document.createRange())
}

function create() { // create a new document and focus on it
	id = ++localStorage.last_id
	$('editor').value = ''
	localStorage.setItem(id, '')
	location.hash = '#'+ id
	select()
	updateList()
	$('editor').focus() // still does not really work in Firefox …
}

function updateList() {
	var l = parseInt(localStorage.last_id) + 1
	var r = []
	for (var i=0; i<l; ++i) {
		var item = localStorage.getItem(i)
		// var itemhtml = localStorage.getItem(i+'_html')
		if (item) {
			r.push('<a id="item_'+ i +'" href="#'+i+'">'+ item.slice(0, 50) +'</a>')
			// this makes for a better cut, but does not always work
			// r.push('<a id="item_'+ i +'" href="#'+i+'">'+ itemhtml.slice(0, itemhtml.indexOf('<') +'</a>')
		}
	}

	$('entries').innerHTML = r.join('')
	highlightSelected()
}

function check() {
	var hash = location.hash
	if (hash) {
		id = hash.slice(1)
		if(id in localStorage) {
			show(id)
		}
	} else {
        if('current-document' in localStorage) {
            show(localStorage.getItem('current-document'))
            location.hash = '#'+localStorage.getItem('current-document')
        } else {
            create()
        }
	}
	updateList()
	select()
	document.getElementsByTagName('body')[0].className = localStorage.getItem('bgcolor') +' '+ localStorage.getItem('typeface')
	$('aside').className = 'visible'
	setTimeout( function() { $('aside').className = '' } , 2000) // maybe only fade out after typing start
}

function setTitle(str) {
	if (str.length >= 30) {
		var i = str.lastIndexOf(" ") + 1
		if (i)
			str = str.slice(0, i)
		str += '...'
	}
	document.title = str
}

function highlightSelected() {
	var hash = location.hash.slice(1)
	if (!hash) return
	var element = $('item_'+hash)
	if (element) {
		element.className += ' selected'
		setTitle(element.textContent)
	}
}

function colorToggle() {
	var body = document.getElementsByTagName('body')[0]
	if(body.className.indexOf('dark') != -1) {
		body.className = localStorage.getItem('typeface')
		localStorage.setItem('bgcolor', '')
	}
	else {
		body.className = 'dark '+localStorage.getItem('typeface')
		localStorage.setItem('bgcolor', 'dark')
	}
}

function serifToggle() {
    var body = document.getElementsByTagName('body')[0]
	if(body.className.indexOf('serif') != -1) {
		body.className = localStorage.getItem('bgcolor')
		localStorage.setItem('typeface', '')
	}
	else {
		body.className = 'serif '+localStorage.getItem('bgcolor')
		localStorage.setItem('typeface', 'serif')
	}
}

function formatting() { // this needs to get incredibly optimized …
	for(i=0; i<$('editor').getElementsByTagName('div').length; i++) {
		// TODO: bullet points, deactivated for now /*
		/*if(($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '* ') || ($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '• ')) {
			$('editor').getElementsByTagName('div')[i].className = 'listelement'
			if($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '* ') {
				$('editor').getElementsByTagName('div')[i].innerHTML = '•' + $('editor').getElementsByTagName('div')[i].innerHTML.substring(1)
			}
		}
		else */
		// style every line beginning with # like a heading, TODO: make work in Firefox
		if($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 1) == '#') {
			$('editor').getElementsByTagName('div')[i].className = 'subheading'
		}
		// TODO: also style when <h1> etc is used
		else {
			$('editor').getElementsByTagName('div')[i].className = ''
		}
	}
}


$('editor').onkeyup = $('editor').onpaste = function(e) {
	var html = e.target.value
	if (html != localStorage.getItem(id+'_html')) {
		localStorage.setItem(id, e.target.value)
		localStorage.setItem(id+'_html', html)
		updateList()
	}
	formatting()
}

onload=onhashchange=check
