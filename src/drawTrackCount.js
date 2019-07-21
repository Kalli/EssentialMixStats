import {GoogleCharts} from "google-charts"
import {completeTracklist, createMixLink} from "./lib.js"

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

	const mixesByYear = mixes.reduce((acc, mix) => {
		if (!mix.duplicate && completeTracklist(mix)){
			const year = mix.date.slice(0, 4)
			if ( year in acc){
				acc[year].trackCounts.push(mix.tracklist.length)
				acc[year].mixes.push(mix)
			} else {
				acc[year] = {}
				acc[year].trackCounts = [mix.tracklist.length]
				acc[year].mixes = [mix]
			}
		}
		return acc
	}, {})

	dataTable.addRows(Object.keys(mixesByYear).reduce((acc, year) => {

		const mixCount = mixesByYear[year].trackCounts.length
		const average = Math.floor(mixesByYear[year].trackCounts.reduce((acc, elem) => acc + elem, 0) / mixCount)

		const sorted = mixesByYear[year].trackCounts.sort((a, b) => a - b)
	    const middle = Math.floor((mixCount - 1) / 2)
		const median = mixCount % 2 ? sorted[middle] :  (sorted[middle] + sorted[middle + 1]) / 2.0

		const max = sorted[sorted.length - 1]
		const min = sorted[0]

		const lowestQuartile = sorted[Math.floor((mixCount-1) * 0.25)]
		const highestQuartile = sorted[Math.floor((mixCount-1) * 0.75)]

		const mostTracks = createMixLink(mixesByYear[year].mixes.find((mix) => mix.tracklist.length === max));
		const fewestTracks = createMixLink(mixesByYear[year].mixes.find((mix) => mix.tracklist.length === min));

		let tooltip = `Number of mixes: ${sorted.length} <br> `
		tooltip += `Most tracks: ${max} - ${mostTracks}<br>`
		tooltip += `Fewest tracks : ${min} - ${fewestTracks} <br>`
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