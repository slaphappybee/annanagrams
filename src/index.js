import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <h1>Annanagrams!</h1>
            </div>
        )
    }
}

class Tile extends React.Component {
    render() {
        let className = this.props.className + " tile";
        return (
            <div style={this.props.style} className={className}
            onClick={this.props.onClick}>{this.props.char}</div>
        )
    }
}

class WordZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTile: {
                row: 7,
                column: 7
            }
        }
    }

    selectTile(row, column, direction) {
        console.log(`selectTile(${row}, ${column})`);

        this.setState({
            selectedTile: {
                row: row,
                column: column
            },
            selectionDirection: direction
        });
    }

    shiftTile(direction, tile) {
        let newTile = Object.assign({}, tile);
        newTile.row += (direction === 0) ? -1 : (direction === 2) ? 1 : 0
        newTile.column += (direction === 1) ? 1 : (direction === 3) ? -1 : 0
        return newTile
    }

    keyDown(key) {
        this.props.tiles.push({row: this.state.selectedTile.row,
            column: this.state.selectedTile.column, char: key, ui: false});

        this.setState({
            selectedTile: this.shiftTile(this.state.selectionDirection, this.state.selectedTile),
            selectionDirection: this.state.selectionDirection
        });
    }

    renderTile(tile) {
        let style = {
            gridRow: tile.row,
            gridColumn: tile.column
        }

        let className = tile.ui ? 'tile-ui' : 'tile-word';
        let key = `${tile.row}-${tile.column}-${tile.char}`
        let uiDirection = tile.ui ? tile.direction : 1;

        return (<Tile char={tile.char} style={style} className={className} 
            key={key} onClick={() => this.selectTile(tile.row, tile.column, uiDirection)} />)
    }

    render() {
        let st = this.state.selectedTile
        let uiTiles = st ? [
            {row: st.row - 1, column: st.column,     char:'^', ui: true, direction: 0 },
            {row: st.row,     column: st.column + 1, char:'>', ui: true, direction: 1 },
            {row: st.row + 1, column: st.column,     char:'v', ui: true, direction: 2 },
            {row: st.row,     column: st.column - 1, char:'<', ui: true, direction: 3 }
        ] : []

        let allTiles = uiTiles.concat(this.props.tiles);

        return (
            <div className="word-zone">
                {allTiles.map(this.renderTile.bind(this))}
            </div>
        )
    }
}

class KeyboardKey extends React.Component {
    handleClick(label) {
        this.props.virtualKeyDown(label);
    }

    render() {
        return (
            <div className="keyboard-key" onClick={() => this.handleClick(this.props.label)}>{this.props.label}</div>
        )
    }
}

class Keyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keys: {
                row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
            }
        };
    }

    onKeyDown(key) {
        console.log(`key down: ${key}`);
        this.props.virtualKeyDown(key);
    }

    render() {
        return (
            <div className="keyboard">
                <div className="keyboard-row keyboard-row-r1">{this.state.keys.row1.map((key, i) => 
                <KeyboardKey key={key} label={key} virtualKeyDown={(key) => this.onKeyDown(key)}></KeyboardKey>)}</div>
                <div className="keyboard-row keyboard-row-r2">{this.state.keys.row2.map((key, i) => 
                <KeyboardKey key={key} label={key} virtualKeyDown={(key) => this.onKeyDown(key)}></KeyboardKey>)}</div>
                <div className="keyboard-row keyboard-row-r3">{this.state.keys.row3.map((key, i) => 
                <KeyboardKey key={key} label={key} virtualKeyDown={(key) => this.onKeyDown(key)}></KeyboardKey>)}</div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.tiles = [
            {row: 2, column: 2, char:'o', ui: false },
            {row: 2, column: 3, char:'l', ui: false },
            {row: 2, column: 4, char:'d', ui: false },
            {row: 3, column: 3, char:'a', ui: false },
            {row: 4, column: 3, char:'m', ui: false },
            {row: 5, column: 3, char:'e', ui: false },
            {row: 7, column: 7, char:'?', ui: false },
        ]
    }

    render() {
      return (
        <div>
            <Header />
            <WordZone ref={(c) => this._wordzone = c} tiles={this.tiles} />
            <Keyboard virtualKeyDown={(k) => this._wordzone.keyDown(k)}/>
        </div>
      );
    }
  }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
