import React, { Component} from "react"

import RangeFilter from "./RangeFilter"
import CategoryFilter from "./CategoryFilter"
import TrackCounts from "./TrackCounts"
import MixCategories from "./MixCategories"
import MostPlayedTracks from "./MostPlayedTracks"

import {categoryCounts} from "./lib"

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
            	const allCategories = json.reduce((acc, e) => {
            		e.categories.forEach((category) => {
            			if (!acc.includes(category)){
            				acc.push(category)
			            }
		            })
		            return acc
	            }, [])
            	this.setState({
		            loading: false,
		            data: json,
		            allData: json,
		            selectedCategory: 'All',
		            allCategories: allCategories
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
    	this.filterData(range, this.state.selectedCategory)
        this.setState({ range: range })
    }

    handleCategoryChange = (category) => {
    	this.filterData(this.state.range, category)
        this.setState({ selectedCategory: category })
    }

    filterData(dateRange, selectedCategory){
	    const filteredMixes = this.state.allData.filter((mix) => {
	    	const year = Number(mix.date.slice(0,4))
	    	const inRange = dateRange.min <= year && year <= dateRange.max
		    return inRange && (selectedCategory === "All" || mix.categories.includes(selectedCategory))
	    })
		this.setState({data: filteredMixes})
    }

	render(){
    	const loading = this.state.loading && <div>Data is loading</div>

    	const trackCounts = !this.state.loading && <TrackCounts mixes={this.state.data}/>
    	const mixCategories = !this.state.loading && <MixCategories mixes={this.state.data}/>
    	const mostPlayedTracks = !this.state.loading && <MostPlayedTracks mixes={this.state.data}/>

    	const rangeFilter = !this.state.loading && <RangeFilter
		    min={1993}
		    max={2019}
		    value={this.state.range}
		    onChange={this.handleRangeChange}
	    />

        const categoryFilter = !this.state.loading && <CategoryFilter
			categories={categoryCounts(this.state.data)}
			allCategories={this.state.allCategories}
			minCount={5}
			selectedCategory={this.state.selectedCategory}
		    changeHandler={this.handleCategoryChange}
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
					<div className="col-xs-8 col-xs-offset-2 track-statistics">
						{mostPlayedTracks}
					</div>
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