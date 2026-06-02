# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos la aplicación para producción
RUN npm run build --configuration=production

# ETAPA 2: Servidor Web (Deploy)
FROM nginx:alpine

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de Angular desde la Etapa 1 a Nginx
COPY --from=build /app/dist/rednorte-frontend/browser /usr/share/nginx/html

# Exponemos el puerto 80 del contenedor
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]