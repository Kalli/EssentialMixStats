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
								<a href="#track-counts">How Many Tunes?</a>
							</li>
							<li>
								<a href="#most-played">Most Played Tracks</a>
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
					<div id="intro" className="col-xs-12">
						<h1 className="text-center">Essential Mix statistics</h1>
						<p className="lead">
							Explore the statistics and history of the BBC Radio 1 Essential Mix.
						</p>
						<div className={"introduction col-xs-8 col-xs-offset-2"}>
							<p>
								The BBC Radio 1 <a href="https://www.bbc.co.uk/programmes/b006wkfp" target="blank">
								Essential Mix</a> is an institution within dance music. Running since 1993 it has
								hosted the biggest names in the industry in its weekly two hour mix sessions and plays a
								pivotal role within the scene.
							</p>
							<p>
								Using the crowdsourced tracklist website <a href="https://www.mixesdb.com/">Mixesdb </a>
								I've gathered information about the performers, artists, tracklists and genres from more than
								1400 editions of the Essential Mix. Look below for some insight into the history, evolution
								and trends of the last 23 years in dance music.
							</p>
							<p>
								There are some of caveats. All of this information is parsed from incomplete user entered
								tracklists and not from detailed, structured or verified data. Some of it is purely subjective
								(category and genre tags) while other facets are pretty objective (dates, track counts).
								There is a lot of data, more than has been possible to humanly verify in detail. Minor
								variations in spelling or casing, typos, might play a role in the results.
								If you are interested in the code behind both getting the data and visualising it or the
								raw data itself you can find it on  <a href="https://github.com/Kalli/EssentialMixStats">Github</a>. If you
								have any questions you can hit me up on <a href="http://twitter.com/karltryggvason">
								@karltryggvason</a> on Twitter or shoot me an email at <a href="mailto:ktryggvason@gmail.com">
								ktryggvason@gmail.com</a>.
							</p>
						</div>
						{loading}
					</div>
					<div id={"track-counts"} className="col-xs-12">
						<h2>How Many Tunes?</h2>
						<div className={"introduction col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								Lets start of with what is quite possibly the driest graph but what was the
								impetus for me to compile all this information in the first place. My basic question was:
								<i> has digital dj'ing resulted in djs playing more tracks in their mixes</i>? The
								Essential Mix tracklists seemed like a good data set to research this. A standard two
								hour format with decades of history to dig into.
							</p>
							<p>
								Technology has changed dj'ing a lot in the last 20 years. Up until the early 2000s the
								tools of the trade were fairly stable: two or more Technics SL 1200 turntables plus a
								mixer of your choice. But since then technology has disrupted the industry massively,
								from cdjs to timecode vinyl systems to midi controllers and beyond there are now dozens
								of ways to mix recorded music together.
							</p>
							<p>
								People can, and will, argue endlessly about the pros and cons of each approach. But I
								think it is undeniable that technology has made it easier and faster to beatmatch than
								ever before. This means that djs are free to do other things: effects, loops, multi deck
								blends, tune selection and pose for the crowd (argue the more cynical among us). But
								should a dj let tracks breathe and speak for themselves or should they try to creatively
								put as many of them in a set as they can? There are many styles and schools of thought.
							</p>
						</div>
					</div>
					<div className={"introduction col-xs-12"}>
						{trackCounts}
					</div>
					<div className="col-xs-12">
						<div className={" col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								Loking at the graph I feel supported in my hunch that technology has resulted in djs
								mixing from one song to the next one faster. This type of chart is called a candlestick chart,
								the "wicks" on either end represent the outliers, the mixes with most and fewest tunes
								that year. The box in between represents the center of the range, this is where 50% of
								all the mixes fall (so excluding the bottom and top 25% respectively) of all
								values. This shows a bit more detail than a simple average or median chart.
							</p>
							<p>
								You can see that right around 2005 the average number of tracks played in an Essential
								Mix starts inching upwards. In the 90s the majority of mixes had between 20 and 30 tracks,
								around 4-6 minutes per track on average. But around 15 years ago that started inching
								up to between 30 to 40 tracks per mix or 3-4 minutes per track.
							</p>
							<p>
								The outliers also become more and more pronounced. Mixes with more than 50 songs are now
								pretty standard and they regularly hit 60 to 70. <a href="https://www.mixesdb.com/w/2011-07-23_-_Brookes_Brothers_-_Essential_Mix">
								The Brookes Brothers </a> set the record so far in 2011, with 115 tracks, just under a minute to each track.
								I get tired just thinking about it...
							</p>
							<p>
								But if that covers how many tunes you can find in Essential Mixes, naturally the next
								question is: Which tunes?
							</p>
						</div>
					</div>
					<div id={"most-played"} className="col-xs-8 col-xs-offset-2 track-statistics">
						<h2>Most Played Tracks, Artists and Genres </h2>
						<div className={"text-left"}>
							<p>
								In the tables below you can see the most played tracks, artists and labels in the
								history of the Essential Mix. You'll find the top 250 most played from each of these
								categories. Click each row for more information about who played the entry in question
								and when.
							</p>
							<p>
								For tracks. Donna Summer's disco classic <i>I Feel Love</i> and the Underworld stable
								<i>Born Slippy</i> come in at the top with 15 plays each. And after that its one classic
								after the other. Older tracks naturally appear more frequently than newer tracks
								(having had more years to have been played) out. Interesting to see Donna Summer top
								the list as she is one of only a very few women on there, dance music is sadly a very
								male dominated scene.
							</p>
							<p>
								Underworld tops the artist top list as well, but as Daft Punk come in a close second.
								The list is understandably a bit UK centric. On the label side the almighty
								<i>White Label</i> comes out on top.
							</p>
						</div>
						{mostPlayedTracks}
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