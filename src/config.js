const env  = require('dotenv')
env.config();

module.exports = {
    studio: {
        BASE_URL: process.env.VUE_APP_STUDIO_BASE_URL || "http://localhost:9001/",
    },
    nodeServer: {
        BASE_URL: process.env.VUE_APP_NODE_SERVER_BASE_URL || "http://localhost:5000/",
        NETWORK_STATUS_EP: process.env.VUE_APP_NODE_SERVER_NETWORK_STATUS_EP || "network/info",
        SCHEMA_LIST_EP: process.env.VUE_APP_NODE_SERVER_SCHEMA_LIST_EP || "api/schema/list",
        SCHEMA_GET_EP: process.env.VUE_APP_NODE_SERVER_SCHEMA_GET_EP || "api/schema/get",
        DID_LIST_EP: process.env.VUE_APP_NODE_SERVER_DID_LIST_EP || "api/did/list",
        DID_CREATE_EP: process.env.VUE_APP_NODE_SERVER_DID_CREATE_EP || "api/did/create",
        DID_RESOLVE_EP: process.env.VUE_APP_NODE_SERVER_DID_RERSOLVE_EP || "api/did/resolve/"
    },
    app: {
        name: process.env.VUE_APP_TITLE || "Hypersign Studio",
        description: process.env.VUE_APP_DESC || "A portal to issue and verify credentials on Hypersign Identity network!"
    }   
}