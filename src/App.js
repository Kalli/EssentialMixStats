import React, { Component} from "react"

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

		return(
			<>
				<div className="row text-center main">
					<h1 className="text-center">Essential Mix stats</h1>
					<p className="lead">
						Explore the statistics and history of the BBC Essential Mix.
					</p>
					{loading}
				</div>
			</>
		)
	}
}

export default App