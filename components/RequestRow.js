import React, { Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';


class RowRequest extends Component{

    state = {
        ErrorMessage: ''
    }

    onClick = async (event)=>{
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);
        try{
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
        }catch(err){

        }
    }

    onFinalize = async (event)=>{
        event.preventDefault();
        this.setState({ErrorMessage:''})
        const accounts = await web3.eth.getAccounts();
        const campaign = Campaign(this.props.address);
        try{
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
        }catch(err){
            this.setState({ErrorMessage:err.message})
        }
    }
    render(){
        const {Row, Cell} = Table;
        const {id, request, totalApprovers} = this.props;
        const readyToFinalize = request.ApproveralCount > totalApprovers/2;
        return(
           <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
               <Cell>{parseInt(id)+1}</Cell>
               <Cell>{request.description}</Cell>
               <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
               <Cell>{request.recipient}</Cell>
               <Cell>{request.ApproveralCount} / {totalApprovers}</Cell>
               { request.complete ? null :(
                    <Cell>
                            <Button color='green' basic onClick={this.onClick}>Approve</Button>
                    </Cell>
               )}
               { request.complete ? null :(
               <Cell>
                    <Button color='red' basic onClick={this.onFinalize}>Finalize</Button>
               </Cell>
               )}
           </Row>
        )
    }
}
export default RowRequest;
