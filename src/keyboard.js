import React from 'react';

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

export default class Keyboard extends React.Component {
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