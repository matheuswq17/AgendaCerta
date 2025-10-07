# Psi-Agenda

Sistema de agendamento e automação para psicólogos, com foco em otimizar a gestão de pacientes e reduzir faltas através de confirmações automatizadas via WhatsApp.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Aplicação Next.js com interface de usuário
- **Backend**: API Flask com banco de dados PostgreSQL

## Requisitos

### Frontend
- Node.js 14+
- npm ou yarn

### Backend
- Python 3.8+
- PostgreSQL 12+
- Redis (para filas de processamento)

## Instalação

### Configuração do Backend

1. Navegue até a pasta do backend:
```
cd backend
```

2. Crie um ambiente virtual Python:
```
python -m venv venv
```

3. Ative o ambiente virtual:
   - Windows:
   ```
   venv\Scripts\activate
   ```
   - Linux/Mac:
   ```
   source venv/bin/activate
   ```

4. Instale as dependências:
```
pip install -r requirements.txt
```

5. Crie um arquivo `.env` baseado no `.env.example`:
```
cp .env.example .env
```

6. Configure as variáveis de ambiente no arquivo `.env` com suas credenciais:
   - Banco de dados PostgreSQL
   - Chaves JWT
   - Credenciais da API do WhatsApp
   - Credenciais do Mercado Pago
   - Configurações do Redis

7. Inicialize o banco de dados:
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

8. Inicie o servidor de desenvolvimento:
```
flask run
```

9. Em um terminal separado, inicie o worker para processamento de filas:
```
python -m workers
```

### Configuração do Frontend

1. Navegue até a pasta do frontend:
```
cd frontend
```

2. Instale as dependências:
```
npm install
```
ou
```
yarn install
```

3. Crie um arquivo `.env.local` baseado no `.env.example`:
```
cp .env.example .env.local
```

4. Configure as variáveis de ambiente no arquivo `.env.local`:
   - URL da API
   - Chave pública do Mercado Pago
   - Configurações de autenticação

5. Inicie o servidor de desenvolvimento:
```
npm run dev
```
ou
```
yarn dev
```

6. Acesse a aplicação em `http://localhost:3000`

## Uso da Aplicação

### Primeiros Passos

1. **Cadastro e Login**:
   - Acesse a página inicial e clique em "Cadastrar"
   - Preencha seus dados e escolha um plano
   - Após o cadastro, faça login com suas credenciais

2. **Configuração Inicial**:
   - Configure sua disponibilidade na seção "Disponibilidade"
   - Personalize as mensagens automáticas em "Automação"
   - Configure suas preferências de notificação

3. **Cadastro de Pacientes**:
   - Adicione pacientes individualmente ou importe via CSV
   - Certifique-se de incluir o número de WhatsApp com DDD

4. **Agendamento de Sessões**:
   - Utilize o calendário na seção "Agenda" para criar novos agendamentos
   - Selecione o paciente, data, hora e modalidade (online/presencial)
   - Os pacientes receberão automaticamente mensagens de confirmação

### Funcionalidades Principais

#### Dashboard
- Visão geral das próximas sessões
- Estatísticas de atendimentos e faltas
- Alertas sobre confirmações pendentes

#### Agenda
- Visualização semanal e mensal
- Agendamento rápido com clique no horário desejado
- Edição e cancelamento de sessões

#### Pacientes
- Cadastro individual de pacientes
- Importação em massa via CSV
- Histórico de sessões por paciente

#### Disponibilidade
- Configuração de dias e horários disponíveis
- Definição de períodos de ausência (férias, feriados)
- Geração automática de horários disponíveis

#### Automação
- Personalização de mensagens automáticas
- Configuração de lembretes e confirmações
- Definição de janela de cancelamento

#### Mensagens
- Histórico de mensagens enviadas
- Status de entrega e leitura
- Respostas recebidas dos pacientes

## Integração com WhatsApp

O sistema utiliza a API oficial do WhatsApp Cloud para enviar mensagens automáticas aos pacientes. As principais mensagens são:

1. **Convite para Consentimento**: Solicita permissão para envio de mensagens
2. **Confirmação de Agendamento**: Informa sobre nova sessão agendada
3. **Lembrete D-1**: Enviado um dia antes da sessão
4. **Lembrete H-3**: Enviado três horas antes da sessão
5. **Oferta de Horários**: Enviada semanalmente com horários disponíveis

Os pacientes podem responder diretamente às mensagens para:
- Confirmar presença
- Solicitar reagendamento
- Cancelar sessão
- Pausar notificações (opt-out)

## Integração com Mercado Pago

O sistema utiliza o Mercado Pago para gerenciar assinaturas e pagamentos. Estão disponíveis dois planos:

1. **Plano Start**: Até 30 pacientes ativos
2. **Plano Pro**: Até 100 pacientes ativos e funcionalidades avançadas

## Solução de Problemas

### Backend

- **Erro de conexão com banco de dados**: Verifique as credenciais no arquivo `.env`
- **Falha no envio de mensagens**: Confirme as credenciais da API do WhatsApp
- **Erro nos workers**: Verifique se o Redis está em execução

### Frontend

- **Erro de conexão com API**: Verifique a URL da API no arquivo `.env.local`
- **Problemas de autenticação**: Limpe os cookies do navegador e faça login novamente

## Suporte

Para suporte técnico, entre em contato através do e-mail: suporte@psi-agenda.com.br