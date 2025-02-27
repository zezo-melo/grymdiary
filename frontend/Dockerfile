# Usando a imagem oficial do Node.js para o build
FROM node:16 as build

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de dependência
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

# Servindo o build com uma imagem Nginx
FROM nginx:alpine

# Copiando o build gerado para a pasta do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expondo a porta do frontend
EXPOSE 80
