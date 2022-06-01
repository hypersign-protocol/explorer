class TxStore{
    constructor(){
        this.storeId = 'TX_STATE';
        this.list = {}; // key val
    }

    set(tx){
        const txStore = localStorage.getItem(this.storeId);
        txStore[tx.hash] = tx
        localStorage.setItem(this.storeId, JSON.stringify(txStore));
    }

    get(txHash){
        const txStore = localStorage.getItem(this.storeId);
        return txStore[tx.hash]
    }

    getByHash(){

    }

}

