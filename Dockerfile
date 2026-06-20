# ==========================================
# Etapa 1: Compilación (Build)
# ==========================================
# Usamos Node 22 (Alpine) porque Angular 21 requiere Node >= 20.13 o >= 22
FROM node:22-alpine AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias primero para optimizar el caché de Docker
COPY package*.json ./

# Usamos 'npm ci' en lugar de 'npm install' para instalaciones deterministas y limpias
RUN npm ci

# Copiamos el resto del código fuente del proyecto
COPY . .

# Compilamos la aplicación. Al no especificar configuración, angular.json usa "production"
RUN npm run build

# ==========================================
# Etapa 2: Servidor (Nginx)
# ==========================================
# Usamos Nginx ligero basado en Alpine Linux para servir los estáticos
FROM nginx:alpine

# Limpiamos los archivos HTML por defecto que trae Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos compilados desde la Etapa 1 al directorio de Nginx.
# IMPORTANTE: Con el nuevo builder '@angular/build:application' de Angular, 
# los estáticos se generan dentro de la subcarpeta '/browser'.
COPY --from=build /app/dist/rednorte-frontend/browser /usr/share/nginx/html

# Reemplazamos la configuración por defecto de Nginx con la nuestra
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 (Exactamente el que espera tu LoadBalancer en Kubernetes)
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]