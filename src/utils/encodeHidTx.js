import { sha256 } from "@cosmjs/crypto";
import { fromBase64, toHex } from "@cosmjs/encoding";


const encodeHidTx = (txdata) => {
    const transactionHash = sha256(fromBase64(txdata));
    const transactionId = toHex(transactionHash).toUpperCase();
    return transactionId;
}

export default encodeHidTx;