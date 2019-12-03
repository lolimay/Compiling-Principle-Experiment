export interface IGrammar {
    P: Array<Map<string, string>>;
    Vn: Set<string>;
    Vt: Set<string>;
    S: string;
}