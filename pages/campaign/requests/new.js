import React, {Component} from 'react';
import {Button, Form, Message, Input } from 'semantic-ui-react';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';


class CreateNewRequst extends Component{

    state = {
        describtion: '',
        value: '',
        recipient: '',
        errormes: '',
        loading: false
    }

    static async getInitialProps(props){
        const { address } = props.query;
        return { address };
    }
    onSubmit = async event=>{
        event.preventDefault();
        this.setState({errormes: '',loading:true})
        const campaign = Campaign(this.props.address);
        const {describtion, value, recipient} = this.state;
        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(describtion, web3.utils.toWei(value, 'ether'), recipient)
             .send({
                 from: accounts[0]
             })
            Router.pushRoute(`/campaign/${this.props.address}/requests`);
        }catch(err){
            this.setState({errormes:err.message})
        }
        this.setState({loading: false})


    }

    render(){
        return(
            
            <Layout>
                <Link route={`/campaign/${this.props.address}/requests`}>
                    <a>
                       back to Request List!
                    </a>
                </Link>
                <h3>Create Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errormes}>
                    <Form.Field>
                        <label>description: </label>
                        <Input
                            value={this.state.describtion}
                            onChange = {event=> this.setState({describtion: event.target.value})}
                        />  
                    </Form.Field>

                    <Form.Field>
                        <label>value(ether): </label>
                        <Input
                            value={this.state.value}
                            onChange = {event=> this.setState({value: event.target.value})}
                        />  
                    </Form.Field>

                    <Form.Field>
                        <label>recipient: </label>
                        <Input
                            value={this.state.recipient}
                            onChange = {event=> this.setState({recipient: event.target.value})}
                        />  
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errormes} />
                    <Button primary loading={this.state.loading}>Submit New Request!</Button>
                </Form>
            </Layout>
        )
    }
}
export default CreateNewRequst;