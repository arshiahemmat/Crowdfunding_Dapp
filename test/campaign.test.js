const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const CompiledFactory = require('../ethereum/build/factory_campaign.json');
const CompiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async ()=>{

    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(CompiledFactory.interface))
        .deploy({data: CompiledFactory.bytecode})
        .send({from: accounts[0],gas:'1000000'});

    
    await factory.methods.create_campain('9999999999').send({
        from: accounts[0],
        gas:1000000
    });

    const address = await factory.methods.getContract().call();
    campaignAddress = address[0];

    campaign = await new web3.eth.Contract(JSON.parse(CompiledCampaign.interface), campaignAddress);

});

describe('Factory and Campaign...', () =>{
    it('deploy a contract for Campaign and Factory',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('Check Creator is really is manager',async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });
    it('add some money to Campaign and Check that adderess is going to be provider',async ()=>{
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '9999999999999'
        });
        const isApprovers = await campaign.methods.Approvers(accounts[1]).call();
        assert(isApprovers);
    })
    it('check minimum for contribute...',async ()=>{
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '13'
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    });
    it('can create Request',async ()=>{
        await campaign.methods
            .createRequest('Create Web App', web3.utils.toWei('15','ether'),accounts[1]).send({
                from: accounts[0],
                gas: '1000000'
            });
        const req = await campaign.methods.request(0).call();
        assert.equal(req.description,'Create Web App');
    })
    it('Proccess of request', async ()=>{

        let inital_balance = await web3.eth.getBalance(accounts[1]);

        inital_balance = web3.utils.fromWei(inital_balance,'ether');
        inital_balance = parseFloat(inital_balance);

        await campaign.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('10','ether')
        });

        await campaign.methods
            .createRequest('Hack other sites...', web3.utils.toWei('10','ether'),accounts[1]).send({
                from: accounts[0],
                gas: '1000000'
            });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        assert(balance>inital_balance+9);
    });
});