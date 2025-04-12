import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Boletos e PDFS',
      version: '1.0.0',
      description: 'API para gerenciamento de boletos e lotes do Condomínio Green Park'
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor de API'
      }
    ],
    components: {
      schemas: {
        Lot: {
          type: 'object',
          required: ['name', 'active'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID do lote'
            },
            name: {
              type: 'string',
              description: 'Nome do lote'
            },
            active: {
              type: 'boolean',
              description: 'Status de ativação do lote'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do lote'
            }
          }
        },
        Bill: {
          type: 'object',
          required: ['payeeName', 'lotId', 'amount', 'digitableLine', 'active'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID do boleto'
            },
            payeeName: {
              type: 'string',
              description: 'Nome do sacado'
            },
            lotId: {
              type: 'integer',
              description: 'ID do lote relacionado'
            },
            lot: {
              $ref: '#/components/schemas/Lot',
              description: 'Dados do lote relacionado'
            },
            amount: {
              type: 'number',
              format: 'double',
              description: 'Valor do boleto'
            },
            digitableLine: {
              type: 'string',
              description: 'Linha digitável do boleto'
            },
            active: {
              type: 'boolean',
              description: 'Status de ativação do boleto'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do boleto'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        },
        Report: {
          type: 'object',
          properties: {
            base64: {
              type: 'string',
              description: 'Conteúdo do relatório em base64'
            }
          }
        },
        ProcessedPdf: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de caminhos dos arquivos processados'
            }
          }
        }
      }
    }
  },
  apis: ['./bill.routes.ts', './lot.routes.ts', './bill.routes.js', './lot.routes.js']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };