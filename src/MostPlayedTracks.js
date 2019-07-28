import React, { Component} from "react"
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';
import {createMixLink} from './lib'


export default class MostPlayedTracks extends Component {
	constructor(props) {
		super(props)
		this.state = {active: "tracks"}
	}

	addOrAppend(counter, element, link){
		if (element in counter){
			counter[element]['count'] += 1
			if (link in counter[element]['played_by']){
				counter[element]['played_by'][link] += 1
			}else{
				counter[element]['played_by'][link] = 1
			}
		} else {
			counter[element] = {
				'count': 1,
				'played_by': {}
			}
			counter[element]['played_by'][link] = 1
		}
	}

	formatData(mixes){
		const counters = mixes.reduce((acc, mix) => {
			mix.tracklist.forEach((trackInfo) => {
				const mixLink = createMixLink(mix)
				const [artist, trackName, label] = trackInfo
				const track = `${artist} - ${trackName}`
				if (track !== "unknown - unknown" && track !== "Jon Gaiser - ?''"){
					this.addOrAppend(acc.tracks, track, mixLink)
				}
				if (artist !== "unknown" && artist !== "''?" && artist !== "?"){
					this.addOrAppend(acc.artists, artist, mixLink)
				}
				if (label !== "" && label !== "unknown"){
					this.addOrAppend(acc.labels, label, mixLink)
				}
			})
			return acc
		}, {"artists": {}, "tracks": {}, "labels": {}})

		const allData = Object.keys(counters).reduce((acc, key) => {
			acc[key] = []
			Object.entries(counters[key]).forEach(function(e){
				e[1]['name'] = e[0]
				acc[key].push(e[1])
			})
			return acc
		}, {})

		return Object.keys(allData).reduce((acc, key) => {
			acc[key] = allData[key].sort((a, b) => b['count'] - a['count']).slice(0, 250)
			acc[key] = acc[key].map((e, index) => {
				e['played_by'] = Object.entries(e['played_by']).reduce((links, link) => {
					const l = link[0] + (link[1] > 1 ? ` (x ${link[1]})`: "")
					links.push(l)
					return links
				}, [])
				e['position'] = index+1
				return e
			})
			return acc
		}, {})
	}

	generateSearchLinks(searchTerm){
		return [
			["https://www.youtube.com/results?search_query=", "YouTube.png"],
			["https://open.spotify.com/search/results/", "Spotify.png"],
			["http://www.junodownload.com/search/?ref=bbis&q%5Ball%5D%5B%5D=", "JD.png"],
			["https://www.discogs.com/search/?type=all&q=", "Discogs.png"],
			["https://www.mixesdb.com/db/index.php?fulltext=Search&title=&search=", "Mixesdb.png"],
		].map((site, index) => {
			const link = site[0]+searchTerm
			return (<a href={link} key={index} target="_blank"><img src={"/static/"+site[1]} alt={site[1].replace(".png", "")}/></a>)
		})
	}

	selectContent(tab){
		this.setState({active: tab})
	}

	createTabs() {
		const tabs = ['tracks', 'artists', 'labels']
		return (
			<ul className="nav nav-tabs nav-justified">
				{tabs.map((tab)=>{
					return (
						<li key={tab} role="presentation" className={this.state.active === tab? "active": ""}>
							<a onClick={e => this.selectContent(tab)} className={"tab"}>{tab}</a>
						</li>
					)
				})}
			</ul>
		)
	}

	render(){
		const columns = [
			{dataField: 'position', text: '#'},
			{dataField: 'name', text: 'Name'},
			{dataField: 'count', text: 'Times Played'}
		]
		const data = this.formatData(this.props.mixes)[this.state.active]

		const expandRow = {
			renderer: row => (
				<div>
					<div className={"links"}>
						{this.generateSearchLinks(row.name)}
					</div>
					<h6 className={"text-left"}>Played By:</h6>
					<ul className={"list-inline"}>
						{Array.from(row['played_by']).sort().map((e, index) => (
							<li className={"col-xs-4 text-left"} key={index} dangerouslySetInnerHTML={{__html: e}} />
						))}
					</ul>
				</div>
			),
			showExpandColumn: true,
            expandColumnPosition: 'right'
		}

		return (
		<>
			{this.createTabs()}
			<BootstrapTable
				keyField='name'
				data={ data }
				columns={ columns }
				expandRow={expandRow}
				striped={true}
				pagination={ paginationFactory({sizePerPageList: [50]}) }
				tabIndexCell={true}
			/>
		</>)
	}
}
