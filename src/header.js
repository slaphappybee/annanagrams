import React from 'react';

export default class Header extends React.Component {
    render() {
        let peelDisabled = !this.props.canPeel;
        let dumpDisabled = !this.props.canDump;
        let dumpClassNames = "button" + (this.props.isDumpMode ? " button-dump" : "")

        return (
            <div className="header">
                <h1>Annanagrams!</h1>
                <div className="button-bar">
                    <button className="button" onClick={() => this.props.onPeel()} disabled={peelDisabled}>🍌</button>
                    <button className={dumpClassNames} onClick={() => this.props.onDump()} disabled={dumpDisabled}>🗑</button>
                </div>
            </div>
        )
    }
}
