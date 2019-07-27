export function createMixLink(mix){
	return `<a href="https://www.mixesdb.com${mix.url}" target="_blank">${mix.date} - ${mix.artists.join(', ')}</a>`
}

export function completeTracklist(mix){
	return mix['categories'] && mix['categories'].indexOf('Tracklist: complete') !== -1
}

export function reduceCategories(mixes, filters) {
	const mixesByCategory = mixes.reduce((acc, mix) => {
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
	return Object.entries(mixesByCategory).reduce((acc, c) => {
        acc.push({'name': c[0], 'count': c[1]})
	    return acc
    }, []).sort((a, b) => b.count - a.count)
}