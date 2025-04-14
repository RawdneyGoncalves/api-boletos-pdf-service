import swaggerUi from 'swagger-ui-express';
import { Application, Request, Response } from 'express';

const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "API de Gerenciamento de Boletos e PDFs",
    "version": "1.0.0",
    "description": "API para gerenciamento de boletos e lotes do Condomínio Green Park",
    "contact": {
      "name": "Software Engineer",
      "email": "mendesrawdney@gmail.com"
    }
  },
  "servers": [
    {
      "url": "/",
      "description": "Servidor Principal"
    }
  ],
  "tags": [
    {
      "name": "Boletos",
      "description": "Operações relacionadas aos boletos"
    },
    {
      "name": "Lotes",
      "description": "Operações relacionadas aos lotes"
    }
  ],
  "paths": {
    "/api/boletos": {
      "get": {
        "summary": "Lista todos os boletos",
        "description": "Retorna uma lista de todos os boletos, com opção de filtros e geração de relatório",
        "tags": ["Boletos"],
        "parameters": [
          {
            "in": "query",
            "name": "nome",
            "schema": {
              "type": "string"
            },
            "description": "Filtrar por nome do sacado",
            "example": "Jose"
          },
          {
            "in": "query",
            "name": "valor_inicial",
            "schema": {
              "type": "number"
            },
            "description": "Valor mínimo do boleto",
            "example": 100
          },
          {
            "in": "query",
            "name": "valor_final",
            "schema": {
              "type": "number"
            },
            "description": "Valor máximo do boleto",
            "example": 200
          },
          {
            "in": "query",
            "name": "id_lote",
            "schema": {
              "type": "integer"
            },
            "description": "ID do lote relacionado",
            "example": 1
          },
          {
            "in": "query",
            "name": "relatorio",
            "schema": {
              "type": "integer",
              "enum": [0, 1]
            },
            "description": "Gerar relatório em PDF (1 = sim, 0 = não)",
            "example": 0
          }
        ],
        "responses": {
          "200": {
            "description": "Lista de boletos encontrados",
            "content": {
              "application/json": {
                "schema": {
                  "oneOf": [
                    {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Bill"
                      }
                    },
                    {
                      "$ref": "#/components/schemas/Report"
                    }
                  ]
                },
                "examples": {
                  "listaBoletos": {
                    "value": [
                      {
                        "id": 1,
                        "payeeName": "JOSE DA SILVA",
                        "lotId": 1,
                        "amount": 182.54,
                        "digitableLine": "123456123456123456",
                        "active": true,
                        "createdAt": "2025-04-10T10:30:00Z"
                      },
                      {
                        "id": 2,
                        "payeeName": "MARCOS ROBERTO",
                        "lotId": 2,
                        "amount": 178.20,
                        "digitableLine": "123456123456123456",
                        "active": true,
                        "createdAt": "2025-04-10T10:35:00Z"
                      }
                    ]
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao recuperar boletos: Conexão com o banco de dados falhou"
                }
              }
            }
          }
        }
      }
    },
    "/api/boletos/{id}": {
      "get": {
        "summary": "Busca um boleto específico",
        "description": "Retorna um boleto pelo seu ID",
        "tags": ["Boletos"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID do boleto",
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "Boleto encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Bill"
                },
                "example": {
                  "id": 1,
                  "payeeName": "JOSE DA SILVA",
                  "lotId": 1,
                  "amount": 182.54,
                  "digitableLine": "123456123456123456",
                  "active": true,
                  "createdAt": "2025-04-10T10:30:00Z",
                  "lot": {
                    "id": 1,
                    "name": "0017",
                    "active": true
                  }
                }
              }
            }
          },
          "404": {
            "description": "Boleto não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Boleto não encontrado"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao recuperar boleto: Conexão com o banco de dados falhou"
                }
              }
            }
          }
        }
      }
    },
    "/api/boletos/import-csv": {
      "post": {
        "summary": "Importa boletos de um arquivo CSV",
        "description": "Processa um arquivo CSV para importar boletos para o sistema",
        "tags": ["Boletos"],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "Arquivo CSV com boletos"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Boletos importados com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Bill"
                  }
                },
                "example": [
                  {
                    "id": 1,
                    "payeeName": "JOSE DA SILVA",
                    "lotId": 1,
                    "amount": 182.54,
                    "digitableLine": "123456123456123456",
                    "active": true,
                    "createdAt": "2025-04-14T14:30:00Z"
                  },
                  {
                    "id": 2,
                    "payeeName": "MARCOS ROBERTO",
                    "lotId": 2,
                    "amount": 178.20,
                    "digitableLine": "123456123456123456",
                    "active": true,
                    "createdAt": "2025-04-14T14:30:00Z"
                  }
                ]
              }
            }
          },
          "400": {
            "description": "Arquivo não fornecido ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Nenhum arquivo CSV fornecido"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao importar arquivo CSV: Formato de arquivo inválido"
                }
              }
            }
          }
        }
      }
    },
    "/api/boletos/process-pdf": {
      "post": {
        "summary": "Processa um arquivo PDF com múltiplos boletos",
        "description": "Recebe um PDF com múltiplas páginas de boletos e o divide em arquivos individuais",
        "tags": ["Boletos"],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "Arquivo PDF com boletos"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "PDF processado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProcessedPdf"
                },
                "example": {
                  "files": [
                    "/output/1.pdf",
                    "/output/2.pdf",
                    "/output/3.pdf"
                  ]
                }
              }
            }
          },
          "400": {
            "description": "Arquivo não fornecido ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Nenhum arquivo PDF fornecido"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao processar arquivo PDF: Formato de arquivo inválido"
                }
              }
            }
          }
        }
      }
    },
    "/api/lotes": {
      "get": {
        "summary": "Lista todos os lotes",
        "description": "Retorna uma lista de todos os lotes ativos",
        "tags": ["Lotes"],
        "responses": {
          "200": {
            "description": "Lista de lotes encontrados",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Lot"
                  }
                },
                "example": [
                  {
                    "id": 1,
                    "name": "0017",
                    "active": true,
                    "createdAt": "2025-04-10T10:00:00Z"
                  },
                  {
                    "id": 2,
                    "name": "0018",
                    "active": true,
                    "createdAt": "2025-04-10T10:05:00Z"
                  },
                  {
                    "id": 3,
                    "name": "0019",
                    "active": true,
                    "createdAt": "2025-04-10T10:10:00Z"
                  }
                ]
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao recuperar lotes: Conexão com o banco de dados falhou"
                }
              }
            }
          }
        }
      },
      "post": {
        "summary": "Cria um novo lote",
        "description": "Cadastra um novo lote no sistema",
        "tags": ["Lotes"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["name"],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Nome do lote"
                  },
                  "active": {
                    "type": "boolean",
                    "description": "Status de ativação do lote",
                    "default": true
                  }
                }
              },
              "example": {
                "name": "0020",
                "active": true
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Lote criado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Lot"
                },
                "example": {
                  "id": 4,
                  "name": "0020",
                  "active": true,
                  "createdAt": "2025-04-14T15:00:00Z"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao criar lote: Já existe um lote com esse nome"
                }
              }
            }
          }
        }
      }
    },
    "/api/lotes/{id}": {
      "get": {
        "summary": "Busca um lote específico",
        "description": "Retorna um lote pelo seu ID",
        "tags": ["Lotes"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID do lote",
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "Lote encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Lot"
                },
                "example": {
                  "id": 1,
                  "name": "0017",
                  "active": true,
                  "createdAt": "2025-04-10T10:00:00Z"
                }
              }
            }
          },
          "404": {
            "description": "Lote não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Lote não encontrado"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao recuperar lote: Conexão com o banco de dados falhou"
                }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Atualiza um lote existente",
        "description": "Modifica um lote existente pelo seu ID",
        "tags": ["Lotes"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID do lote",
            "example": 1
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Nome do lote"
                  },
                  "active": {
                    "type": "boolean",
                    "description": "Status de ativação do lote"
                  }
                }
              },
              "example": {
                "name": "0017A",
                "active": true
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Lote atualizado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string"
                    }
                  }
                },
                "example": {
                  "message": "Lote atualizado com sucesso"
                }
              }
            }
          },
          "404": {
            "description": "Lote não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Lote não encontrado ou atualização falhou"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao atualizar lote: Já existe um lote com esse nome"
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "Remove um lote",
        "description": "Marca um lote como inativo (exclusão lógica)",
        "tags": ["Lotes"],
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": {
              "type": "integer"
            },
            "description": "ID do lote",
            "example": 1
          }
        ],
        "responses": {
          "200": {
            "description": "Lote removido com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string"
                    }
                  }
                },
                "example": {
                  "message": "Lote removido com sucesso"
                }
              }
            }
          },
          "404": {
            "description": "Lote não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Lote não encontrado ou remoção falhou"
                }
              }
            }
          },
          "500": {
            "description": "Erro do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                },
                "example": {
                  "error": "Erro ao remover lote: O lote possui boletos associados"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Lot": {
        "type": "object",
        "required": ["name", "active"],
        "properties": {
          "id": {
            "type": "integer",
            "description": "ID do lote"
          },
          "name": {
            "type": "string",
            "description": "Nome do lote"
          },
          "active": {
            "type": "boolean",
            "description": "Status de ativação do lote"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Data de criação do lote"
          }
        }
      },
      "Bill": {
        "type": "object",
        "required": ["payeeName", "lotId", "amount", "digitableLine", "active"],
        "properties": {
          "id": {
            "type": "integer",
            "description": "ID do boleto"
          },
          "payeeName": {
            "type": "string",
            "description": "Nome do sacado"
          },
          "lotId": {
            "type": "integer",
            "description": "ID do lote relacionado"
          },
          "lot": {
            "$ref": "#/components/schemas/Lot",
            "description": "Dados do lote relacionado"
          },
          "amount": {
            "type": "number",
            "format": "double",
            "description": "Valor do boleto"
          },
          "digitableLine": {
            "type": "string",
            "description": "Linha digitável do boleto"
          },
          "active": {
            "type": "boolean",
            "description": "Status de ativação do boleto"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time",
            "description": "Data de criação do boleto"
          }
        }
      },
      "Error": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "description": "Mensagem de erro"
          }
        }
      },
      "Report": {
        "type": "object",
        "properties": {
          "base64": {
            "type": "string",
            "description": "Conteúdo do relatório em base64"
          }
        }
      },
      "ProcessedPdf": {
        "type": "object",
        "properties": {
          "files": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Lista de caminhos dos arquivos processados"
          }
        }
      }
    }
  }
};

const customCss = `
.swagger-ui .topbar { display: none }
.swagger-ui .info { margin: 25px 0 }
.swagger-ui .opblock-tag { font-size: 20px; margin: 15px 0 8px 0 }
.swagger-ui .opblock .opblock-summary { padding: 12px }
.swagger-ui .btn.execute { background-color: #4990e2 }
.swagger-ui .btn.execute:hover { background-color: #357abf }
.swagger-ui .opblock.opblock-post { background: rgba(73,175,95,.1) }
.swagger-ui .opblock.opblock-get { background: rgba(97,175,254,.1) }
.swagger-ui .opblock.opblock-put { background: rgba(252,161,48,.1) }
.swagger-ui .opblock.opblock-delete { background: rgba(249,62,62,.1) }
.swagger-ui .execute-wrapper { padding: 15px }
.swagger-ui .try-out__btn { margin-bottom: 10px }
.swagger-ui .parameter__name { font-weight: bold }
.swagger-ui table tbody tr td { padding: 10px 0 }
.swagger-ui .opblock-body .opblock-section .opblock-section-header h4 { font-size: 16px }
.swagger-ui .responses-table .response-col_status { width: 100px }
.swagger-ui .markdown p { margin-top: 5px }
.swagger-ui .renderedMarkdown p { margin-top: 5px }
.swagger-ui .response-col_description__inner div.markdown { margin-top: 8px }
.swagger-ui .btn.try-out__btn { background-color: #4990e2; color: white; }
.swagger-ui .opblock .opblock-section-header > label { margin: 0 10px 0 0; }
`;

const swaggerOptions = {
  customCss,
  customSiteTitle: 'API de Gerenciamento de Boletos - Documentação',
  swaggerOptions: {
    docExpansion: 'list',
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 2,
    tryItOutEnabled: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showCommonExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: 'agate'
    }
  }
};

const setupSwagger = (app: Application): void => {
  app.use((req: Request, res: Response, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    return next();
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

  app.get('/', (_req: Request, res: Response) => {
    res.redirect('/api-docs');
  });

  app.get('/swagger.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
  
  console.log('Swagger UI configurado com sucesso. Acesse http://localhost:3000/api-docs');
};

export { setupSwagger };