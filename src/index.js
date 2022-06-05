import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function strShuffle(subject) {
    var a = subject.split(''), n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }

    return a.join('')
}

function cloneUpdate(object, cb) {
    var newObject = Object.assign({}, object);
    cb(newObject);
    return newObject;
}

class Header extends React.Component {
    render() {
        let peelDisabled = !this.props.canPeel;
        let dumpDisabled = !this.props.canDump;
        let dumpClassNames = "button" + (this.props.isDumpMode ? " button-dump" : "")

        return (
            <div className="header">
                <h1>Annanagrams!</h1>
                <div className="button-bar">
                    <button className="button" onClick={() => this.props.onPeel()} disabled={peelDisabled}>🍌</button>
                    <button className={dumpClassNames} onClick={() => this.props.onDump()} disabled={dumpDisabled}>🗑</button>
                </div>
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
                row: 6,
                column: 6
            },
            selectionDirection: 1
        }
    }

    selectTile(row, column, direction) {
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

    placeTile(key) {
        this.props.tiles.push({row: this.state.selectedTile.row,
            column: this.state.selectedTile.column, char: key, ui: false});

        this.setState({
            selectedTile: this.shiftTile(this.state.selectionDirection, this.state.selectedTile),
            selectionDirection: this.state.selectionDirection
        });

        return true;
    }

    removeCurrentTile() {
        let newSt = this.shiftTile((this.state.selectionDirection + 2) % 4, this.state.selectedTile);
        let currentTileCandidates = this.props.tiles.filter(
            (tile) => tile.row == newSt.row && tile.column == newSt.column);

        if(currentTileCandidates.length < 1)
            return false;

        this.props.tiles.pop(currentTileCandidates[0]);
        this.setState({
            selectedTile: newSt,
            selectionDirection: this.state.selectionDirection
        });

        return currentTileCandidates[0].char;
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
            {row: st.row - 1, column: st.column,     char:'△', ui: true, direction: 0 },
            {row: st.row,     column: st.column + 1, char:'▷', ui: true, direction: 1 },
            {row: st.row + 1, column: st.column,     char:'▽', ui: true, direction: 2 },
            {row: st.row,     column: st.column - 1, char:'◁', ui: true, direction: 3 }
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
        if(this.props.count === undefined || this.props.count > 0)
            this.props.virtualKeyDown(label);
    }

    render() {
        var className = "keyboard-key";
        if(this.props.count === 0)
            className = className + " keyboard-key-disabled";

        return (
            <div className={className} onClick={() => this.handleClick(this.props.label)}>{this.props.label}</div>
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
        this.props.virtualKeyDown(key);
    }

    renderKeyboardKey(key) {
        let tileCount = this.props.tiles[key] ?? 0;

        return (<KeyboardKey key={key} label={key} count={tileCount} virtualKeyDown={(key) => this.onKeyDown(key)}></KeyboardKey>)
    }

    render() {
        let kbClass = "keyboard" + (this.props.isDumpMode ? " keyboard-dump" : "")

        return (
            <div className={kbClass}>
                <div className="keyboard-row keyboard-row-r1">{this.state.keys.row1.map(this.renderKeyboardKey.bind(this))}</div>
                <div className="keyboard-row keyboard-row-r2">{this.state.keys.row2.map(this.renderKeyboardKey.bind(this))}</div>
                <div className="keyboard-row keyboard-row-r3">
                    {this.state.keys.row3.map(this.renderKeyboardKey.bind(this))}
                    <KeyboardKey label="<=" virtualKeyDown={(key) => this.props.onBackspace()}></KeyboardKey>
                    </div>
            </div>
        )
    }
}

function countTiles(tiles) {
    var count = 0;
    for(var key in tiles)
        count += tiles[key];
        return count;
}

function mixTileset(tileset) {
    console.log("mixTileset");
    console.log(tileset);
    var mixed = ""
    for(var l in tileset) {
        mixed = mixed + l.repeat(tileset[l])
    }

    mixed = strShuffle(mixed);
    return mixed;
}

function unmix(mixed) {
    var tileset = {};

    for (var l of mixed)
        tileset[l] = (tileset[l] ?? 0) + 1;

    return tileset;
}

function mixPick(tileset) {
    return mixTileset(tileset)[0];
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        let mixed = this.mix();
        console.log(mixed);
        this.state = mixed;
    }

    mix() {
        let ukSet = {
            'a': 13, 'b': 3, 'c': 3, 'd': 6, 'e': 18, 'f': 3, 'g': 4, 'h': 3, 'i': 12,
            'j': 2, 'k': 2, 'l': 5, 'm': 3, 'n': 8, 'o': 11, 'p': 3, 'q': 2, 'r': 9,
            's': 6, 't': 9, 'u': 6, 'v': 3, 'w': 3, 'x': 2, 'y': 3, 'z': 2
        }

        let mixed = mixTileset(ukSet);
        let playerTiles = unmix(mixed.substring(0, 10)); 
        let stashTiles = unmix(mixed.substring(10));

        return {
            tiles: [{row: 6, column: 6, char:'⚓', ui: true }],
            playerTiles: playerTiles,
            stashTiles: stashTiles,
            dumpMode: false
        }
    }

    peel() {
        let newTile = mixPick(this.state.stashTiles);
        let newState = cloneUpdate(this.state, (s) => {
            s.playerTiles[newTile] = (s.playerTiles[newTile] ?? 0) + 1;
            s.stashTiles[newTile] -= 1
        });
        this.setState(newState);
    }

    dump(key) {
        this.setState(cloneUpdate(this.state, (s) => {
            s.playerTiles[key] -= 1;
        }));
        this.peel();
        this.peel();
        this.peel();
    }

    toggleDumpMode() {
        this.setState(cloneUpdate(this.state, (s) => s.dumpMode = !s.dumpMode));
    }

    virtualKeyPress(key) {
        if(this.state.dumpMode) {
            this.dump(key);
            this.toggleDumpMode();
        } else {
            if(this._wordzone.placeTile(key)) {
                let newState = cloneUpdate(this.state, (s) => s.playerTiles[key] -= 1);
                this.setState(newState);
            }
        }
    }

    virtualBackspace() {
        let tile = this._wordzone.removeCurrentTile();
        if (tile) {
            let newState = cloneUpdate(this.state, (s) => s.playerTiles[tile] = (s.playerTiles[tile] ?? 0) + 1);
            this.setState(newState);
        }
    }

    render() {
        let canPeel = countTiles(this.state.playerTiles) === 0;
        let canDump = countTiles(this.state.stashTiles) >= 3;

      return (
        <div className="container">
            <Header canPeel={canPeel} canDump={canDump} isDumpMode={this.state.dumpMode}
                onPeel={() => this.peel()} onDump={() => this.toggleDumpMode()} />
            <WordZone ref={(c) => this._wordzone = c} tiles={this.state.tiles} />
            <Keyboard tiles={this.state.playerTiles} isDumpMode={this.state.dumpMode}
                virtualKeyDown={(k) => this.virtualKeyPress(k)} onBackspace={() => this.virtualBackspace()}/>
        </div>
      );
    }
  }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
