import "react-input-range/lib/css/index.css"
import InputRange from 'react-input-range'
import React, { Component} from "react"

export default class RangeFilter extends Component {

    constructor(props) {
        super(props)
        this.state = {value: props.value}
    }

    render() {
        const {
            min,
            max,
            value,
	        onChange
        } = this.props

        return (
            <form className={"col-xs-6 col-xs-offset-3"} action="">
                <InputRange
                    maxValue={max}
                    minValue={min}
                    value={value}
                    onChange={(value) => onChange(value)}
                 />
            </form>
        )
    }
}