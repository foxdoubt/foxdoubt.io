import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;

    return (
      <Layout location={this.props.location}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />

        <header className='flex flex-column padding-sm padding-top-md'>
          <div className='flex'>
            <div className='flex blue-underline'>
              <h1 className='align-self-flex-end capitalize'>
                {post.frontmatter.title}
              </h1>
              <figure className='icon-cactus' />
            </div>
          </div>
          <p className='bold timestamp'>{post.frontmatter.date}</p>
        </header>
        <div className='content-container padding-sm'>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
        <hr className='horizontal-divider' />
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
