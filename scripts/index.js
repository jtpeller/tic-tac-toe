'use strict';

const e = React.createElement;
const r = ReactDOM.createRoot;

// hierarchy: Menu -> Menu Buttons
function MenuButton(props) {
    return e(
        'a',
        {
            className: `btn btn-outline-light menu-btn ${props.value.toLowerCase()}`,
            onClick: () => {
                props.onClick()
            },
            href: props.href,
        },
        props.value
    )
}

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ["Two-Player", "Easy", "Medium", "Hard", "Impossible"]
        }
    }

    renderMenuButton(i) {
        return e(
            MenuButton,
            {
                onClick: () => {this.props.onClick(i)},
                value: this.state.name[i],
                href: `game.html?diff=${i}`,
            }
        )
    }

    render() {
        let menuarr = [];
        for (let i = 0; i < this.state.name.length; i++) {
            menuarr.push(this.renderMenuButton(i));
        }
        return e('div', {className: 'menu-list'},
            ...menuarr
        )
    }
}


// ------------------------
// build website
// ------------------------
window.onload = () => {
    const container = document.querySelector('#game-menu');
    const root = r(container);
    root.render(e(Menu));
}