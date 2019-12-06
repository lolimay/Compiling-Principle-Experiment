/**
 * 确定的有穷自动机只能有唯一的初态，但可以有多个终态
 * 每个状态对字母表中任意一个输入符号，最多只有一个后继状态
 */
export interface IDFA {
    K: Set<string>; // K是一个有穷非空集，集合中的每个元素称为一个状态
    Sigma: Set<string>; //∑是一个有穷字母表, ∑中的每个元素称为一个输入符号
    F: Set<Map<Array<string>, string>>; //F是一个从K×∑➜K的单值转换函数，即F(R, a) = Q, (R, Q∈K)表示当前状态为R,如果输入字符a,则转到状态Q,状态Q称为状态R的后继状态
    S: string; //S∈K，是唯一的初态
    Z: Array<string>; // Z⊆K,是一个终态集
}