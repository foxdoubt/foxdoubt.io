import React from 'react';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const { author: nametag, leadline, description } = data.site.siteMetadata;
    const bioBlurbHtml = data.file.childMarkdownRemark.html;

    return (
      <Layout location={this.props.location}>
        <SEO title='All posts' description={description} />
        <Bio {...{ leadline, nametag }} />
        <div
          className='content-container padding-sm'
          dangerouslySetInnerHTML={{ __html: bioBlurbHtml }}
        />
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        leadline
        author
        description
      }
    }
    file(name: { in: "bio-blurb" }) {
      childMarkdownRemark {
        html
      }
    }
  }
`;
