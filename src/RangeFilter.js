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
	        onChange,
	        onChangeComplete
        } = this.props

        return (
            <div className={"col-xs-12"} >
	            <h4>Years</h4>
                <InputRange
                    maxValue={max}
                    minValue={min}
                    value={value}
                    onChange={(value) => onChange(value)}
                    onChangeComplete={(value) => onChangeComplete(value)}
                 />
            </div>
        )
    }
}