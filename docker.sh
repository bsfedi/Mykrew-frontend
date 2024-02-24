# #!/bin/bash

# # Check if a client name is provided as an argument
# if [ -z "$1" ]; then
#   echo "Usage: $0 <client_name>"
#   exit 1
# fi

# CLIENT_NAME=$1
# NETWORK_NAME="${CLIENT_NAME}-network"
# CONTAINER_NAME="${CLIENT_NAME}-frontend-container"
# IMAGE_NAME="${CLIENT_NAME}-frontend-image"

# # Check if the network exists, if not, create it
# if [ -z "$(docker network ls -q -f name=${NETWORK_NAME})" ]; then
#     docker network create "${NETWORK_NAME}"
# fi

# # Stop and remove the container if it exists
# if [ "$(docker ps -a -q -f name=${CONTAINER_NAME})" ]; then
#     docker stop "${CONTAINER_NAME}" && docker rm "${CONTAINER_NAME}"
# fi

# # Build and run the Docker container with the client name as an argument
# docker build -t "${IMAGE_NAME}" -f Dockerfile --build-arg CLIENT_NAME=${CLIENT_NAME} .
# docker run -d --name "${CONTAINER_NAME}" -p 8090:90 --network "${NETWORK_NAME}" "${IMAGE_NAME}" 

# echo "Container for ${CLIENT_NAME} is up and running. Frontend is accessible at http://localhost:8080/${CLIENT_NAME}"


#!/bin/bash

# Check if a client name is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <client_name>"
  exit 1
fi

CLIENT_NAME=$1
NETWORK_NAME="${CLIENT_NAME}-network"
CONTAINER_NAME="${CLIENT_NAME}-frontend-container"
MONGO_CONTAINER_NAME="${CLIENT_NAME}-mongodb-container"
IMAGE_NAME="${CLIENT_NAME}-frontend-image"

# Check if the network exists, if not, create it
if [ -z "$(docker network ls -q -f name=${NETWORK_NAME})" ]; then
    docker network create "${NETWORK_NAME}"
fi

# Stop and remove the container if it exists
if [ "$(docker ps -a -q -f name=${CONTAINER_NAME})" ]; then
    docker stop "${CONTAINER_NAME}" && docker rm "${CONTAINER_NAME}"
fi

# Stop and remove the MongoDB container if it exists
if [ "$(docker ps -a -q -f name=${MONGO_CONTAINER_NAME})" ]; then
    docker stop "${MONGO_CONTAINER_NAME}" && docker rm "${MONGO_CONTAINER_NAME}"
fi

# Build and run the Docker container with the client name as an argument
docker build -t "${IMAGE_NAME}" -f Dockerfile --build-arg CLIENT_NAME=${CLIENT_NAME} .
docker run -d --name "${CONTAINER_NAME}" -p 8090:90 --network "${NETWORK_NAME}" "${IMAGE_NAME}" 

# Run MongoDB container
docker run -d --name "${MONGO_CONTAINER_NAME}" -p 27017:27017 --network "${NETWORK_NAME}" mongo:latest --auth

echo "Containers for ${CLIENT_NAME} are up and running. Frontend is accessible at http://localhost:8080/${CLIENT_NAME}"
