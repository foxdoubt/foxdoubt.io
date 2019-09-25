import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark;
    const { title } = this.props.data.site.siteMetadata;
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
          <div className='flex'>
            <p className='bold timestamp'>{post.frontmatter.date}</p>
            <p className='byline'>
              by{' '}
              <span className='capitalize color-desert-sky-dusk'>{title}</span>
            </p>
          </div>
        </header>
        <div className='content-container'>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
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
