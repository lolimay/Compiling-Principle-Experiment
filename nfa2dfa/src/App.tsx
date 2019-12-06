import { Input } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import GitHubForkRibbon from 'react-github-fork-ribbon';
import { parseSource } from './main';

import LOGO from './assets/analyzer.svg';

class App extends React.Component {
    state = {
        input: null as HTMLTextAreaElement,
        output: null as HTMLTextAreaElement
    };

    componentDidMount() {
        this.setState({
            input: document.querySelector('#input') as HTMLTextAreaElement,
            output: document.querySelector('#output') as HTMLTextAreaElement
        });
    }

    eventHandler({ type }, input: HTMLTextAreaElement, output: HTMLTextAreaElement, backdrop: HTMLDivElement) {
        switch (type) {
            case 'input':
                parseSource(input, output);
                break;
            case 'scroll':
                backdrop.scrollTop = input.scrollTop;
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className='header'>
                    <img src={LOGO} alt='analyzer' />
                    <h1>NFA to DFA converter</h1>
                </div>
                <div id='main'>
                    <div className='input-container'>
                        <div id='backdrop'>
                            <div className='highlights'></div>
                        </div>
                        <Input.TextArea
                            id='input'
                            rows={20}
                            onInput={e => this.eventHandler(e, document.querySelector('#input'), document.querySelector('#output'), document.querySelector('#backdrop'))}
                            onScroll={e => this.eventHandler(e, document.querySelector('#input'), document.querySelector('#output'), document.querySelector('#backdrop'))}
                        />
                        <p id='output'></p>
                    </div>
                </div>
                <GitHubForkRibbon position='right'
                    color='#666666'
                    href='//github.com/lolimay/Compiling-Principle-Experiment'
                    target='_blank' >
                    Fork me on GitHub
                </GitHubForkRibbon>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));