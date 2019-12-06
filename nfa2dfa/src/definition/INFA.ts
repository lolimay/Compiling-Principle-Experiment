/**
 * NFA的初始状态S为一个状态集，即允许有多个初始状态
 * NFA允许对同一个输入符号可以有多个后继状态。即DFA中的F是单值函数，而NFA中的F是多值函数
 */
export interface INFA {
    K: Set<string>;
    Sigma: Set<string>;
    F: Set<Map<Array<string>, Array<string>>>; // F(R, a) = P (R∈K, P⊆K) 输出是一个状态集
    S: Array<string>;
    Z: Array<string>;
}