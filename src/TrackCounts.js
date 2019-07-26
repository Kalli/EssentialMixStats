import {Chart} from 'react-google-charts';
import React, { Component} from "react"
import {completeTracklist, createMixLink} from "./lib"


export default class TrackCounts extends Component {
	constructor(props) {
		super(props);
	}

	formatData(mixes){
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

		return Object.keys(mixesByYear).reduce((acc, year) => {

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

			let tooltip = `<div><h2>${year}</h2><ul>`
			tooltip += `<li>Number of mixes: ${sorted.length}</li> `
			tooltip += `<li>Most tracks: ${max} - ${mostTracks}</li>`
			tooltip += `<li>Fewest tracks : ${min} - ${fewestTracks} </li>`
			tooltip += `<li>Average track count: ${average}</li>`
			tooltip += `<li>Median track count: ${median}</li>`
			tooltip += `</ul>`

			acc.push([year, min, lowestQuartile, highestQuartile, max, tooltip])
			return acc
		}, [])
	}

	render(){
		const mixes = this.formatData(this.props.mixes)

		return 	<Chart
			height={900}
			className={"center-block"}
			chartType="CandlestickChart"
			loader={<div>Loading Chart</div>}
			data={[
				[
					{id: 'date', label: 'Year', type: 'string'},
					{id: 'min', label: 'Min', type: 'number'},
					{id: 'lowQ', label: 'Lowest Q', type: 'number'},
					{id: 'highQ', label: 'Highest Q', type: 'number'},
					{id: 'max', label: 'Max', type: 'number'},
					{type: 'string', role: 'tooltip', 'p': {'html': true}},
				],
				...mixes
			]}
			options={{
				title: 'Number of Tracks per Essential Mix by Year',
				chartArea: { width: '80%' },
				hAxis: {
					title: 'Year',
				},
				vAxis: {
					title: 'Tracks per mix',
				},
				tooltip: {isHtml: true},
				legend: 'none',
			}}
		/>
	}
}