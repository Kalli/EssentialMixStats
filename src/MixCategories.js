import {Chart} from 'react-google-charts';
import React, { Component} from "react"
import {reduceCategories} from "./lib"


export default class MixCategories extends Component {
	constructor(props) {
		super(props);
	}

	formatData(mixes){
		const mixesByCategories = reduceCategories(mixes, ['Tracklist'])

		return mixesByCategories.reduce((acc, category) => {
			if (category.count >= 5) {
				const link = "https://www.mixesdb.com/w/Special:Search?fulltext=Search&cat=Essential+Mix&search="+category.name
				const count = category.count
				const toolTip = `<h4><a href="${link}" target="_blank">${category.name}</a> - ${count}</h4>`
				acc.push([category.name, category.count, toolTip])
			}
			return acc
		}, [])
	}

	render(){
		const mixes = this.formatData(this.props.mixes)

		return 	<Chart
			height={900}
			className={"center-block"}
			chartType="ColumnChart"
			loader={<div>Loading Chart</div>}
			data={[
				[
					{id: 'category', label: 'Category', type: 'string'},
					{id: 'count', label: 'Count', type: 'number'},
					{type: 'string', role: 'tooltip', 'p': {'html': true}},
				],
				...mixes
			]}
			options={{
				title: 'Categories',
				chartArea: { width: '80%' },
				hAxis: {
					title: 'Count',
				},
				vAxis: {
					title: 'Categories',
				},
				tooltip: {isHtml: true, trigger: 'selection'},
				legend: 'none',
			}}
		/>
	}
}
