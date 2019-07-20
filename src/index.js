import $ from 'jquery'
import {drawTrackCount} from './drawTrackCount.js'
import {GoogleCharts} from 'google-charts';


$(document).ready(function(){
    $.getJSON("/data.json", function(data){

        GoogleCharts.load(function(){drawCharts(data)}, {
        	'packages':['bar', 'treemap'],
	        'mapsApiKey': ''
        });

        function drawCharts(data){
    	    drawTrackCount(data)
        }

    })
})
