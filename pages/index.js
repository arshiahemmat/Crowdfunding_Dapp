import React, { Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import {Link} from '../routes';

class factory_index extends Component{
    
    static async getInitialProps(){
        const campaigns =await factory.methods.getContract().call();
        return {campaigns};
    }

    campaignsRender(){

        const items = this.props.campaigns.map((address)=>{
                return({
                    header: address,
                    description:(
                        <Link route={`/campaign/${address}`}>
                        <a>View campaign</a>
                        </Link>
                    ) ,
                    fluid: true
                }
                );
            }
        );
        return <Card.Group items={items} />;

    }


    render(){
        return( 
                <Layout>
                    <div>
                        <h2>open campaigns</h2>
                        <Link route={'/campaign/new'} >
                            <a>
                                <Button style={{ marginTop: '12px'}} floated='right' content="create campaign"
                                icon="add circle" primary
                                />
                            </a>
                        </Link>    
                        {this.campaignsRender()}

                        </div>
                </Layout>
        )
    }
}
export default factory_index;