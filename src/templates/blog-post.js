import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';

const GifPlayer =
  typeof window !== 'undefined' ? require('react-gif-player') : null;

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

        <header className='flex flex-column sm-margin-left'>
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

        {GifPlayer && (
          <GifPlayer
            gif={post.frontmatter.featuredGif.publicURL}
            still={post.frontmatter.featuredImage.childImageSharp.fluid.src}
            className='padding-sm-sides padding-sm-bottom'
          />
        )}

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
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        featuredGif {
          publicURL
        }
      }
    }
  }
`;
