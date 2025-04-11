# Projeto Boletos

Este projeto é uma aplicação Node.js que gerencia boletos de condomínio, permitindo a importação de dados via CSV e a distribuição de boletos em PDF.

## Funcionalidades

- **Importação de Boletos via CSV**: Permite importar dados de boletos de um arquivo CSV.
- **Distribuição de Boletos em PDF**: Distribui os boletos em arquivos PDF separados.
- **Listagem de Boletos**: Fornece uma API para listar todos os boletos importados.
- **Geração de Relatório em PDF**: Gera um relatório em PDF com informações dos boletos.

## Requisitos

- Node.js (versão 16 ou superior)
- Banco de dados MySQL
- Bibliotecas necessárias listadas no `package.json`

## Instalação

1. Clone o repositório: git clone https://github.com/seu-usuario/projeto-boletos.git


2. Instale as dependências: npm install


3. Configure as variáveis de ambiente no arquivo `.env`:


4. Execute o comando para conectar ao banco de dados e iniciar o servidor: npm start



## Endpoints

- **POST /boletos/importar-boletos**: Importa boletos de um arquivo CSV.
- **POST /boletos/distribuir-boletos-pdf**: Distribui os boletos em arquivos PDF.
- **GET /boletos**: Lista todos os boletos.
- **GET /boletos/relatorio**: Gera um relatório em PDF dos boletos.

## Contribuição

Contribuições são bem-vindas! Para contribuir, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature.
3. Envie um pull request com suas alterações.

## Licença

Este projeto é licenciado sob a licença MIT.

## Contato

Para mais informações ou dúvidas, entre em contato com [o danadão](mailto:seu-email@example.com).
