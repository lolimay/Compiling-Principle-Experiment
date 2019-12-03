import { Input } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { parseSource } from './main';

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
                </div>
                <p id='output'></p>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));