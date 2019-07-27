import React, { Component} from "react"

export default class CategoryFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {
        	categories: props.categories,
	        minCount: props.minCount,
	        selectedCategories: props.selectedCategories
        }
    }

    handleShow = () => {
        const minCount = this.state.minCount === 5 ? 0 : 5
	    this.setState({minCount: minCount})
    }

    render() {
    	const {
    		categories,
		    changeHandler,
    		selectedCategories,
    	    selectAllCategories,
		    selectNoCategories
	    } = this.props
	    const categoryCount = Object.keys(this.state.categories).length

        return (
            <div className={"col-xs-8 col-xs-offset-2"} >
	            <h3>Categories</h3>
	            <div className={"center-block"}>
		            <div className={"btn-group"} role="group">
			            <button
				            className={"btn btn-default"}
				            onClick={selectAllCategories}
				            disabled={selectedCategories.length === categoryCount}
						>
				             Select All
			            </button>
	                    <button className={"btn btn-default"}
	                            onClick={selectNoCategories}
	                            disabled={selectedCategories.length === 0}>
				             Select None
	                    </button>
                    <button className={"btn btn-default"} onClick={this.handleShow} >
		                {this.state.minCount === 5 ? `Show all ${categoryCount} categories` : "Show only top categories" }
	                </button>
                    </div>

	            </div>

	            <div>
                    {categories.map((category) => this.renderCategory(category, selectedCategories, changeHandler))}
	            </div>
            </div>
        )
    }

    renderCategory (category, selectedCategories, changeHandler) {
    	if (category.count > this.state.minCount){
            return (
				<label className="checkbox-inline" key={category.name} >
					<input type="checkbox"
					       value="{category.name}"
					       checked={selectedCategories.includes(category.name)}
					       onChange={(e) => changeHandler(category)}
					/>
					{category.name} - {category.count}
                </label>
			)
	    }
	}
}