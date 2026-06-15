FROM node:22.17.0
ARG NPM_TOKEN
# ARG = build time argument
# passed in from pipeline when building image
# only exists DURING build process
# NOT stored in final image — secure ✅

WORKDIR /app
COPY package*.json ./
# create .npmrc dynamically inside container using token
RUN echo "registry=https://pkgs.dev.azure.com/mgmehakgoel/vault/_packaging/vaultiq-feed/npm/registry/" > .npmrc && \
    echo "always-auth=true" >> .npmrc && \
    echo "//pkgs.dev.azure.com/mgmehakgoel/vault/_packaging/vaultiq-feed/npm/registry/:_authToken=${NPM_TOKEN}" >> .npmrc
# > .npmrc → creates file with first line
# >> .npmrc → appends subsequent lines
# ${NPM_TOKEN} → uses the ARG value passed from pipeline
# third line is the authentication line npm needs
# format: //registry-url/:_authToken=token

RUN npm install
RUN rm .npmrc
# deletes .npmrc after install
# token no longer needed
# not stored in final image → secure ✅

COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"] 