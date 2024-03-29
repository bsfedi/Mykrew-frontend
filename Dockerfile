# Use an official Node.js runtime as a parent image
FROM node:14 as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Set environment variable for client name
ARG CLIENT_NAME
ENV CLIENT_NAME ${CLIENT_NAME}


# Copy the current directory contents into the container at /app
COPY . .

# Modify environment.ts with the dynamic URL
RUN sed -i "s|baseUrl: '.*'|baseUrl: 'https://new-base-url.com/'|g" src/environments/environment.ts && \
    echo "Updated base URL in environment.ts to: https://new-base-url.com/"


RUN sed -i "s|default: '.*'|default: '${CLIENT_NAME}'|g" src/environments/environment.ts && \
    echo "Updated CLIENT_NAME in environment.ts to: ${CLIENT_NAME}"

# Build the Angular app
RUN npm run build --prod

# Use Nginx as a web server for the Angular app
FROM nginx:latest

# Copy the built Angular app to the default Nginx public directory
COPY --from=builder /app/dist/mykrew /usr/share/nginx/html

# Copy the custom nginx.conf to the Nginx container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 90 to the outside world
EXPOSE 90

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]


# # # Use an official Node.js runtime as a parent image
# # FROM node:14 as builder

# # # Set the working directory to /app
# # WORKDIR /app

# # # Copy package.json and package-lock.json to the container
# # COPY package*.json ./

# # # Install any needed packages specified in package.json
# # RUN npm install

# # # Set environment variable for client name
# # ARG CLIENT_NAME
# # ENV CLIENT_NAME ${CLIENT_NAME}

# # # Copy the current directory contents into the container at /app
# # COPY . .

# # # Modify environment.ts with the dynamic URL
# # RUN sed -i "s|baseUrl: '.*'|baseUrl: 'https://new-base-url.com/'|g" src/environments/environment.ts && \
# #     echo "Updated base URL in environment.ts to: https://new-base-url.com/"

# # RUN sed -i "s|default: '.*'|default: '${CLIENT_NAME}'|g" src/environments/environment.ts && \
# #     echo "Updated CLIENT_NAME in environment.ts to: ${CLIENT_NAME}"

# # # Build the Angular app
# # RUN npm run build --prod


# # # Use Nginx as a web server for the Angular app
# # FROM nginx:latest

# # # Set the NGINX_PORT environment variable
# # ARG PORT
# # ENV PORT ${PORT}

# # # Copy the built Angular app to the default Nginx public directory
# # COPY --from=builder app/dist/mykrew /usr/share/nginx/html

# # # Copy the custom nginx.conf to the Nginx container
# # COPY nginx.conf /etc/nginx/nginx.conf

# # # Expose the port to the Docker host
# # EXPOSE ${PORT}


# # # # Use Nginx as a web server for the Angular app
# # # FROM nginx:latest

# # # # Copy the built Angular app to the default Nginx public directory
# # # COPY --from=builder /app/dist/mykrew /usr/share/nginx/html

# # # # Copy the custom nginx.conf to the Nginx container
# # # COPY nginx.conf /etc/nginx/nginx.conf







# # Use an official Node.js runtime as a parent image
# FROM node:14 as builder

# # Set the working directory to /app
# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # Install any needed packages specified in package.json
# RUN npm install

# # Set environment variable for client name
# ARG CLIENT_NAME
# ENV CLIENT_NAME ${CLIENT_NAME}

# # Copy the current directory contents into the container at /app
# COPY . .

# # Modify environment.ts with the dynamic URL
# RUN sed -i "s|baseUrl: '.*'|baseUrl: 'https://new-base-url.com/'|g" src/environments/environment.ts && \
#     echo "Updated base URL in environment.ts to: https://new-base-url.com/"

# RUN sed -i "s|default: '.*'|default: '${CLIENT_NAME}'|g" src/environments/environment.ts && \
#     echo "Updated CLIENT_NAME in environment.ts to: ${CLIENT_NAME}"

# # Build the Angular app
# RUN npm run build --prod


# # Use Nginx as a web server for the Angular app
# FROM nginx:latest

# # Set the NGINX_PORT environment variable
# ARG PORT
# ENV NGINX_PORT ${PORT}

# # Copy the built Angular app to the default Nginx public directory
# COPY --from=builder /app/dist/mykrew /usr/share/nginx/html

# # Copy the custom nginx.conf to the Nginx container
# COPY nginx.conf /etc/nginx/nginx.conf

# # Replace NGINX_PORT placeholder with actual port value
# RUN sed -i "s|\${NGINX_PORT}|${NGINX_PORT}|g" /etc/nginx/nginx.conf

# # Expose the port to the Docker host
# EXPOSE ${PORT}

