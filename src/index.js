import $ from 'jquery'
import {drawTrackCount} from './drawTrackCount.js'
import {GoogleCharts} from 'google-charts';


$(document).ready(function(){
    $.getJSON("/data.json", function(data){

        GoogleCharts.load(function(){drawCharts(data, min, max)}, {
        	'packages':['bar', 'treemap'],
	        'mapsApiKey': ''
        });

	    function getValues(){
            // Get slider values
            let parent = this.parentNode;
            let slides = parent.getElementsByTagName("input");
            let new_min = parseFloat(slides[0].value);
            let new_max = parseFloat(slides[1].value);

            // Neither slider will clip the other, so make sure we determine which is larger
            if( new_min > new_max ){ let tmp = new_max; new_max = new_min; new_min = tmp; }
			setText(new_min, new_max);
			drawCharts(data, new_min, new_max);
        }


	    function setText(min, max) {
		    let displayElement = document.getElementsByClassName("rangeValues")[0]
	        const minLink = `<a href="https://www.mixesdb.com/w/Category:${min}" target="_blank">${min}</a>`
	        const maxLink = `<a href="https://www.mixesdb.com/w/Category:${max}" target="_blank">${max}</a>`
		    displayElement.innerHTML = `Browsing Essential Mixes from ${minLink} - ${maxLink}`
	    }

	    function setSliders(min, max){
	        let sliderSections = document.getElementsByClassName("range-slider");
	        for( let i = 0; i < sliderSections.length; i++ ){
	            let sliders = sliderSections[i].getElementsByTagName("input");
	            for( let j = 0; j < sliders.length; j++ ){
	                if( sliders[j].type === "range" ){
	                    sliders[j].max = max;
	                    sliders[j].min = min;
	                    sliders[j].value = j === 0 ? min : max;
	                    sliders[j].oninput = getValues;
	                    sliders[j].onchange = getValues;
	                }
		        }
	        }
	    }

	    const min = 1993;
	    const max = 2019;
		setSliders(min, max)
		setText(min, max)

        function drawCharts(data, min, max){
			const mixes = data.filter((mix) => {
				const year = Number(mix.date.slice(0, 4))
				return min <= year && year <= max
			})

    	    drawTrackCount(mixes)
        }
    })
})
