import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
    //we are in browser and we are have metamask
    web3 = new Web3(window.web3.currentProvider);
}else{
    // we are in server ore we dont have metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/4a3362e8160a4558b7489aedaa9a4fc8'
    );
    web3 = new Web3(provider);
}

export default web3;