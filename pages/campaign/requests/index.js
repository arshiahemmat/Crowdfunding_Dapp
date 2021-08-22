import React, {Component} from 'react';
import {Button, Table} from 'semantic-ui-react';
import Layout from '../../../components/layout';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import ReqRow from '../../../components/RequestRow';





class ShowRequests extends Component{


    static async getInitialProps(props){
        const {address} = props.query;
        const campaign = Campaign(address);
        const reqCount = await campaign.methods.getLen().call();
        const totalApprovers = await campaign.methods.ApproversCounter().call();

        const requests = await Promise.all(
            Array(parseInt(reqCount)).fill().map((element, index) =>{
                return campaign.methods.request(index).call();
                } 
            )
        )
        return {address, requests, reqCount, totalApprovers};
    }
    renderRow(){
        return this.props.requests.map((request, index)=>{
            return <ReqRow 
            request={request}
            id = {index}
            key={index}
            address = {this.props.address}
            totalApprovers = {this.props.totalApprovers}
            />
        })
    }

    render(){

        const {Header, Row, HeaderCell, Body} = Table;
        return(
            <Layout>
                <h2>Pending Requests</h2>
                <Link route={`/campaign/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated='right' style={{marginBottom: '10px'}}>New Request!</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approveral Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRow()}</Body>
                </Table>
                <div>Found {this.props.reqCount} request.</div>
            </Layout>   
        );  
    }
}
export default ShowRequests;