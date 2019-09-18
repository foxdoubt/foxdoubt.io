import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const { author: nametag, leadline } = data.site.siteMetadata;
    const bioBlurbHtml = data.file.childMarkdownRemark.html;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title='All posts' />
        <Bio {...{ leadline, nametag }} />
        <div dangerouslySetInnerHTML={{ __html: bioBlurbHtml }} />
      </Layout>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        leadline
        author
      }
    }
    file(name: { in: "bio-blurb" }) {
      childMarkdownRemark {
        html
      }
    }
  }
`;
