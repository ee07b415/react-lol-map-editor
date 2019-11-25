import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Block is a set of Squares stands for one area name(top lane, top river...) of certain squares
class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      squares: []
    };
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.props.onClick()}
          style={{ color: this.props.color }}
        >
          {this.props.value}
        </button>
        <div>({this.props.squares.join(", ")})</div>
      </div>
    );
  }
}

// The minimum unit of the map element
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      color: 'white'
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
        style={{ color: this.props.color }}
      >
        {this.props.value}
      </button>
    );
  }
}

// Hardcoded hased 8*8 board
const hashedBoard = [[42,43,46,47,58,59,62,63],
[40,41,44,45,56,57,60,61],
[34,35,38,39,50,51,54,55],
[32,33,36,37,48,49,52,53],
[10,11,14,15,26,27,30,31],
[8,9,12,13,24,25,28,29],
[2,3,6,7,18,19,22,23],
[0,1,4,5,16,17,20,21]]

// Actually should be renamed to Map, this class just resuse the one from React example
class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //display purpose only
      squares: [[42,43,46,47,58,59,62,63],
                [40,41,44,45,56,57,60,61],
                [34,35,38,39,50,51,54,55],
                [32,33,36,37,48,49,52,53],
                [10,11,14,15,26,27,30,31],
                [8,9,12,13,24,25,28,29],
                [2,3,6,7,18,19,22,23],
                [0,1,4,5,16,17,20,21]],
      blockMapper: {
        red: [],
        blue: []
      },
      selected: null,
      assigned: Array(64).fill(null),
    };
  }

  // handle click on square
  handleClick(i) {
    const squares = this.state.squares.slice();
    const newAssignment = this.state.assigned.slice();
    let row = Math.floor(i / 8);
    let column = i % 8;

    const newBlock = this.state.blockMapper;

    if(squares[row][column] === 'X'){
      // check current square assigned to which block
      let assignedTo = newAssignment[hashedBoard[row][column]]
      let index = newBlock[assignedTo].indexOf(hashedBoard[row][column])

      //remove from the current block
      newBlock[assignedTo].splice(index, 1)

      if(assignedTo !== this.state.selected){
        //if not same group, assign to the other group
        newAssignment[hashedBoard[row][column]] = this.state.selected
        newBlock[this.state.selected].push(hashedBoard[row][column])
      } else {
        // if same group as select, just set the value back
        squares[row][column] = hashedBoard[row][column]
      }
    }else{
      squares[row][column] = 'X'
      newAssignment[hashedBoard[row][column]] = this.state.selected
      newBlock[this.state.selected].push(hashedBoard[row][column])
    }

    this.setState({
      squares: squares,
      blockMapper: newBlock,
      assigned: newAssignment
    });
  }

  // Handle the selection when click the block button
  handleBlockSelection(i) {
    const select = i;
    this.setState({selected:select});
  }

  // Return the color from the square, i is the hashed value on square
  getColor(i){
    if (this.state.blockMapper.red.indexOf(i) > -1) { 
      return 'red';
    }
    if (this.state.blockMapper.blue.indexOf(i) > -1) { 
      return 'blue';
    }
    return 'white';
  }

  // Build a row of sqaure, right now is hardcoded to 8*8 board
  renderRow(i) {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7];
    const row = numbers.map( (number) =>
        <Square
        value = {this.state.squares[i][number]}
        onClick={() => this.handleClick(i * 8 + number)}
        color={this.getColor(hashedBoard[i][number])}
        key={hashedBoard[i][number]}
        />
      )
    return (
      <div className="board-row" key={"row-" + i}>
      {row}
      </div>
    );
  }

  // Should be render map, build table of rows(return the final map)
  renderTable() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7];
    const table = numbers.map((number) => 
        this.renderRow(number)
      )
    return (table);
  }

  //control the color on the block button, turn red when selected, turn black when unselected
  renderSelectedBlock(selected, self) {
    if(selected === self){
      return 'red';
    } else {
      return 'black';
    }
  }

  //Should rename to build Json, build the Json string from a given obj
  outputJson(obj){
    return JSON.stringify(obj, null, 2);
  }

  //download a json file contains the block to squres mapping
  downLoadData(){
    const data = this.outputJson(this.state);

    const element = document.createElement("a");
    const file = new Blob([data], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "block.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  // Build the Map
  render() {
    const red = "red";
    const blue = "blue";

    return (
      <div>
        <div className="background">{this.renderTable()}</div>
        <div>
          <Block 
            value = {red}
            squares = {this.state.blockMapper.red}
            onClick={() => this.handleBlockSelection("red")}
            color={this.renderSelectedBlock(this.state.selected, "red")}
            key={"red-team"}
          />
        </div>
        <div>
          <Block 
            value = {blue}
            squares = {this.state.blockMapper.blue}
            onClick={() => this.handleBlockSelection("blue")}
            color={this.renderSelectedBlock(this.state.selected, "blue")}
            key={"blue-team"}
          />
        </div>
        <div>
          <button
            onClick={() => this.downLoadData()}
          >
            Download
          </button>
        </div>
        {this.outputJson(this.state.blockMapper)}
      </div>
    );
  }
}

// Build the webpage
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
