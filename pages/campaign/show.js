import React, { Component} from 'react';
import { Card, Grid, Button } from 'semantic-ui-react'; 
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign'
import ContributeForm from '../../components/ContributeForm'
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

class ShowCampaign extends Component{
    static async getInitialProps(props){

        const campaign = Campaign(props.query.address);
        const summery = await campaign.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summery[0],
            balance: summery[1],
            requestConut: summery[2],
            ApproversCount: summery[3],
            manager: summery[4]
        };
    };

    RenderCards(){
        const {
            address,
            minimumContribution,
            balance,
            requestConut,
            ApproversCount,
            manager
        } = this.props;

        const items = [
            {
              header: manager,
              description:
                'Manager is who create campaign and acctualy he/she can create request',
              meta: 'manager address',
              style: {'wordWrap':'break-word'}
            },
            {
              header: minimumContribution,
              description:
                'it means that if you want join this Campaign, you should pay that wei into Campaign',
              meta: 'Minimum Contribution',
            },
            {
              header: requestConut,
              description:
                'this is number of request that manager created to give money from pool',
              meta: 'Number of request',
            },
            {
                header: ApproversCount,
                description:
                  'this is number of Approvers that Join to this Campaign',
                meta: 'Number of Approvers',
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                description:
                  'this is total price (ether) with recived from Approvers until now',
                meta: 'Balance of Contract',
            }
          ]

          return <Card.Group items={items} />

    }
    

    render(){
        return(
            <Layout>
                <h3>Campaign details</h3>
                <Grid>
                  <Grid.Row>
                      <Grid.Column width = {10}>
                        {this.RenderCards()}
                      </Grid.Column>
                      <Grid.Column width = {6}>
                        <ContributeForm address={this.props.address} />
                      </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Link route={`/campaign/${this.props.address}/requests`}>
                        <a>
                          <Button primary>View Request!</Button>
                        </a>
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                </Grid> 
            </Layout>
        );
    }
}

export default ShowCampaign;