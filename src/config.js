import EnvProvider from 'jvjr-docker-env'

export default {
    studio: {
        BASE_URL: EnvProvider.value('STUDIO_BASE_URL'),
    },
    nodeServer: {
        BASE_URL: EnvProvider.value('NODE_SERVER_BASE_URL'),
        NETWORK_STATUS_EP: EnvProvider.value('NODE_SERVER_NETWORK_STATUS_EP') || "network/info",
        SCHEMA_LIST_EP: EnvProvider.value('NODE_SERVER_SCHEMA_LIST_EP') || "api/schema/list",
        SCHEMA_GET_EP: EnvProvider.value('NODE_SERVER_SCHEMA_GET_EP') || "api/schema/get/",
        DID_LIST_EP: EnvProvider.value('NODE_SERVER_DID_LIST_EP') || "api/did/list",
        DID_CREATE_EP: EnvProvider.value('NODE_SERVER_DID_CREATE_EP') || "api/did/create",
        DID_RESOLVE_EP: EnvProvider.value('NODE_SERVER_DID_RERSOLVE_EP') || "api/did/resolve/"
    },
    app: {
        name: EnvProvider.value('TITLE'),
        version: EnvProvider.value('VERSION'),
        description: EnvProvider.value('DESC')
    },
    hid: {
        HID_NODE_RPC_EP: EnvProvider.value('HID_NODE_RPC_EP') || "https://stage.hypermine.in/network/node1-rpc",
        HID_NODE_SOCKET_EP: EnvProvider.value('HID_NODE_SOCKET_EP') || "wss://stage.hypermine.in/network/node1-ws/",
        HID_NODE_REST_EP: EnvProvider.value('HID_NODE_REST_EP') || "https://stage.hypermine.in/network/node1-rest",
    },
    recaptchaSiteKey: EnvProvider.value('RECAPTCHA_SITE_KEY'),
    

    gblBlocks: 'gblBlocks',
    gblBlockHeight: "",
    gblTransactions: 'gblTransactions'


}
