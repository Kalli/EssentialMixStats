import React, { Component} from "react"

export default class CategoryFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {
        	categories: props.categories,
	        minCount: props.minCount,
	        selectedCategory: props.selectedCategory,
	        topCategories: Object.entries(props.categories).filter((e) => e[1] > 5).map((e) => e[0]),
	        allCategories: props.allCategories.sort((a, b) => props.categories[b] - props.categories[a]),
            show: "None",
        }
    }

    handleShow = () => {
        switch (this.state.show){
	        case "None":
	        	this.setState({show: "Top"})
		        break
	        case "Top":
	        	this.setState({show: "All"})
		        break
	        default:
		        this.setState({show: "None"})
        }
    }

    showButton(allCategories){
    	let text = ""
    	switch (this.state.show){
		    case "None":
		    	text = "Show top categories"
			    break
            case "Top":
				text = `Show all ${allCategories.length} categories`
			    break
		    default:
		    	text = "Hide categories"
	    }
		return (
		    <div className={"center-block category-button"}>
                <button className={"btn btn-default"} onClick={this.handleShow} >
	                {text}
                </button>
            </div>
		)
    }

    render() {
    	const {
    		categories,
		    allCategories,
		    changeHandler,
    		selectedCategory,
	    } = this.props

        return (
            <div className={"col-xs-12 category-filter"} >
	            <h4>Categories</h4>
	            {this.showButton(allCategories)}
	            {this.showCategories(allCategories, categories, selectedCategory, changeHandler)}
            </div>
        )
    }

    showCategories(allCategories, categories, selectedCategory, changeHandler){
    	if (this.state.show === "None"){
    		return ""
	    } else {
    		return (
                <div className={"categories"}>
		            {this.renderCategory("All", categories, selectedCategory, changeHandler) }
                    {this.state.allCategories.map((category) => this.renderCategory(category, categories, selectedCategory, changeHandler))}
                </div>
		    )
	    }
    }

    renderCategory (category, categories, selectedCategory, changeHandler) {
    	const count = categories[category] ? categories[category] : 0
	    const show = this.state.show === "All" || (this.state.show === "Top" && this.state.topCategories.includes(category))
    	if (category === "All" || show ){
            return (
            	<div className={"col-xs-12"} key={category}>
                    <label className="radio small" >
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