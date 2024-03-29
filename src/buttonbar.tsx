import React, { ReactNode } from "react";

interface ToggleButtonProps {
    checked: boolean;
    onClick: Function;
    children: ReactNode;
}

class ToggleButton extends React.Component<ToggleButtonProps> {
    render() {
        let className = "button" + (this.props.checked ? " button-checked" : "");

        return (
            <button onClick={() => this.props.onClick()}
                className={className}>{this.props.children}</button>
        )
    }
}

class ButtonBarProps {
    canPeel: boolean;
    canDump: boolean;
    isDumpMode: boolean;
    direction: number;

    onPeel: Function;
    onDump: Function;
    onSelectDirection: Function;
}

export default class ButtonBar extends React.Component<ButtonBarProps> {
    render() {
        let peelDisabled = !this.props.canPeel;
        let dumpDisabled = !this.props.canDump;
        let dumpClassNames = "button" + (this.props.isDumpMode ? " button-dump" : "")

        return (
            <div className="button-bar">
                <button className="button" onClick={() => this.props.onPeel()} disabled={peelDisabled}>🍌</button>
                <button className={dumpClassNames} onClick={() => this.props.onDump()} disabled={dumpDisabled}>🗑</button>
                <div className="button-group">
                    <ToggleButton onClick={() => this.props.onSelectDirection(0)} checked={this.props.direction === 0}>△</ToggleButton>
                    <ToggleButton onClick={() => this.props.onSelectDirection(1)} checked={this.props.direction === 1}>▷</ToggleButton>
                    <ToggleButton onClick={() => this.props.onSelectDirection(2)} checked={this.props.direction === 2}>▽</ToggleButton>
                    <ToggleButton onClick={() => this.props.onSelectDirection(3)} checked={this.props.direction === 3}>◁</ToggleButton>
                </div>
            </div>
        )
    }
}
