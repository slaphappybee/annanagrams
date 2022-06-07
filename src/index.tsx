import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './header';
import WordZone from './wordzone';
import Keyboard from './keyboard';
import ButtonBar from './buttonbar';
import { Tile, Position } from './model';

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

function cloneUpdate<T>(object: Readonly<T>, cb: (object: T) => void) {
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

class GameState {
    stashTiles: Record<string, number>;
    playerTiles: Record<string, number>;
    tiles: Array<Tile>;
    cursor: Position;
    boardDirection: number;
    dumpMode: boolean;
}

class Game extends React.Component<{}, GameState> {
    private _wordzone: WordZone;

    constructor(props) {
        super(props);
        let mixed = this.mix();
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

        return Object.assign(new GameState(), {
            tiles: [],
            playerTiles: playerTiles,
            stashTiles: stashTiles,
            cursor: {row: 7, column: 7} as Position,
            dumpMode: false,
            boardDirection: 1
        } as GameState);
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
            this.setState(this.statePlaceTile(key));
        }
    }

    virtualBackspace() {
        this.setState(this.stateRemoveCurrentTile());
    }

    selectDirection(direction) {
        this.setState(cloneUpdate(this.state, (s) => s.boardDirection = direction));
    }

    _stateGetTileAt(position: Position): Tile | undefined {
        let currentTileCandidates = this.state.tiles.filter(
            (tile) => tile.position.row === position.row && tile.position.column === position.column);

        if(currentTileCandidates.length < 1)
            return undefined;
        
        return currentTileCandidates[0];
    }

    _shiftPosition(direction: number, position: Position): Position {
        let newTile = Object.assign({}, position);
        newTile.row += (direction === 0) ? -1 : (direction === 2) ? 1 : 0
        newTile.column += (direction === 1) ? 1 : (direction === 3) ? -1 : 0
        return newTile
    }

    statePlaceTile(label: string): any {
        // Try cursor, then try position 1 step further
        var tilePosition = this.state.cursor;
        if(this._stateGetTileAt(tilePosition) !== undefined)
            tilePosition = this._shiftPosition(this.state.boardDirection, this.state.cursor)
        
        if(this._stateGetTileAt(tilePosition) !== undefined)
            return {};

        let newTiles = this.state.tiles.concat([{position: {row: tilePosition.row,
            column: tilePosition.column}, label: label, ui: false} as Tile]);
        let newPlayerTiles = cloneUpdate(this.state.playerTiles, (s) => s[label] -= 1);

        return {tiles: newTiles, cursor: tilePosition, playerTiles: newPlayerTiles};
    }

    stateRemoveCurrentTile(): any {
        // Try cursor, then try position 1 step before
        var tilePosition = this.state.cursor;
        if(this._stateGetTileAt(tilePosition) === undefined)
            tilePosition = this._shiftPosition((this.state.boardDirection + 2) % 4, this.state.cursor)

        let currentTile = this._stateGetTileAt(tilePosition);
        if(currentTile === undefined)
            return undefined;

        let newTiles = this.state.tiles.filter((t) => t !== currentTile);
        let newPlayerTiles = cloneUpdate(this.state.playerTiles, (s) => s[currentTile.label] = (s[currentTile.label] ?? 0) + 1);

        return {tiles: newTiles, cursor: tilePosition, playerTiles: newPlayerTiles};
    }

    onCursorChanged(position: Position) {
        this.setState({cursor: position});
    }

    render() {
        let canPeel = countTiles(this.state.playerTiles) === 0;
        let canDump = countTiles(this.state.stashTiles) >= 3;

      return (
        <div className="container">
            <Header />
            <WordZone ref={(c) => this._wordzone = c} tiles={this.state.tiles} cursor={this.state.cursor} onCursorChanged={this.onCursorChanged.bind(this)} />
            <ButtonBar canPeel={canPeel} canDump={canDump} isDumpMode={this.state.dumpMode}
                onPeel={() => this.peel()} onDump={() => this.toggleDumpMode()} direction={this.state.boardDirection}
                onSelectDirection={this.selectDirection.bind(this)} />
            <Keyboard tiles={this.state.playerTiles} isDumpMode={this.state.dumpMode}
                virtualKeyDown={(k: string) => this.virtualKeyPress(k)} onBackspace={() => this.virtualBackspace()}/>
        </div>
      );
    }
  }


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
