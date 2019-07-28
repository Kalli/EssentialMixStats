import React, { Component} from "react"
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';
import {createMixLink} from './lib'


export default class MostPlayedTracks extends Component {
	constructor(props) {
		super(props)
	}

	formatData(mixes){
		return mixes.reduce((acc, mix) => {
			mix.tracklist.forEach((trackInfo) => {
				const [artist, trackName, label] = trackInfo
				const track = `${artist} - ${trackName}`
				if (track !== "unknown - unknown" && track !== "Jon Gaiser - ?''"){
					if (track in acc.tracks){
							acc.tracks[track]['count'] += 1
							acc.tracks[track]['played_by'].push(createMixLink(mix))
					} else {
						acc.tracks[track] = {
							'count': 1,
							'played_by': [createMixLink(mix)]
						}
					}
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
		const tracks = Object.entries(data.tracks).reduce((acc, e) => {
			e[1]['name'] = e[0]
			acc.push(e[1])
			return acc
		}, []).sort((a, b) => b['count'] - a['count']).slice(0, 250)

		const columns = [{
			dataField: 'name',
			text: 'Track Name'
		}, {
			dataField: 'count',
			text: 'Times Played'
		}]

		const expandRow = {
			renderer: row => (
				<div>
					<h6 className={"text-left"}>Played By:</h6>
					<ul className={"list-inline"}>
						{Array.from(row['played_by']).sort().map((e, index) => (
							<li className={"col-xs-3 text-left"} key={index} dangerouslySetInnerHTML={{__html: e}} />
						))}
					</ul>
				</div>
			)
		};

		return <BootstrapTable
			keyField='name'
			data={ tracks }
			columns={ columns }
			expandRow={expandRow}
			striped={true}
			pagination={ paginationFactory({sizePerPageList: [50]}) }
		/>
	}
}
