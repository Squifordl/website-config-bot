# Projeto de Configuração de Bot para Discord

## Descrição

Este projeto fornece um sistema de configuração de bot para servidores Discord. Ele permite que você gerencie cargos VIP, realize integrações com a API do Discord e outras funcionalidades relacionadas.

## Requisitos

- Node.js v14 ou superior
- MongoDB
- Redis
- Conta no Discord e um bot criado para obter o token

## Instalação e Configuração

### Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone https://github.com/Squifordl/website-config-bot.git
```

## Instalar Dependências

Navegue para o diretório do projeto e instale as dependências necessárias:

```bash
cd website-config-bot
npm install

cd src/api
npm install
```

## Configurar Variáveis de Ambiente

Renomeie o arquivo .env.example para .env e preencha as variáveis de ambiente necessárias:

- `JWT_SECRET_KEY`: Chave secreta para tokens JWT.
- `NODE_ENV`: Ambiente no qual o Node.js está executando (geralmente "development" ou "production").
- `MONGO_URI`: URI da sua base de dados MongoDB.
- `TOKEN`: Token do seu bot Discord.
- `PORT`: Porta em que o servidor deve rodar.
- `CLIENT_ID`: ID do cliente do bot no Discord.
- `CLIENT_SECRET`: Segredo do cliente do bot no Discord.
- `REDIS_PASSWORD`: Senha do seu servidor Redis.
- `REDIS_HOST`: Host do servidor Redis.
- `REDIS_PORT`: Porta do servidor Redis.

Exemplo:

```bash
JWT_SECRET_KEY=meuSegredo
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/meuBancoDeDados
TOKEN=meuTokenDoBot
PORT=3000
CLIENT_ID=meuIdDoCliente
CLIENT_SECRET=meuSegredoDoCliente
REDIS_PASSWORD=minhaSenhaRedis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Execução do Projeto

Depois de configurar todas as variáveis de ambiente necessárias, você está pronto para executar o projeto. O projeto é dividido em duas partes: Front-End e Back-End. Abaixo estão os passos para executar cada uma delas.

### Executando o Front-End

1. Navegue até a raiz do projeto no terminal.
2. Compile o projeto Front-End executando o seguinte comando:

    ```bash
    npm run build
    ```

    Isso criará uma pasta de saída `build/` contendo os arquivos compilados e prontos para produção.

### Executando o Back-End

1. Navegue até o diretório `src/api`:

    ```bash
    cd src/api
    ```

2. Inicie o servidor executando o seguinte comando:

    ```bash
    node server.js
    ```

Agora, seu servidor Back-End deve estar rodando, e o Front-End deve estar pronto para ser servido. Você pode acessar a interface do usuário através do navegador, apontando para o endereço e a porta em que o Back-End está rodando (por exemplo, `http://localhost:PORTA`).

## Contrubuições

Se você gostaria de contribuir, fique à vontade para fazer um fork do repositório, abrir um pull request e reports de Bugs.

## Licença

Este projeto é licenciado sob a licença MIT.
