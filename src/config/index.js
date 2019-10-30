require('dotenv').config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 8080,
    cors: process.env.CORS,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbLocal: process.env.DB_LOCAL,
    defaultRootPassword: process.env.DEFAULT_ROOT_PASSWORD,
    defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD,
    defaultCollaboratorPassword: process.env.DEFAULT_COLLABORATOR_PASSWORD,
    defaultClientPassword: process.env.DEFAULT_CLIENT_PASSWORD,
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    rootApiKeyToken: process.env.ROOT_API_KEY_TOKEN,
    adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN,
    collaboratorApiKeyToken: process.env.COLLABORATOR_API_KEY_TOKEN,
    clientApiKeyToken: process.env.CLIENT_API_KEY_TOKEN
}

module.exports = { config }
