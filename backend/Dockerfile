# Usando a imagem oficial do Node.js
FROM node:16

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante dos arquivos do projeto
COPY . .

# Expondo a porta do backend
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["npm", "start"]
