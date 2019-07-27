import React, { Component} from "react"

export default class CategoryFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {
        	categories: props.categories,
	        minCount: props.minCount,
	        selectedCategory: props.selectedCategory,
	        topCategories: Object.entries(props.categories).filter((e) => e[1] > 5).map((e) => e[0]),
	        showAll: false,
	        allCategories: props.allCategories.sort((a, b) => props.categories[b] - props.categories[a])
        }
    }

    handleShow = () => {
	    this.setState({showAll: !this.state.showAll})
    }

    render() {
    	const {
    		categories,
		    allCategories,
		    changeHandler,
    		selectedCategory,
	    } = this.props
        return (
            <div className={"col-xs-8 col-xs-offset-2"} >
	            <h3>Categories</h3>
	            <div className={"center-block"}>
                    <button className={"btn btn-default"} onClick={this.handleShow} >
		                {this.state.showAll ? "Show only top categories" : `Show all ${allCategories.length} categories` }
	                </button>
	            </div>
	            <div>
		            {this.renderCategory("All", categories, selectedCategory, changeHandler) }
                    {this.state.allCategories.map((category) => this.renderCategory(category, categories, selectedCategory, changeHandler))}
	            </div>
            </div>
        )
    }

    renderCategory (category, categories, selectedCategory, changeHandler) {
    	const count = categories[category] ? categories[category] : 0
    	if (category === "All" || this.state.showAll || this.state.topCategories.includes(category)){
            return (
            	<div className={"col-md-4"}>
                    <label className="radio" key={category} >
						<input type="radio"
						       value="{category}"
						       checked={selectedCategory === category}
						       onChange={(e) => changeHandler(category)}
						/>
						{category} {category !== "All" ? ` - ${count}` : ""}
                    </label>
	            </div>
			)
	    }
	}
}