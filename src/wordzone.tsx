import React, { MouseEventHandler } from 'react';
import { Tile, Position } from './model';


interface ZoneTileProps {
    className: string;
    style: any;
    onClick: MouseEventHandler;
    char: string;
}

class ZoneTile extends React.Component<ZoneTileProps> {
    render() {
        let className = this.props.className + " tile";
        return (
            <div style={this.props.style} className={className}
            onClick={this.props.onClick}>{this.props.char}</div>
        )
    }
}

interface WordZoneProps {
    tiles: Array<Tile>;
    direction: number;
}

interface WordZoneState {
    selectedTile: Position;
}

export default class WordZone extends React.Component<WordZoneProps, WordZoneState> {
    constructor(props: WordZoneProps) {
        super(props);
        this.state = {
            selectedTile: {
                row: 6,
                column: 6
            } as Position
        }
    }

    selectTile(position: Position) {
        this.setState({
            selectedTile: position
        });
    }

    _getTile(row: number, column: number) {
        let currentTileCandidates = this.props.tiles.filter(
            (tile) => tile.position.row === row && tile.position.column === column);

        if(currentTileCandidates.length < 1)
            return null;
        
        return currentTileCandidates[0];
    }

    shiftTile(direction: number, tile: any) {
        let newTile = Object.assign({}, tile);
        newTile.row += (direction === 0) ? -1 : (direction === 2) ? 1 : 0
        newTile.column += (direction === 1) ? 1 : (direction === 3) ? -1 : 0
        return newTile
    }

    placeTile(key: string) {
        // Try cursor, then try position 1 step further
        var tilePosition = this.state.selectedTile;
        if(this._getTile(tilePosition.row, tilePosition.column) !== null)
            tilePosition = this.shiftTile(this.props.direction, this.state.selectedTile)
        
        if(this._getTile(tilePosition.row, tilePosition.column) !== null)
            return false;

        this.props.tiles.push({position: {row: tilePosition.row,
            column: tilePosition.column}, label: key, ui: false});

        this.setState({
            selectedTile: this.shiftTile(this.props.direction, tilePosition)
        });

        return true;
    }

    removeCurrentTile(): string | undefined {
        // Try cursor, then try position 1 step before
        var tilePosition = this.state.selectedTile;
        if(this._getTile(tilePosition.row, tilePosition.column) === null)
            tilePosition = this.shiftTile((this.props.direction + 2) % 4, this.state.selectedTile)

        let currentTile = this._getTile(tilePosition.row, tilePosition.column);
        if(currentTile === null)
            return undefined;

        // TODO bug
        this.props.tiles.pop();
        this.setState({selectedTile: tilePosition});

        return currentTile.label;
    }

    renderTile(tile: Tile) {
        let style = {
            gridRow: tile.position.row,
            gridColumn: tile.position.column
        }

        let className = tile.ui ? 'tile-ui' : 'tile-word';
        let key = `${tile.position.row}-${tile.position.column}-${tile.label}`

        return (<ZoneTile char={tile.label} style={style} className={className} 
            key={key} onClick={() => this.selectTile(tile.position)} />)
    }

    render() {
        let st = this.state.selectedTile
        let uiTiles = st ? [
            {position: {row: st.row - 1, column: st.column},     label:'△', ui: true } as Tile,
            {position: {row: st.row,     column: st.column + 1}, label:'▷', ui: true } as Tile,
            {position: {row: st.row + 1, column: st.column},     label:'▽', ui: true } as Tile,
            {position: {row: st.row,     column: st.column - 1}, label:'◁', ui: true } as Tile
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
