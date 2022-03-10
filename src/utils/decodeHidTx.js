const {
    defaultRegistryTypes,
} = require("@cosmjs/stargate");
const { decodeTxRaw, Registry }= require("@cosmjs/proto-signing");
import  { MsgCreateDID, MsgUpdateDID, MsgDeactivateDID } from "../../lib/tx";

const hidRegistry = new Registry(defaultRegistryTypes);
console.log(MsgCreateDID)
hidRegistry.register("/hypersignprotocol.hidnode.ssi.MsgCreateDID", MsgCreateDID);
hidRegistry.register("/hypersignprotocol.hidnode.ssi.MsgUpdateDID", MsgUpdateDID);
hidRegistry.register("/hypersignprotocol.hidnode.ssi.MsgDeactivateDID", MsgDeactivateDID);

function parseTx (tx){
    const decoded = decodeTxRaw(new Buffer.from(tx, "base64"));
    const parsedData = [];
    for (const message of decoded.body.messages) {
        const decodedMsg = hidRegistry.decode(message);
        parsedData.push(decodedMsg);
    }
    return parsedData[0];
}

export default parseTx



