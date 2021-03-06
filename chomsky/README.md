设文法G(VN,VT，P,S)，其中VT是一个非空有限集,包含所有的终结符；VN是一个非空有限集，包含所有的非终结符；S是一个非终结符，称为开始符号；P是一个有限的产生式集合，每个产生式的形式为α→β；开始符号S必须在某个产生式的左部出现一次。
乔姆斯基（Chomsky）将文法分为4种类型，对于一个文法G：

1. 若产生式集合P中每一个产生式均满足：α∈(VN∪VT)*且至少包含一个非终结符，β∈(VN∪VT)*，则G是一个0型文法；
2. 在满足`1.`的前提下，若P中的每一个产生式均满足：|β|≥|α|（S→ε除外），则称G是1型文法或上下文有关文法；
3. 在满足1）、2）的前提下，若P中的每个产生式均满足，α是一个非终结符，β∈(VN∪VT)*，则称G是2型文法或上下文无关文法；
4. 在满足1）、2）和3）的前提下，若P中每个产生式的形式都是A→aB|a（右线性文法）或A→Ba|a(左线性文法)，其中A和B都是非终结符，α∈VT*，则G是3型文法或正规文法（注意：混合左右线性文法不是3型文法）。
