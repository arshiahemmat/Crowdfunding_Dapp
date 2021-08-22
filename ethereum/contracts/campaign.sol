pragma solidity ^0.4.17;


contract factory_campaign{
    address[] public contract_address;
    function create_campain(uint minimum) public {
        contract_address.push(new Campaign(minimum, msg.sender));
    }
    function getContract() public view returns(address[]){
        return contract_address;
    }
}




contract Campaign{
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) Approveral;
        uint ApproveralCount;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public Approvers;
    Request[] public request;
    uint public ApproversCounter = 0;
    function Campaign(uint minimum, address manager_add) public{
        manager = manager_add;
        minimumContribution = minimum;
    }
    function contribute() public payable{
        require(msg.value >= minimumContribution);
        
        Approvers[msg.sender]=true;
        ApproversCounter++;
        
    }
    function createRequest(string description,uint value, address recipient) public{
        require(manager == msg.sender);
        Request memory newrequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            ApproveralCount:0
        });
        
        request.push(newrequest);
    }
    function approveRequest(uint index) public{
        require(Approvers[msg.sender]);
        Request storage req = request[index];
        require(!req.complete);
        require(!req.Approveral[msg.sender]);
        
        req.Approveral[msg.sender] = true;
        req.ApproveralCount++;
    }
    function finalizeRequest(uint index) public{
        require(msg.sender == manager);
        require(!request[index].complete);
        require((ApproversCounter/2) < (request[index].ApproveralCount));
        require(this.balance >= request[index].value);
        
        request[index].recipient.transfer(request[index].value);
        request[index].complete = true;
        
    }
    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return(
            minimumContribution,
            this.balance,
            request.length,
            ApproversCounter,
            manager
        );
    }

    function getLen() public view returns(uint){
        return request.length;
    }

}
