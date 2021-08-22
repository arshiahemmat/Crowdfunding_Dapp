import React,{Component} from 'react';
import Layout from '../../components/layout'
import {Form, Button, Input, Message} from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import { Router } from '../../routes';


class CreateNewCampain extends Component{
    state={
        minCont: '',
        Err: '',
        loading: false
    };


    onSubmit = async (event)=>{
        event.preventDefault();


        this.setState({loading: true, Err: ''});
        try{
        const accounts = await web3.eth.getAccounts();
        await factory.methods.create_campain(this.state.minCont)
            .send({
                from: accounts[0]
            });
        Router.pushRoute('/');
        }catch(err){
            this.setState({Err: err.message});
        }
        // this.setState({loading: false});

    }


    render(){
        return(
            <Layout>
                <h2 style={{marginBottom:'20px'}}>Create New campaign</h2>
                <Form onSubmit={this.onSubmit} error={!!this.state.Err}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                        label="Wei"
                        labelPosition='right'
                        value = {this.state.minCont}
                        onChange={event=> this.setState({minCont: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops something goes wronge   =_(" content={this.state.Err} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        )  
    }
}
export default CreateNewCampain;