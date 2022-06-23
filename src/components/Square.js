import React from "react";
import "./Square.css";

export default class Square extends React.Component {
    constructor(props) {
        super(props);
    }
    //0이면 흰색 1이면 파란색 2 이면 빨간색
    render() {
        const RED = { backgroundColor: "red" };
        const BLUE = { backgroundColor: "blue" };
        const WHITE = { backgroundColor: "white" };
        const YELLOW = { backgroundColor: "yellow" };
        return (
            <button
                className="square"
                onClick={() => this.props.onClick(this.props.idx)}
                style={
                    this.props.suggested_idx
                        ? YELLOW
                        : this.props.value === 0
                        ? WHITE
                        : this.props.value === 1
                        ? BLUE
                        : RED
                }
            >
                {/*String(this.props.value)*/}
            </button>
        );
    }
}
