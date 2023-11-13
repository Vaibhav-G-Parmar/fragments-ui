##################################################################################################
# Stage 0: install the base dependencies 
FROM node:19.4.0 AS dependencies

# metedata about my image
LABEL maintainer="Vaibhav Parmar <vgparmar@myseneca.ca>"
LABEL description="Fragments-ui frontend web app"

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
ENV NPM_CONFIG_COLOR=false

ENV NODE_ENV=production

# Use /app as app's working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to our current working directory
COPY package.json package-lock.json ./

# Install the dependencies defined in package-lock.json
RUN npm ci --only=production

##################################################################################################
# Stage 1: build the app
FROM node:19.4.0 AS build

# Use /app as app's working directory
WORKDIR /app

# Copy the generated dependencies (node_modules/)
COPY --from=dependencies /app /app

# Copy the source code
COPY . .

# Build the app, creating /build    
RUN npm install parcel-bundler@2.10.0 \ 
&& npm run build

##################################################################################################
# Stage 3: serving the built app
FROM nginx:1.24.0-alpine AS deploy

COPY --from=build /app/dist/ /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
    CMD curl --fail localhost || exit 1

##################################################################################################