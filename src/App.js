import React, { Component} from "react"

import RangeFilter from "./RangeFilter"
import CategoryFilter from "./CategoryFilter"
import TrackCounts from "./TrackCounts"
import MixCategories from "./MixCategories"

import {reduceCategories} from "./lib"

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
	        range: {min: 1993, max: 2019}
        }
    }

    loadData() {
        fetch(`/data/data.json`)
            .then( (response) => {
                return response.json()
            })
            .then( (json) => {
            	const categories = reduceCategories(json)
            	const allCategories = categories.reduce((acc, e) => {
		            	acc.push(e.name)
			            return acc
	            }, [])

            	this.setState({
		            loading: false,
		            data: json,
		            allData: json,
		            allCategories: allCategories,
		            categories: categories,
		            selectedCategories: allCategories
            	})
            });
    }

    componentDidMount() {
        this.setState({
	        loading: true,
            data: this.loadData()
        })
    }

    handleRangeChange = (range) => {
    	this.filterData(range, this.state.selectedCategories)
        this.setState({ range: range })
    }

    handleCategoryChange = (category) => {
    	const selectedCategories = this.state.selectedCategories
	    const index = selectedCategories.indexOf(category.name)
    	if (index !== -1){
    		selectedCategories.splice(index, 1);
	    }else{
    		selectedCategories.push(category.name)
	    }
    	this.filterData(this.state.range, selectedCategories)
    }

    selectAllCategories = () => {
	    this.setState({selectedCategories: this.state.allCategories})
	    this.filterData(this.state.range, this.state.allCategories)
    }

    selectNoCategories = () => {
	    this.setState({selectedCategories: []})
        this.filterData(this.state.range, [])
    }

    filterData(dateRange, selectedCategories){
	    const filteredMixes = this.state.allData.filter((mix) => {

	    	if (selectedCategories.length === 0){
	    		return false
		    }

            const all = selectedCategories === this.state.allCategories

	    	const year = Number(mix.date.slice(0,4))
	    	const inRange = dateRange.min <= year && year <= dateRange.max

		    return inRange && (all || selectedCategories.every((e) => mix.categories.includes(e)))
	    })
		this.setState({data: filteredMixes, categories:reduceCategories(filteredMixes)})
    }

	render(){
    	const loading = this.state.loading && <div>Data is loading</div>

    	const trackCounts = !this.state.loading && <TrackCounts mixes={this.state.data}/>
    	const mixCategories = !this.state.loading && <MixCategories mixes={this.state.data}/>

    	const rangeFilter = !this.state.loading && <RangeFilter
		    min={1993}
		    max={2019}
		    value={this.state.range}
		    onChange={this.handleRangeChange}
	    />

        const categoryFilter = !this.state.loading && <CategoryFilter
			categories={this.state.categories}
			minCount={5}
			selectedCategories={this.state.selectedCategories}
		    changeHandler={this.handleCategoryChange}
		    selectAllCategories={this.selectAllCategories}
		    selectNoCategories={this.selectNoCategories}
		/>

		return(
			<>
				<div className="row text-center">
					<h1 className="text-center">Essential Mix stats</h1>
					<p className="lead">
						Explore the statistics and history of the BBC Radio 1 Essential Mix.
					</p>
					{rangeFilter}
					{categoryFilter}
					{loading}
					<div className="col-xs-12">
							{trackCounts}
					</div>
					<div className="col-xs-12">
							{mixCategories}
					</div>
				</div>
			</>
		)
	}
}

export default App