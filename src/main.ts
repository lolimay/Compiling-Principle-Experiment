import { OutputHighlightTypes } from './constants';
import { IGrammar } from './definition';
import { concatMessage, isUpperCase } from './utils';

export function parseSource(input: HTMLTextAreaElement, output: HTMLTextAreaElement) {
    const source: string = input.value;
    const lines: Array<string> = source.split('\n');
    const outputs: Array<string> = [];
    const startSymbolMatch = lines[0].match(/G\[(\S+)\]:([\S\s]+)?/);
    const G: IGrammar = {
        S: null as string,
        P: [] as Array<Map<string, string>>,
        Vn: new Set(),
        Vt: new Set(),
    };

    if (!source) {
        output.innerHTML = '';
        return;
    }

    if (!startSymbolMatch) {
        outputs.push(concatMessage('Cannot find a valid start symbol. It should be something like G[S]:', OutputHighlightTypes.error, 1));
        output.innerHTML = outputs.join('');
        highlightMatched(lines.map(line => `<p>${ line }</p>`).join(''));

        return;
    }
    if (startSymbolMatch[2]) {
        const warning = concatMessage(`Found extra words ${ startSymbolMatch[2] } in this line, ignored.`, OutputHighlightTypes.warning, 1);

        if (outputs[outputs.length] !== warning) {
            outputs.push(warning);
        }
    }

    lines[0] = lines[0].replace(/G\[(\S+)\]:/, '<mark class="mark-blue">$&</mark>');
    G.S = startSymbolMatch[1];

    for (let i=1; i<lines.length; i++) {
        const line = lines[i];
        const lineMatch = line.match(/((\S+)[ ]*→[ ]*(\S+))+/) as Array<string>;

        if (!lineMatch) {
            const warning = concatMessage('Found an invalid syntax here, ignored this line.', OutputHighlightTypes.warning, i+1);

            if (outputs[outputs.length] !== warning) {
                outputs.push(warning);
            }
            continue;
        }
        lines[i] = lines[i].replace(/((\S+)[ ]*→[ ]*(\S+))+/, (match, p1, p2, p3) => {
            const colorizedP2 = p2.split('').map(letter =>
                (isUpperCase(letter) ? `<mark class="pink bold">${ letter }</mark>` : `<mark class="blue bold">${ letter }</mark>`)
            ).join('');
            const colorizedP3 = p3.split('').map(letter =>
                (isUpperCase(letter) ? `<mark class="pink bold">${ letter }</mark>` : `<mark class="blue bold">${ letter }</mark>`)
            ).join('');
            let leftPart = match.slice(0, match.indexOf(p2) + p2.length);
            let rightPart = match.slice(match.indexOf(p2) + p2.length, match.length);

            leftPart = leftPart.replace(p2, colorizedP2);
            rightPart = rightPart.replace(p3, colorizedP3);

            return leftPart + rightPart;
        });
        G.P.push(new Map([[lineMatch[2],lineMatch[3]]]));
    }

    output.innerHTML = outputs.join('');
    highlightMatched(lines.map(line => `${ line }<br>`).join(''));
    checkGrammarType(G);
}

function checkGrammarType(G: IGrammar) {
    // console.log(G);
}

function highlightMatched(richText) {
    const input = document.querySelector('#input') as HTMLTextAreaElement;
    const backdrop = document.querySelector('#backdrop');
    
    backdrop.innerHTML = richText;
    input.value = input.value.replace('->', '→');
    input.value = input.value.replace('\\epsilon', 'ε');
}