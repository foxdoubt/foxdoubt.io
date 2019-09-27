import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';
import Img from 'gatsby-image';

const GifPlayer =
  typeof window !== 'undefined' ? require('react-gif-player') : null;

class BlogPostTemplate extends React.Component {
  constructor(props) {
    super(props);
    const {
      data: { markdownRemark: post }
    } = props;
    this.state = {
      hasGif: !!(post.frontmatter && post.frontmatter.featuredGif),
      showGif: null
    };
  }
  handleGif = () => {
    if (GifPlayer && this.state.hasGif) {
      this.setState({ showGif: true });
    }
  };

  render() {
    const post = this.props.data.markdownRemark;
    const { title } = this.props.data.site.siteMetadata;
    let leadArtHtml = (
      <div className='padding-sm-sides padding-sm-bottom'>
        <Img
          fluid={post.frontmatter.featuredImage.childImageSharp.fluid}
          onLoad={this.handleGif}
        />
      </div>
    );
    if (this.state.showGif) {
      leadArtHtml = (
        <GifPlayer
          gif={post.frontmatter.featuredGif.publicURL}
          still={post.frontmatter.featuredImage.childImageSharp.fluid.src}
          className='padding-sm-sides padding-sm-bottom'
        />
      );
    }
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

        {leadArtHtml}

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
