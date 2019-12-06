export interface IGrammar {
    P: Set<Map<string, string>>;
    Vn: Set<string>;
    Vt: Set<string>;
    S: string;
}