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
            (tile) => tile.row === newSt.row && tile.column === newSt.column);

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