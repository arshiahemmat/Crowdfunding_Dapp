import web3 from './web3';
import campaignFactory from './build/factory_campaign.json';


const instance = new web3.eth.Contract(JSON.parse(campaignFactory.interface), '0xc2bf47Fa34Bd85C36e96174C4E118b8Fa3986Af9');

export default instance;