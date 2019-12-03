import { OutputHighlightTypes } from '../constants';

export function concatMessage(msg: string, type: OutputHighlightTypes, lineNumber: number = undefined) {
    return `<p>${ type } ${ lineNumber ? `line ${ lineNumber }:` : '' } ${ msg }</p>`;
}