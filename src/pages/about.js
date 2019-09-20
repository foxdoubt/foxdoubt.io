import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Bio from '../components/bio';

export default props => {
  const aboutHtml = props.data.file.childMarkdownRemark.html;
  const siteTitle = props.data.site.siteMetadata.title;
  const { author: nametag, leadline } = props.data.site.siteMetadata;
  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title='About' />
      <Bio {...{ leadline, nametag }} />
      <div
        className='content-container padding-sm'
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query getAboutContent {
    site {
      siteMetadata {
        title
        leadline
        author
      }
    }
    file(name: { in: "about" }) {
      childMarkdownRemark {
        html
      }
    }
  }
`;
