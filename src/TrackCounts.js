import {Chart} from 'react-google-charts';
import React, { Component} from "react"
import {completeTracklist, createMixLink, closeTooltipsOnClicks} from "./lib"


export default class TrackCounts extends Component {
	constructor(props) {
		super(props);
		this.state = {hideIncomplete: true, twoHours: true}
	}

	showComplete = () => {
		this.setState({hideIncomplete: !this.state.hideIncomplete})
    }

	showTwoHours = () => {
		this.setState({twoHours: !this.state.twoHours})
    }

	formatData(mixes){
		const mixesByYear = mixes.reduce((acc, mix) => {
			const complete = (!this.state.hideIncomplete || completeTracklist(mix))
			const twoHours = (!this.state.twoHours || mix.length === "2h")
			if (!mix.duplicate && complete && twoHours){
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

			const lowestFive = sorted[Math.floor((mixCount-1) * 0.05)]
			const lowestQuartile = sorted[Math.floor((mixCount-1) * 0.25)]
			const highestQuartile = sorted[Math.floor((mixCount-1) * 0.75)]
			const highestFive = sorted[Math.floor((mixCount-1) * 0.95)]

			const mostTracks = createMixLink(mixesByYear[year].mixes.find((mix) => mix.tracklist.length === max));
			const fewestTracks = createMixLink(mixesByYear[year].mixes.find((mix) => mix.tracklist.length === min));
			const tooltipLink = "https://www.mixesdb.com/w/Special:Search?fulltext=Search&cat=Essential+Mix&search="+year
			let tooltip = `<div class="track-count-tooltip chart-tooltip">
				<h4>
					<a href="${tooltipLink}" target="_blank">${year}</a>
				</h4>
				<ul>
				<li>Number of mixes: ${sorted.length}</li> 
				<li>Most tracks: ${max} - ${mostTracks}</li>
				<li>Fewest tracks : ${min} - ${fewestTracks} </li>
				<li>Average track count: ${average}</li>
				<li>Median track count: ${median}</li>
			</ul>`

			acc.push([
				year,
				average,
				min,
				lowestFive,
				lowestQuartile,
				highestQuartile,
				highestFive,
				max,
				tooltip
			])
			return acc
		}, [])
	}

	render(){
		const mixes = this.formatData(this.props.mixes)
		const colors = [ "#699CFF", "#578AF0", "#4578DE", "#3366cc"]
		return(
			<>
				<Chart
					height={900}
					className={"center-block"}
					chartType="LineChart"
					loader={<div>Loading Chart</div>}
					data={[
						[
							{id: 'date', label: 'Year', type: 'string'},
							{id: 'average', label: 'Average number of tracks per mix', type: 'number'},
							{id: 'min-max',  type: 'number', role: 'interval'},
							{id: 'ninetyFive', type: 'number', role: 'interval'},
							{id: 'fifty', type: 'number', role: 'interval'},
							{id: 'fifty', type: 'number', role: 'interval'},
							{id: 'ninetyFive', type: 'number', role: 'interval'},
							{id: 'min-max', type: 'number', role: 'interval'},
							{type: 'string', role: 'tooltip', 'p': {'html': true}},
						],
						...mixes
					]}
					options={{
						pointSize: 10,
						title: 'Number of Tracks per Essential Mix by Year',
						chartArea: {'width': '80%', 'height': '80%'},
						hAxis: {
							title: 'Year',
						},
						vAxis: {
							title: 'Tracks per mix',
						},
						tooltip: {isHtml: true, trigger: 'selection'},
                        legend: {position: 'bottom'},
						curveType: 'function',
						lineWidth: 4,
						intervals: {
							'lineWidth': 2,
							style: 'area',
						},
						series: [{
								color: colors[3]
						}],
						interval: {
			                'min-max': {style:'area', color:colors[2], fillOpacity: 1},
				            'ninetyFive': {style:'area', color:colors[1], fillOpacity: 1},
				            'fifty': {style:'area', color:colors[0], fillOpacity: 1},
						}
					}}
					chartEvents={[{
						eventName: "ready",
						callback: ({ chartWrapper, google }) => closeTooltipsOnClicks(chartWrapper, google)
					}]}
				/>
				<div className="track-count-controls text-center">
					<div className={"overlay"}>
						<span className={"label label-default"} style={{backgroundColor: colors[0]}}>
							50% of all mixes (25%-75%)
						</span>
						<span className={"label label-default"} style={{backgroundColor: colors[1]}}>
							95% of all mixes (5%-95%)
						</span>
						<span className={"label label-default"} style={{backgroundColor: colors[2]}}>
							Outliers (fewest and most tracks)
						</span>
					</div>
	                <label className="checkbox-inline" >
						<input type="checkbox"
						       value="hideIncomplete"
						       checked={this.state.hideIncomplete}
						       onChange={this.showComplete}
						/>
						Disregard incomplete tracklists
	                </label>
					<label className="checkbox-inline" >
						<input type="checkbox"
						       value="hideTwoHours"
						       checked={this.state.twoHours}
						       onChange={this.showTwoHours}
						/>
						Limit to two hour long mixes
	                </label>
					<div className={"small"}>
						(Click the points in the graph for more information about each year)
					</div>
				</div>
			</>
		)
	}
}
