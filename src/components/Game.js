import React from "react";
import * as tf from "@tensorflow/tfjs";
import Board from "./Board.js";
import "./Game.css";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cur_board: new Array(25).fill(0),
            history: [new Array(25).fill(0)],
            round: -2,
            suggested_idx: -1,
            suggested_list: [-1],
        };
    }

    async onClickHandler(idx) {
        if (this.state.round < 0) {
            if (this.state.cur_board[idx] !== 0) return;

            const cur_board = this.state.cur_board.slice();
            cur_board[idx] = 1;

            const history = this.state.history.concat([cur_board.slice()]);

            const round = this.state.round + 1;

            let suggested_idx = this.state.suggested_idx;

            let suggested_list = this.state.suggested_list.slice();

            if (round === 0) {
                const input = [...cur_board, round];
                suggested_idx = await this.suggest(input);
                // console.table(input);
                // console.log(
                //     parseInt(suggested_idx / 5) + 1,
                //     (suggested_idx % 5) + 1
                // );
            }

            suggested_list = suggested_list.concat(suggested_idx);
            this.setState({
                cur_board,
                history,
                round,
                suggested_idx,
                suggested_list,
            });
        } else {
            let cur_board = this.state.cur_board.slice();

            const round = this.state.round + 1;

            let suggested_list = this.state.suggested_list.slice();
            const table_cur_board = [];
            while (cur_board.length)
                table_cur_board.push(cur_board.splice(0, 5));

            cur_board = table_cur_board;

            const row = parseInt(idx / 5);
            const col = idx % 5;
            let bingo_count = 0;

            const dr = [0, -1, 0, 1, 0];
            const dc = [0, 0, 1, 0, -1];

            const before_num = [-1, -1, -1, -1, -1];

            for (let i = 0; i < 5; i++) {
                const nr = row + dr[i];
                const nc = col + dc[i];

                if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) continue;

                if (cur_board[nr][nc] === 2) {
                    before_num[i] = 2;
                    continue;
                } else if (cur_board[nr][nc] === 1) {
                    before_num[i] = 1;
                    cur_board[nr][nc] = 0;
                    continue;
                } else if (cur_board[nr][nc] === 0) {
                    before_num[i] = 0;
                    cur_board[nr][nc] = 1;
                    continue;
                }
            }

            for (let i = 0; i < 5; i++) {
                const nr = row + dr[i];
                const nc = col + dc[i];
                if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) continue;

                if (cur_board[nr][nc] !== 0) {
                    let isBingo = this._check_bingo(cur_board, nr, nc);
                    bingo_count += isBingo.length;

                    for (let dir of isBingo) {
                        if (dir === "ROW") {
                            for (let i = 0; i < 5; i++) {
                                cur_board[nr][i] = 2;
                            }
                        } else if (dir === "COL") {
                            for (let i = 0; i < 5; i++) {
                                cur_board[i][nc] = 2;
                            }
                        } else if (dir === "LC") {
                            cur_board[0][0] = 2;
                            cur_board[1][1] = 2;
                            cur_board[2][2] = 2;
                            cur_board[3][3] = 2;
                            cur_board[4][4] = 2;
                        } else if (dir === "RC") {
                            cur_board[0][4] = 2;
                            cur_board[1][3] = 2;
                            cur_board[2][2] = 2;
                            cur_board[3][1] = 2;
                            cur_board[4][0] = 2;
                        }
                    }
                }
            }

            cur_board = cur_board.flat();
            const history = this.state.history.concat([cur_board.slice()]);
            const input = [...cur_board, round];
            const suggested_idx = await this.suggest(input);
            // console.table(input);
            // console.log(
            //     parseInt(suggested_idx / 5) + 1,
            //     (suggested_idx % 5) + 1
            // );
            suggested_list = suggested_list.concat(suggested_idx);
            this.setState({
                history,
                cur_board,
                round,
                suggested_idx,
                suggested_list,
            });
        }
    }
    _check_bingo(board, row, col) {
        const result_list = [];

        let result = 1;
        for (let i = 0; i < 5; i++) {
            result = result * board[row][i];
            if (result === 0) break;
        }
        if (result > 0) result_list.push("ROW");

        result = 1;
        for (let i = 0; i < 5; i++) {
            result = result * board[i][col];
            if (result === 0) break;
        }
        if (result > 0) result_list.push("COL");

        if (row === col) {
            result = 1;
            result =
                result *
                board[0][0] *
                board[1][1] *
                board[2][2] *
                board[3][3] *
                board[4][4];

            if (result > 0) result_list.push("LC");
        }
        if (row + col === 4) {
            result = 1;
            result =
                result *
                board[0][4] *
                board[1][3] *
                board[2][2] *
                board[3][1] *
                board[4][0];
            if (result > 0) result_list.push("RC");
        }
        return result_list;
    }

    async suggest(input) {
        const model = await tf.loadLayersModel("./model.json");
        const result = model.predict(tf.tensor3d([[[...input]]])).reshape([25]);
        const suggested_idx = await tf.argMax(result).array();
        return suggested_idx;
    }
    init() {
        const cur_board = new Array(25).fill(0);
        const history = [new Array(25).fill(0)];
        const round = -2;
        const suggested_idx = -1;
        const suggested_list = [-1];

        this.setState({
            cur_board,
            history,
            round,
            suggested_idx,
            suggested_list,
        });
    }
    back() {
        const history = this.state.history.slice(
            0,
            this.state.history.length - 1
        );
        const cur_board = history[history.length - 1];
        const round = this.state.round - 1;
        const suggested_list = this.state.suggested_list.slice(
            0,
            this.state.suggested_list.length - 1
        );
        const suggested_idx = suggested_list[suggested_list.length - 1];

        this.setState({
            cur_board,
            history,
            round,
            suggested_idx,
            suggested_list,
        });
    }

    render() {
        return (
            <div className="game">
                <div>ROUND : {this.state.round}</div>
                <div className="game-baord">
                    <Board
                        cur_board={this.state.cur_board}
                        onClick={(idx) => this.onClickHandler(idx)}
                        round={this.state.round}
                        suggested_idx={this.state.suggested_idx}
                    />
                </div>
                <button onClick={() => this.init()}>RESET</button>
                {this.state.round !== -2 && (
                    <button onClick={() => this.back()}>BACK</button>
                )}
            </div>
        );
    }
}
