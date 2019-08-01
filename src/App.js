import React, { Component} from "react"

import RangeFilter from "./RangeFilter"
import CategoryFilter from "./CategoryFilter"
import TrackCounts from "./TrackCounts"
import DJCounts from "./DJCounts"
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
    	const djCounts = !this.state.loading && <DJCounts mixes={this.state.data}/>
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
								<a href="#dj-counts">Which DJs?</a>
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
								and trends of the last 23 years in dance music. Note that on most of the charts you can
								click the graphs to learn more about them and in the left hand side there are filters
								for categories and date ranges.
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
					<div className={"col-xs-12"}>
						{trackCounts}
					</div>
					<div className="col-xs-12">
						<div className={"col-xs-8 col-xs-offset-2 text-left"}>
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
					<div id={"most-played"} className="col-xs-12 track-statistics">
						<h2>Most Played Tracks, Artists and Genres </h2>
						<div className={"text-left col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								In the tables below you can see the most played tracks, artists and labels in the
								history of the Essential Mix. You'll find the top 250 most played from each of these
								categories. Click each row for more information about who played the entry in question
								and when.
							</p>
							<p>
								For tracks. Donna Summer's disco classic <i>I Feel Love</i> and the Underworld stable
								<i> Born Slippy</i> come in at the top with 15 plays each and after that its one classic
								after the other. Older tracks naturally appear more frequently than newer tracks
								(having had more years to have been played). Interesting to see Donna Summer top
								the list as she is one of only a very few women on there, dance music is sadly a very
								male dominated scene.
							</p>
						</div>
						{mostPlayedTracks}
						<div className={"text-left col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								Underworld tops the artist top list as well, but Daft Punk come in a close second.
								The list is understandably a bit UK centric. On the label side the almighty
								<i> White Label</i> comes out on top, <i>Unreleased</i> and <i>Acetate</i> get a fair
								few mentions as well. Otherwise the top places are taken up by some of the bigger
								more established labels in the scene, with <i>FFRR</i> taking first place by quite a
								margin.
							</p>
							<p>
								That gives us a bit of insight into what has been played on the Essential Mix and leads
								us naturally into the question: <i>who's played there</i>?
							</p>
						</div>
					</div>
					<div id={"dj-counts"} className="col-xs-12">
						<h2>Which DJs?</h2>
						<div className={"text-left col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								I fetched data for 1344 mixes (discounting some duplicates) on which 889 artists have
								played. Of those 658 have played the Essential Mix once, while around 130 have featured
								twice (many of those are the winners of the Essential Mix of the year, which gets
								replayed as the last episode every year).
							</p>
						</div>
						{djCounts}
						<div className={"text-left col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								In this chart you can see which djs have had multiple occurrences and how they are
								divided (click on each column to see which djs it includes). Obviously Pete Tong, the
								host of the show is a bit of an outlier, in the
								MixesDB data he gets credited as an artist around 80 times. Also, again, older artists
								or those with a longer career are likely to have made more appearances. So you have a lot
								of the older acid-house era british djs racking up the most appearances.
							</p>
						</div>
					</div>
					<div id={"mix-categories"} className="col-xs-12">
						<h2>Categories and Genres</h2>
						<div className={"col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								The last bit of data to look into is the categories. I've filtered out the ones related to
								the tracklists or the artists and that leaves us with genre information. Now this always
								going to be subjective. Where is the line between techno, tech house and house? Ask ten
								nerds and you'll get ten answers. But regardless, its interesting to see how genres are
								born, evolve and (in some cases) die.
							</p>
							<p>
								In the first chart, you can see that house reigns supreme in the Essential Mix. There are
								444 mixes categorized as house, almost two times more than the runner up, tech house.
								After that is the other big 4x4 genres, but then there's quite a drop off before the more
								breakbeat oriented genres show up.
							</p>
						</div>
						{mixCategories}
						<div className={"col-xs-8 col-xs-offset-2 text-left"}>
							<p>
								In the second chart you can select categories to see how they are spread out through
								the years. I found clicking around here to be quite the history lesson. Its interesting
								to see how genres like minimal and dubstep spike and die down and how you can see trends
								with the rise and fall of trance in the late 90s / early 00s and the resurgence of electro
								in the last couple of years, to mention a few examples.
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default App