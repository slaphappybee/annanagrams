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
    cursor: Position;
    onCursorChanged?: (position: Position) => void;
}

export default class WordZone extends React.Component<WordZoneProps> {
    selectTile(position: Position) {
        if(this.props.onCursorChanged)
            this.props.onCursorChanged(position);
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
        let st = this.props.cursor
        let uiTiles = st ? [
            {position: {row: st.row - 1, column: st.column},     label:'△', ui: true } as Tile,
            {position: {row: st.row,     column: st.column + 1}, label:'▷', ui: true } as Tile,
            {position: {row: st.row + 1, column: st.column},     label:'▽', ui: true } as Tile,
            {position: {row: st.row,     column: st.column - 1}, label:'◁', ui: true } as Tile
        ] : []

        let allTiles = uiTiles.concat(this.props.tiles);
        let cursorStyle = {
            gridRow: this.props.cursor.row,
            gridColumn: this.props.cursor.column
        }

        return (
            <div className="word-zone">
                {allTiles.map(this.renderTile.bind(this))}
                <div className="tile tile-cursor" style={cursorStyle} />
            </div>
        )
    }
}
