import {Chart} from 'react-google-charts';
import React, { Component} from "react"

export default class MostPlayedTracks extends Component {
	constructor(props) {
		super(props);
	}

	formatData(mixes){
		return mixes.reduce((acc, mix) => {
			mix.tracklist.forEach((trackInfo) => {
				const [artist, trackName, label] = trackInfo
				const track = `${artist} - ${trackName}`
				if (track !== "unknown - unknown" && track !== "''Jon Gaiser - ?''"){
					acc.tracks[track] = acc.tracks[track] ? acc.tracks[track]  + 1 : 1
				}
				if (artist !== "unknown" && artist !== "''?" && artist !== "?"){
					acc.artists[artist] = acc.artists[artist] ? acc.artists[artist]  + 1 : 1
				}
				if (label !== "" && label !== "unknown"){
					acc.labels[label] = acc.labels[label] ? acc.labels[label]  + 1 : 1
				}

			})
			return acc
		}, {"artists": {}, "tracks": {}, "labels": {}})
	}

	render(){
		const data = this.formatData(this.props.mixes)
		const tracks = Object.keys(data.artists).reduce((acc, e) => {
			acc.push([e, data.artists[e]])
			return acc
		}, []).sort((a, b) => b[1] - a[1]).slice(0, 250)
		return 	<Chart
			height={900}
			width={"100%"}
			className={"center-block"}
			chartType="Table"
			loader={<div>Loading Chart</div>}
			data={[
				[
				      { type: 'string', label: 'Name' },
				      { type: 'number', label: 'Count' },
				],
				...tracks
			]}
			options={{
                showRowNumber: true,
				page: 'enable',
				pageSize: 25
			}}
		/>
	}
}
