import React from 'react';

class Tile extends React.Component {
    render() {
        let className = this.props.className + " tile";
        return (
            <div style={this.props.style} className={className}
            onClick={this.props.onClick}>{this.props.char}</div>
        )
    }
}

export default class WordZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTile: {
                row: 6,
                column: 6
            }
        }
    }

    selectTile(row, column, direction) {
        this.setState({
            selectedTile: {
                row: row,
                column: column
            }
        });
    }

    _getTile(row, column) {
        let currentTileCandidates = this.props.tiles.filter(
            (tile) => tile.row === row && tile.column === column);

        if(currentTileCandidates.length < 1)
            return null;
        
        return currentTileCandidates[0];
    }

    shiftTile(direction, tile) {
        let newTile = Object.assign({}, tile);
        newTile.row += (direction === 0) ? -1 : (direction === 2) ? 1 : 0
        newTile.column += (direction === 1) ? 1 : (direction === 3) ? -1 : 0
        return newTile
    }

    placeTile(key) {
        // Try cursor, then try position 1 step further
        var tilePosition = this.state.selectedTile;
        if(this._getTile(tilePosition.row, tilePosition.column) !== null)
            tilePosition = this.shiftTile(this.props.direction, this.state.selectedTile)
        
        if(this._getTile(tilePosition.row, tilePosition.column) !== null)
            return false;

        this.props.tiles.push({row: tilePosition.row,
            column: tilePosition.column, char: key, ui: false});

        this.setState({
            selectedTile: this.shiftTile(this.props.direction, tilePosition)
        });

        return true;
    }

    removeCurrentTile() {
        // Try cursor, then try position 1 step before
        var tilePosition = this.state.selectedTile;
        if(this._getTile(tilePosition.row, tilePosition.column) === null)
            tilePosition = this.shiftTile((this.props.direction + 2) % 4, this.state.selectedTile)

        let currentTile = this._getTile(tilePosition.row, tilePosition.column);
        if(currentTile === null)
            return false;

        this.props.tiles.pop(currentTile);
        this.setState({selectedTile: tilePosition});

        return currentTile.char;
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
        let cursorStyle = {
            gridRow: this.state.selectedTile.row,
            gridColumn: this.state.selectedTile.column
        }

        return (
            <div className="word-zone">
                {allTiles.map(this.renderTile.bind(this))}
                <div className="tile tile-cursor" style={cursorStyle} />
            </div>
        )
    }
}
