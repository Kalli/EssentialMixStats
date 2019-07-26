import {GoogleCharts} from "google-charts"

export function drawCategories(mixes){
	let dataTable = new GoogleCharts.api.visualization.DataTable({
		cols: [
			{id: 'category', label: 'Category', type: 'string'},
			{id: 'count', label: 'Count', type: 'number'},
			{type: 'string', role: 'tooltip', 'p': {'html': true}}
		],
	})

	const mixesByCategories = mixes.reduce((acc, mix) => {
		if (!mix.duplicate){
			mix.categories.forEach((category) => {
				if (category.indexOf('Tracklist') === -1){
					acc[category] = acc[category] ? acc[category] + 1 : 1
				}
			})
		}
		return acc
	}, {})

	dataTable.addRows(Object.keys(mixesByCategories).reduce((acc, category) => {
		if (mixesByCategories[category] >= 10) {
			const link = "https://www.mixesdb.com/w/Special:Search?fulltext=Search&cat=Essential+Mix&search="+category
			const toolTip = `<a href="${link}" target="_blank">${category}</a> - ${mixesByCategories[category]}`
			acc.push([category, mixesByCategories[category], toolTip])
		}
		return acc
	}, []))

	dataTable.sort({column: 1, desc: true});

	let options = {
		chart: {
			title: 'Essential Mixes - Categories',
		},
		tooltip: {isHtml: true, trigger: 'selection'},
		width: '100%',
		height: '100%',
		legend: 'none',
		theme: 'material',
	}

	let chart = new GoogleCharts.api.visualization.ColumnChart(document.getElementById('categories'));
	chart.draw(dataTable, options);
}