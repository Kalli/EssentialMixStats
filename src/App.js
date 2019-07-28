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
        this.setState({ range: range })
    }

    handleRangeChangeComplete = (range) => {
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
		    onChangeComplete={this.handleRangeChangeComplete}
	    />

        const categoryFilter = !this.state.loading && <CategoryFilter
			categories={categoryCounts(this.state.data)}
			allCategories={this.state.allCategories}
			minCount={5}
			selectedCategory={this.state.selectedCategory}
		    changeHandler={this.handleCategoryChange}
		/>

		return(
			<div className="wrapper">

				<nav id="sidebar">
					<div className="sidebar-header col-xs-12">
						<h3>Essential Mix Stats</h3>
						<ul className={"lead"}>
							<li>
								<a href="#intro">Intro</a>
							</li>
							<li>
								<a href="#most-played">Most Played Tracks</a>
							</li>
							<li>
								<a href="#track-counts">Track Counts</a>
							</li>
							<li>
								<a href="#mix-categories">Categories and Genres</a>
							</li>
						</ul>
						<h3>Controls</h3>
						<p className={"small"}>
							Filter based on categories or year ranges. The charts update automatically.
						</p>
						{rangeFilter}
						{categoryFilter}
					</div>
				</nav>


				<div id="content" className="row text-center">
					<div id="intro">
						<h1 className="text-center">Essential Mix statistics</h1>
						<p className="lead">
							Explore the statistics and history of the BBC Radio 1 Essential Mix.
						</p>
						<p>Some words</p>

						{loading}
					</div>
					<div id={"most-played"} className="col-xs-8 col-xs-offset-2 track-statistics">
						{mostPlayedTracks}
					</div>
					<div id={"track-counts"} className="col-xs-12">
						{trackCounts}
					</div>
					<div id={"mix-categories"} className="col-xs-12">
						{mixCategories}
					</div>
				</div>
			</div>
		)
	}
}

export default App