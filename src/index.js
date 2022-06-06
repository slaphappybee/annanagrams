import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header.js';
import WordZone from './wordzone.js';
import Keyboard from './keyboard.js';
import ButtonBar from './buttonbar.js';

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
            dumpMode: false,
            boardDirection: 1
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

    selectDirection(direction) {
        this.setState(cloneUpdate(this.state, (s) => s.boardDirection = direction));
    }

    render() {
        let canPeel = countTiles(this.state.playerTiles) === 0;
        let canDump = countTiles(this.state.stashTiles) >= 3;

      return (
        <div className="container">
            <Header />
            <WordZone ref={(c) => this._wordzone = c} tiles={this.state.tiles} direction={this.state.boardDirection} />
            <ButtonBar canPeel={canPeel} canDump={canDump} isDumpMode={this.state.dumpMode}
                onPeel={() => this.peel()} onDump={() => this.toggleDumpMode()} direction={this.state.boardDirection}
                onSelectDirection={this.selectDirection.bind(this)} />
            <Keyboard tiles={this.state.playerTiles} isDumpMode={this.state.dumpMode}
                virtualKeyDown={(k) => this.virtualKeyPress(k)} onBackspace={() => this.virtualBackspace()}/>
        </div>
      );
    }
  }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
