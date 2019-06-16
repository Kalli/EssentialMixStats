import $ from 'jquery'

$(document).ready(function(){
    $.getJSON("/data.json", function(data){
		console.log("Hello world");
    })
})
