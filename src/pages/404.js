import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Bio from '../components/bio';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <SEO title='404: Not Found' />
        <Bio nametag='sorry!' leadline="I couldn't find that page you wanted" />
        <div className='content-container padding-sm'>
          <h1>Page Not Found</h1>
          <p>It happens to everybody sometimes and it's okay.</p>
        </div>
      </Layout>
    );
  }
}

export default NotFoundPage;
