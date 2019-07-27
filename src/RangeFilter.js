import "react-input-range/lib/css/index.css"
import InputRange from 'react-input-range'
import React, { Component} from "react"

export default class RangeFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {value: props.value}
    }

    handleChange(value){
        this.setState({ value })
    }

    render() {
        const {
            min,
            max,
        } = this.props
        return (
            <form className={"col-xs-6 col-xs-offset-3"} action="">
                <InputRange
                    maxValue={max}
                    minValue={min}
                    value={this.state.value}
                    onChange={(value) => this.handleChange(value)}
                 />
            </form>
        )
    }
}