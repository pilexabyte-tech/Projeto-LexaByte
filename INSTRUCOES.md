Uso por Todos os Agentes
As diretrizes deste arquivo são válidas para todos os agentes e devem ser seguidas de forma estrita ao processar arquivos.

1. Escopo e Execução
Adesão Estrita ao Pedido: Não realize implementações não solicitadas. Se identificar uma oportunidade de melhoria fora do escopo atual, não a execute; em vez disso, adicione uma nota ao final da resposta ou abra uma Issue para discussão futura.

Preservação de Lógica: A prioridade é a limpeza de código morto (variáveis não utilizadas, funções obsoletas, imports redundantes). Não altere a arquitetura do sistema sem autorização prévia.

2. Fluxo de Trabalho para Processamento de Arquivos
Refatoração e Simplificação: Remova comentários redundantes quando a lógica estiver clara. Simplifique fluxos de controle e elimine variáveis intermediárias que não sejam necessárias, mantendo a lógica original intacta.

Registro de Mudanças Impactantes: Se uma alteração for estritamente necessária e modificar o comportamento da aplicação, registre-a em um documento de atualização. A descrição deve focar no fluxo resultante, sem explicar remoções ou detalhes de implementação.

Gestão de Erros e Bloqueios: Ao identificar vulnerabilidades de segurança, dependências quebradas ou bugs críticos, interrompa o processo imediatamente. Descreva o erro de forma objetiva e aguarde revisão humana.

3. Documentação e Comentários
Concisão de Comentários: Evite explicações extensas ou óbvias (ex: // define a variável x). Utilize comentários apenas para explicar o "porquê" de lógicas complexas ou decisões não intuitivas, mantendo-os em uma única linha sempre que possível.

Código Autodocumentado: Prefira renomear variáveis e funções para nomes semânticos em vez de adicionar comentários explicativos.

4. Instruções Anti-Alucinação (Adições Sugeridas)
Verificação de Dependências: Antes de sugerir a exclusão de um módulo ou função, verifique se não há referências dinâmicas ou chamadas em arquivos de configuração que não foram carregados no contexto imediato.

Saída de Código Íntegra: Ao sugerir alterações, forneça o bloco de código completo ou use marcadores claros de onde as alterações devem ser inseridas. Nunca oculte partes essenciais com comentários do tipo // ... restante do código aqui.

Consistência de Estilo: Mantenha o padrão de nomenclatura (CamelCase, snake_case, etc.) e a estrutura de pastas já existente no projeto.

Clean Code Minimalista: Foque na redução da complexidade ciclomática. Se uma função puder ser simplificada sem perder a legibilidade, faça-o, mas mantenha a funcionalidade idêntica à original.