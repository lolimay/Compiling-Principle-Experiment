import { OutputHighlightTypes } from './constants';
import { IGrammar } from './definition';
import { concatMessage, isLowerCase, isUpperCase } from './utils';

export function parseSource(input: HTMLTextAreaElement, output: HTMLTextAreaElement) {
    const source: string = input.value;
    const lines: Array<string> = source.split('\n');
    const outputs: Array<string> = [];
    const startSymbolMatch = lines[0].match(/G\[(\S+)\]:([\S\s]+)?/);
    const G: IGrammar = {
        S: null as string,
        P: new Set() as Set<Map<string, string>>,
        Vn: new Set(),
        Vt: new Set(),
    };
    const errors: Array<string> = [];
    let isStartSymlbolInLeft = false;

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
        const warning = concatMessage(`Found extra words <span class="red">${ startSymbolMatch[2] }</span> in this line, ignored.`, OutputHighlightTypes.warning, 1);

        if (outputs[outputs.length] !== warning) {
            outputs.push(warning);
            lines[0] = lines[0].replace(startSymbolMatch[2], '<span class="wavy-warning">$&</span>');
        }
    }

    lines[0] = lines[0].replace(/G\[(\S+)\]:/, '<mark class="mark-blue">$&</mark>');
    G.S = startSymbolMatch[1];

    for (let i=1; i<lines.length; i++) {
        const line = lines[i];
        const lineMatch = line.match(/((\S+)[ ]*→[ ]*(\S+))+/) as Array<string>;

        if (!lineMatch) {
            const warning = concatMessage('Found an invalid syntax here, ignored this line.', OutputHighlightTypes.warning, i+1);

            if (line[i] && outputs[outputs.length] !== warning) {
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

        if (!lineMatch[2].split('').some(letter => isUpperCase(letter))) {
            const error = concatMessage('There\'s no non-terminal symbol in the left of the production.', OutputHighlightTypes.error, i+1);

            errors.push(error);

            continue;
        }

        lineMatch[3].split('|').forEach(right => {
            if (right) {
                G.P.add(new Map([[lineMatch[2], right]]));
            }
        });
    }

    const GP = new Set();

    for (const [[ left, right ]] of G.P) {
        if (left.split('').some(letter => letter === G.S)) {
            isStartSymlbolInLeft = true;
        }
        
        GP.add(`${ left } → ${ right }`);

        left.concat(right).split('').forEach(symbol => {
            if (isUpperCase(symbol)) {
                G.Vn.add(symbol);
            } else if (symbol !== 'ε') {
                G.Vt.add(symbol);
            }
        });      
    }


    if (!isStartSymlbolInLeft) {
        const error = concatMessage(`The start symbol <span class="red">${ G.S }</span> must appear at least once on the left.`, OutputHighlightTypes.error);

        outputs.push(error);
    }

    const productions = [...G.P].map(map => [...map][0]);

    const isType0 = productions.every(([left]) => left.split('').some(symbol => isUpperCase(symbol))); // 若所有产生式满足：左部至少包含一个非终结符, 则是0型文法
    const isType1 = isType0 && productions.filter(([left, right]) => left !== G.S || right !== 'ε') // 在满足0型文法的基础上，若所有产生式满足：除 S→ε 外
                                .every(([left, right]) => left.length <= right.length); // 所有产生式的左部符号个数小于等于右部符号个数, 满足以上条件则是1型文法
    const isType2 = isType1 && productions.every(([left]) => left.length === 1 && isUpperCase(left)); // 在满足文1型文法的基础上，左部有且仅有一个非终结符，则是2型文法
    const isLeftLinear = isType2 && productions.every(([, right]) => { // 判断是否是左线性文法
        switch (right.length) {
            case 1:
                return true;
            case 2:
                return isUpperCase(right[0]) && isLowerCase(right[1]);
            default:
                return false;
        }
    });
    const isRightLinear = isType2 && productions.every(([, right]) => { // 判断是否是右线性文法
        switch (right.length) {
            case 1:
                return true;
            case 2:
                return isLowerCase(right[0]) && isUpperCase(right[1]);
            default:
                return false;
        }
    });
    const isType3 = isLeftLinear || isRightLinear; // 3型文法是左线性文法或右线性文法（混用左右则不是）
    
    // 将报错加到输出输出队列中
    outputs.push(...errors);

    // 将该文法的四元组加到队列中
    outputs.push('G(Vn,Vt,P,S)<br>');
    outputs.push(`Vn: { ${ Array.from(G.Vn).join(', ') } }<br>`);
    outputs.push(`Vt: { ${ Array.from(G.Vt).join(', ') } }<br>`);
    outputs.push(`P: { ${ Array.from(GP.values()).join(', ') } }<br>`);
    outputs.push(`S: ${ G.S }<br>`);
    if (errors.length === 0 && G.Vn.size > 0 && G.Vt.size > 0) {
        outputs.push(`<span class="red">Type-${ 3 - [isType3, isType2, isType1, isType0].findIndex((element) => element === true) }</span>`);
    }

    output.innerHTML = outputs.join('');
    highlightMatched(lines.map(line => `${ line }<br>`).join(''));
}

function highlightMatched(richText) {
    const input = document.querySelector('#input') as HTMLTextAreaElement;
    const backdrop = document.querySelector('#backdrop');
    
    backdrop.innerHTML = richText;
    input.value = input.value.replace('->', '→');
    input.value = input.value.replace('\\epsilon', 'ε');
    backdrop.innerHTML = backdrop.innerHTML.replace('\\epsilon', 'ε');
}