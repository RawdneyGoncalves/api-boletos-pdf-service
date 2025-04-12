# API de Gerenciamento de Boletos - Green Park

## Descrição do Projeto

Este projeto é uma API robusta para gerenciamento de boletos do Condomínio Green Park, desenvolvida para automatizar o processamento de documentos financeiros e facilitar o controle de pagamentos.

## Tecnologias e Frameworks

### Linguagens e Ambiente
- **Node.js** (v20+): Ambiente de execução JavaScript
- **TypeScript**: Superset tipado do JavaScript para desenvolvimento escalável

### Backend
- **Express.js**: Framework web minimalista e flexível
- **Inversify**: Biblioteca de injeção de dependência
- **TypeORM**: ORM para mapeamento objeto-relacional
- **Swagger/OpenAPI**: Documentação e visualização de API

### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **Redis** (potencial melhoria): Caching e gestão de sessões

### Processamento de Arquivos
- **pdf-lib**: Manipulação avançada de PDFs
- **PDFKit**: Geração de documentos PDF
- **csv-parser**: Análise de arquivos CSV

### Validação e Segurança
- **class-validator**: Validação de dados
- **class-transformer**: Transformação de objetos
- **Helmet**: Proteção de cabeçalhos HTTP
- **cors**: Gerenciamento de CORS
- **JWT**: Autenticação de tokens (futura implementação)

### Desenvolvimento e Testes
- **Jest**: Framework de testes
- **Supertest**: Testes de integração de API
- **ESLint**: Análise de código
- **Prettier**: Formatação de código
- **Nodemon**: Reinício automático durante desenvolvimento

## Estrutura do Banco de Dados

O sistema utiliza duas tabelas principais:

- **lotes:** Armazena os lotes do condomínio
- **boletos:** Armazena os boletos importados associados aos lotes

## Principais Funcionalidades

### 1. Importação de Boletos via CSV

A API recebe um arquivo CSV com o seguinte formato:
```
nome;unidade;valor;linha_digitavel
JOSE DA SILVA;17;182.54;123456123456123456
MARCOS ROBERTO;18;178.20;123456123456123456
MARCIA CARVALHO;19;128.00;123456123456123456
```

O sistema mapeia automaticamente as unidades do sistema financeiro para os IDs de lotes no sistema da portaria.

### 2. Processamento de Arquivos PDF

A API recebe um arquivo PDF contendo múltiplos boletos (um por página) e divide-o em arquivos individuais, nomeando-os de acordo com o ID do boleto no banco de dados.

O PDF deve estar na ordem:
1. MARCIA CARVALHO
2. JOSE DA SILVA
3. MARCOS ROBERTO

### 3. Consulta de Boletos com Filtros

A API permite consultar boletos com diversos filtros:
```
GET /api/boletos?nome=JOSE&valor_inicial=100&valor_final=200&id_lote=2
```

### 4. Geração de Relatórios em PDF

A API pode gerar um relatório em PDF dos boletos filtrados:
```
GET /api/boletos?relatorio=1
```

## Possíveis Melhorias e Roadmap

### Curto Prazo
1. **Autenticação e Autorização**
   - Implementar sistema de login
   - Definir níveis de acesso (admin, portaria, síndico)
   - Integração com JWT para tokens seguros

2. **Melhorias no Processamento de Arquivos**
   - Adicionar validações mais robustas para CSV
   - Implementar tratamento de arquivos corrompidos
   - Suporte a mais formatos de entrada

3. **Monitoramento e Logs**
   - Integrar sistema de logging estruturado
   - Adicionar monitoramento de performance
   - Implementar rastreamento de erros

### Médio Prazo
1. **Integração com Sistemas Externos**
   - API para sistemas de gestão de condomínio
   - Integração com sistemas bancários
   - Webhooks para notificações

2. **Funcionalidades Avançadas**
   - Geração automática de boletos
   - Notificações de pagamento via e-mail/SMS
   - Dashboard de estatísticas financeiras

3. **Escalabilidade**
   - Configurar load balancing
   - Implementar caching distribuído
   - Otimizar consultas de banco de dados

### Longo Prazo
1. **Machine Learning**
   - Previsão de inadimplência
   - Análise de padrões de pagamento
   - Recomendações personalizadas

2. **Microserviços**
   - Decomposição da aplicação em serviços menores
   - Implementação de comunicação via message queues
   - Containerização com Docker/Kubernetes

## Endpoints da API

### Boletos
- `GET /api/boletos` - Lista todos os boletos
- `GET /api/boletos/:id` - Obtém um boleto específico
- `POST /api/boletos/import-csv` - Importa boletos de um arquivo CSV
- `POST /api/boletos/process-pdf` - Processa um PDF com múltiplos boletos

### Lotes
- `GET /api/lotes` - Lista todos os lotes
- `GET /api/lotes/:id` - Obtém um lote específico
- `POST /api/lotes` - Cria um novo lote
- `PUT /api/lotes/:id` - Atualiza um lote existente
- `DELETE /api/lotes/:id` - Remove um lote (marca como inativo)

## Como Executar

1. Clone o repositório
   ```bash
   git clone https://github.com/seu-usuario/green-park-boletos.git
   cd green-park-boletos
   ```

2. Instale as dependências
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`
   - Copie `.env.example` para `.env`
   - Preencha com suas configurações

4. Execute as migrações
   ```bash
   npm run migration:run
   ```

5. Inicie o servidor
   ```bash
   npm run dev
   ```

## Considerações de Segurança
- Validação rigorosa de entrada
- Proteção contra injeção de SQL
- Implementação de autenticação baseada em token
- Limitação de taxa de requisições
- Sanitização de dados de entrada

## Problemas Conhecidos e Limitações
1. Processamento de PDF apenas para 3 unidades específicas
2. Necessidade de ordem fixa no PDF
3. Dependência de formato específico de CSV