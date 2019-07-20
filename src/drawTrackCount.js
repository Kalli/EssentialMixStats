import {GoogleCharts} from "google-charts"
import {createMixLink} from "./lib.js"

export function drawTrackCount(mixes){
	let dataTable = new GoogleCharts.api.visualization.DataTable({
		cols: [
			{id: 'date', label: 'Date', type: 'string'},
			{id: 'count', label: 'Count', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}}
		],
	})

	let total = 0
	dataTable.addRows(mixes.reduce((acc, mix, index) => {
		total += mix.tracklist.length
		let runningAverage
		if (index < 52){
			runningAverage = total / index + 1
		} else {
			total = total - mixes[index - 52].tracklist.length
			runningAverage = total / 52
		}
		const row = [mix.date, mix.tracklist.length, createMixLink(mix)]
		acc.push(row)
		return acc
	}, []))

	console.log(dataTable);

	dataTable.sort({column: 0, asc: true});

	let options = {
		chart: {
			title: 'Essential Mixes - Number of Tracks',
		},
		tooltip: {isHtml: true, trigger: 'selection'},
		width: '100%',
		height: '100%',
		legend: 'none',
		theme: 'material',
	    trendlines: {
	        0: {
                type: 'exponential',
                degree: 3,
                visibleInLegend: true,
		        color: 'red'
            }
        }
	}

	let chart = new GoogleCharts.api.visualization.LineChart(document.getElementById('track-count'));
	chart.draw(dataTable, options);
}