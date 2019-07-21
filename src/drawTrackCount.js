import {GoogleCharts} from "google-charts"
import {completeTracklist} from "./lib.js"

export function drawTrackCount(mixes){
	let dataTable = new GoogleCharts.api.visualization.DataTable({
		cols: [
			{id: 'date', label: 'Year', type: 'string'},
			{id: 'count', label: 'Min', type: 'number'},
			{id: 'count', label: 'Lowest Q', type: 'number'},
			{id: 'count', label: 'Highest Q', type: 'number'},
			{id: 'count', label: 'Max', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}}
		],
	})

	const trackCountsByYear = mixes.reduce((acc, mix) => {
		if (!mix.duplicate){
			const year = mix.date.slice(0, 4)
			acc[year] ? acc[year].push(mix.tracklist.length) : acc[year] = [mix.tracklist.length]
		}
		return acc
	}, {})

	dataTable.addRows(Object.keys(trackCountsByYear).reduce((acc, year) => {

		const mixCount = trackCountsByYear[year].length
		const average = Math.floor(trackCountsByYear[year].reduce((acc, elem) => acc + elem, 0) / mixCount)

		const sorted = trackCountsByYear[year].sort((a, b) => a - b)
	    const middle = Math.floor((mixCount - 1) / 2)
		const median = mixCount % 2 ? sorted[middle] :  (sorted[middle] + sorted[middle + 1]) / 2.0

		const max = Math.max(...trackCountsByYear[year])
		const min = Math.min(...trackCountsByYear[year])


		const lowestQuartile = sorted[Math.floor((mixCount-1) * 0.25)]
		const highestQuartile = sorted[Math.floor((mixCount-1) * 0.75)]

		let tooltip = `Number of mixes: ${trackCountsByYear[year].length} <br> `
		tooltip += `Most tracks: ${max} <br>`
		tooltip += `Fewest tracks : ${min} <br>`
		tooltip += `Average track count: ${average}<br>`
		tooltip += `Median track count: ${median}`
		acc.push([year, min, lowestQuartile, highestQuartile, max, tooltip])
		return acc
	}, []))

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

	let chart = new GoogleCharts.api.visualization.CandlestickChart(document.getElementById('track-count'));
	chart.draw(dataTable, options);
}