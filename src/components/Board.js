import React from "react";
import Square from "./Square";
import "./Board.css";

export default class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                idx={i}
                value={this.props.cur_board[i]}
                onClick={this.props.onClick}
                suggested_idx={this.props.suggested_idx === i}
            />
        );
    }
    render() {
        return (
            <>
                {[...new Array(5).keys()].map((row_num) => {
                    return (
                        <div className="board-row" key={row_num}>
                            {[...new Array(5).keys()].map((col_num) => {
                                return this.renderSquare(row_num * 5 + col_num);
                            })}
                            {/* {this.renderSquare(0)}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}
                            {this.renderSquare(3)}
                            {this.renderSquare(4)} */}
                        </div>
                    );
                })}
                {/* <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                </div>
                <div className="board-row">
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                </div>
                <div className="board-row">
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                    {this.renderSquare(14)}
                </div>
                <div className="board-row">
                    {this.renderSquare(15)}
                    {this.renderSquare(16)}
                    {this.renderSquare(17)}
                    {this.renderSquare(18)}
                    {this.renderSquare(19)}
                </div>
                <div className="board-row">
                    {this.renderSquare(20)}
                    {this.renderSquare(21)}
                    {this.renderSquare(22)}
                    {this.renderSquare(23)}
                    {this.renderSquare(24)}
                </div> */}
            </>
        );
    }
}
