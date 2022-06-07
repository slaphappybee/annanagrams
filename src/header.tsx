import React from 'react';

interface HeaderProps {
    playerTileCount: number;
    boardTileCount: number;
    stashTileCount: number;
}

export default class Header extends React.Component<HeaderProps> {
    render() {
        return (
            <div className="header">
                <h1>🍩 Annanagrams! 🍩</h1>
                <p className="header-stats">
                👩 {this.props.playerTileCount } &nbsp;&nbsp;&nbsp;
                👇 {this.props.boardTileCount} &nbsp;&nbsp;&nbsp;
                👜 {this.props.stashTileCount}</p>
            </div>
        )
    }
}
