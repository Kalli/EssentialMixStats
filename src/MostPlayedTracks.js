import React, { Component} from "react"
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator';
import {createMixLink} from './lib'


export default class MostPlayedTracks extends Component {
	constructor(props) {
		super(props)
		this.state = {active: "tracks", url: window.location.href}
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

				switch (this.state.active) {
					case "tracks" :
						const track = `${artist} - ${trackName}`
						if (!["unknown - unknown", "Jon Gaiser - ?''", "? - Untitled''"].includes(track)){
							this.addOrAppend(acc, track, mixLink)
						}
						break
					case "artists" :
						if (artist !== "unknown" && artist !== "''?" && artist !== "?"){
							this.addOrAppend(acc, artist, mixLink)
						}
						break
					case "labels":
						if (label !== "" && label !== "unknown"){
							this.addOrAppend(acc, label, mixLink)
						}
						break
				}
			})
			return acc
		}, {})

		const allData = Object.entries(counters).reduce(function(acc, e){
			e[1]['name'] = e[0]
			acc.push(e[1])
			return acc
		}, [])

		return allData.sort((a, b) => b['count'] - a['count']).slice(0, 250).map((e, index) => {
			e['played_by'] = Object.entries(e['played_by']).reduce((links, link) => {
				const l = link[0] + (link[1] > 1 ? ` (x ${link[1]})`: "")
				links.push(l)
				return links
			}, [])
			e['position'] = index+1
			return e
		})
	}

	generateSearchLinks(searchTerm){
		return [
			["https://www.youtube.com/results?search_query=", "YouTube.png"],
			["https://open.spotify.com/search/results/", "Spotify.png"],
			["http://www.junodownload.com/search/?ref=bbis&q%5Ball%5D%5B%5D=", "JD.png"],
			["https://www.discogs.com/search/?type=all&q=", "Discogs.png"],
			["https://www.mixesdb.com/db/index.php?fulltext=Search&title=&search=", "Mixesdb.png"],
		].map((site, index) => {
			const link = site[0]+escape(searchTerm)
			return (
				<a href={link} key={index} target="_blank">
					<img src={this.state.url+"/static/"+site[1]} alt={site[1].replace(".png", "")}/>
				</a>
			)
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
		<div className={"tracks-table col-xs-10 col-xs-offset-1"}>
			{this.createTabs()}
			<BootstrapTable
				keyField='name'
				data={ this.formatData(this.props.mixes) }
				columns={ columns }
				expandRow={expandRow}
				striped={true}
				pagination={ paginationFactory({sizePerPageList: [50]}) }
				tabIndexCell={true}
			/>
		</div>)
	}
}
