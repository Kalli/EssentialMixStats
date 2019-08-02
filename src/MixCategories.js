import {Chart} from 'react-google-charts';
import React, { Component} from "react"
import {reduceCategories} from "./lib"


export default class MixCategories extends Component {
	constructor(props) {
		super(props)
		const categoryCounts = this.getMixesByCategories(this.props.mixes)
		const categories = categoryCounts.reduce((acc, e) => {
			acc.push(e[0])
			return acc
		}, [])
		this.state = {
			categoryCounts: categoryCounts,
			allCategories: categories,
			selectedCategories: categories.slice(0, 3)
		}
	}

	getMixesByCategories(mixes){
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

	getCategoriesByYears(mixes, categories){
		const yearMap = [...Array(2019-1992).keys()].map((i)=>{return 2019-i}).reduce((acc, year) => {
			const c = {}
			categories.forEach((e)=>c[e] = 0)
			acc[year] = c
			return acc
		}, {})

		const categoriesByYears = mixes.reduce((acc, mix) => {
			const year = mix.date.slice(0, 4)
			if (!mix.duplicate && year){
				mix.categories.forEach((category) => {
					if (categories.includes(category)){
						acc[year][category] +=1
					}
				})
			}
			return acc
		}, yearMap)
		const header = [
			{id: 'year', label: 'Year', type: 'string'},
			...categories.map((cat) => ({id: cat, label: cat, type: 'number'}))
		]

		return Object.keys(categoriesByYears).reduce((acc, year) => {
			acc.push([year, ...Object.entries(categoriesByYears[year]).map((e)=>e[1])])
			return acc
		}, [header])
	}

	handleSelectCategory(event){
		const category = event.target.value
		const index = this.state.selectedCategories.indexOf(category)
		if (index === -1){
			this.setState({selectedCategories: [...this.state.selectedCategories, category] })
		}else{
			if (this.state.selectedCategories.length > 1){
				const selectedCategories = this.state.selectedCategories.filter((_, i) => i !== index)
				this.setState({selectedCategories: selectedCategories })
			}
		}
	}

	selectCategories(categories){
		return (
			<div className={"text-left"}>
				{categories.map((c) => {
					return (
						<label className={"checkbox col-xs-6 col-md-12"} key={c}>
							<input
								type={"checkbox"}
								checked={this.state.selectedCategories.includes(c)}
								onChange={(value) => this.handleSelectCategory(value)}
								value={c}
							/>
							{c}
						</label>
					)
				})}
			</div>
		)
	}

	render(){
		const categoriesByYear = this.getCategoriesByYears(this.props.mixes, this.state.selectedCategories)
		return 	(
			<div className={"col-xs-12"}>
				<h2>Mixes by Categories</h2>
				<Chart
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
						...this.state.categoryCounts
					]}
					options={{
						title: 'Categories',
						chartArea: {'width': '80%', 'height': '80%'},
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
				<h2>Categories by Year</h2>
				<div className={"categories-year-chart col-md-10 col-xs-12"}>
					<Chart
						height={700}
						className={"center-block"}
						chartType="LineChart"
						loader={<div>Loading Chart</div>}
						data={categoriesByYear}
						options={{
							title: 'Categories by Year',
							isStacked: 'relative',
							chartArea: {'width': '80%', 'height': '80%'},
							hAxis: {
								title: 'Year',
								ticks: 2,
							},
							vAxis: {
								title: 'Count',
								format: 0,
							},
							tooltip: {isHtml: true, trigger: 'selection'},
							legend: 'bottom',
						}}
					/>
				</div>
				<div className={"select-categories col-md-2 col-xs-12"}>
					<h4>Select categories: </h4>
					{this.selectCategories(this.state.allCategories)}
				</div>
			</div>
		)
	}
}
