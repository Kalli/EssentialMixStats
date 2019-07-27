import React, { Component} from "react"

import RangeFilter from "./RangeFilter"
import TrackCounts from "./TrackCounts"
import MixCategories from "./MixCategories"

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    loadData() {
        fetch(`/data/data.json`)
            .then( (response) => {
                return response.json()
            })
            .then( (json) => {
            	this.setState({loading: false, data: json})
            });
    }

    componentDidMount() {
        this.setState({
	        loading: true,
            data: this.loadData()
        })
    }
	render(){
    	const loading = this.state.loading && <div>Data is loading</div>
    	const trackCounts = !this.state.loading && <TrackCounts mixes={this.state.data}/>
    	const mixCategories = !this.state.loading && <MixCategories mixes={this.state.data}/>

    	const value = {"min": 1993, "max": 2019}
    	const rangeFilter = !this.state.loading && <RangeFilter
		    min={1993}
		    max={2019}
		    value={value}
	    />

		return(
			<>
				<div className="row text-center">
					<h1 className="text-center">Essential Mix stats</h1>
					<p className="lead">
						Explore the statistics and history of the BBC Radio 1 Essential Mix.
					</p>
					{rangeFilter}
					{loading}
					<div  className="center-block col-xs-12">
							{trackCounts}
					</div>
					<div  className="center-block col-xs-12">
							{mixCategories}
					</div>
				</div>
			</>
		)
	}
}

export default App