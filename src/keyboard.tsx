import React from 'react';

interface KeyboardKeyProps {
    count?: number;
    virtualKeyDown: Function;
    label: string;
}

class KeyboardKey extends React.Component<KeyboardKeyProps> {
    handleClick(label: string) {
        if(this.props.count === undefined || this.props.count > 0)
            this.props.virtualKeyDown(label);
    }

    render() {
        var className = "keyboard-key";
        if(this.props.count === 0)
            className = className + " keyboard-key-disabled";

        let countStyle = (this.props.count >= 2) ? {} : {display: 'none'};

        return (
            <div className={className} onClick={() => this.handleClick(this.props.label)}>
                <div className="key-label">{this.props.label}</div>
                <div className="key-count-wrapper" style={countStyle}><div className="key-count">{this.props.count}</div></div>
            </div>
        )
    }
}

interface KeyboardProps {
    virtualKeyDown: Function;
    onBackspace: Function;
    tiles: Record<string, number>;
    isDumpMode: boolean;
}

interface KeyboardState {
    keys: {row1: Array<string>, row2: Array<string>, row3: Array<string>};
}

export default class Keyboard extends React.Component<KeyboardProps, KeyboardState> {
    constructor(props: KeyboardProps) {
        super(props);
        this.state = {
            keys: {
                row1: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                row2: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                row3: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
            }
        };
    }

    onKeyDown(key: string) {
        this.props.virtualKeyDown(key);
    }

    renderKeyboardKey(key: string) {
        let tileCount = this.props.tiles[key] ?? 0;

        return (<KeyboardKey key={key} label={key} count={tileCount} virtualKeyDown={(key: string) => this.onKeyDown(key)}></KeyboardKey>)
    }

    render() {
        let kbClass = "keyboard" + (this.props.isDumpMode ? " keyboard-dump" : "")

        return (
            <div className={kbClass}>
                <div className="keyboard-row keyboard-row-r1">{this.state.keys.row1.map(this.renderKeyboardKey.bind(this))}</div>
                <div className="keyboard-row keyboard-row-r2">{this.state.keys.row2.map(this.renderKeyboardKey.bind(this))}</div>
                <div className="keyboard-row keyboard-row-r3">
                    {this.state.keys.row3.map(this.renderKeyboardKey.bind(this))}
                    <KeyboardKey label="<=" virtualKeyDown={(key: string) => this.props.onBackspace()}></KeyboardKey>
                    </div>
            </div>
        )
    }
}