const {shell} = require("electron");

const links = document.querySelectorAll('a[href]')

function InitLink() {
	Array.prototype.forEach.call(links, (link) => {
	  const url = link.getAttribute('href')
	  if (url.indexOf('http') === 0) {
	    link.addEventListener('click', (e) => {
	      e.preventDefault()
	      shell.openExternal(url)
	    })
	  }
	})
}

$(function(){
	InitLink();
});