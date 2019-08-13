export function createMixLink(mix){
	return `<a href="https://www.mixesdb.com${mix.url}" target="_blank">${mix.date} - ${mix.artists.join(', ')}</a>`
}

export function completeTracklist(mix){
	return mix['categories'] && mix['categories'].indexOf('Tracklist: complete') !== -1
}

export function categoryCounts(mixes, filters) {
	return mixes.reduce((acc, mix) => {
		if (!mix.duplicate){
			mix.categories.forEach((category) => {
				let include = true
				if (filters){
					include = filters.filter((e) => category.indexOf(e) === -1).length > 0
				}
				if (include) {
					acc[category] = acc[category] ? acc[category] + 1 : 1
				}
			})
		}
		return acc
	}, {})
}

export function closeTooltipsOnClicks(chartWrapper, google){
	// Close tooltips / set chart selection to null when click events aren't data points or graph objects
	const chart = chartWrapper.getChart()
	const validTargets = ["point", "bar"]
	google.visualization.events.addListener(chart, "click", e => {
		if (validTargets.every((target) => { return e.targetID.indexOf(target) === -1})){
			chart.setSelection(null)
		}
	})
}

export function reduceCategories(mixes, filters) {
	const mixesByCategory = categoryCounts(mixes, filters)
	return Object.entries(mixesByCategory).reduce((acc, c) => {
        acc.push({'name': c[0], 'count': c[1]})
	    return acc
    }, []).sort((a, b) => b.count - a.count)
}

export const colors = ["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"]