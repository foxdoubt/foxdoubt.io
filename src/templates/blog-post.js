import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/seo';
import Img from 'gatsby-image';
import { getAspectRatioFromJson } from '../utils/helpers/data-parsing';

const GifPlayer = React.lazy(() => import('../vendor/react-gif-player'));
const isSSR = typeof window === 'undefined';

class BlogPostTemplate extends React.Component {
  constructor(props) {
    super(props);
    let gifAspectRatio = null;
    let hasGif;
    const {
      data: { markdownRemark: post }
    } = props;
    if (post.frontmatter) {
      hasGif = !!post.frontmatter.featuredGif;
      gifAspectRatio = getAspectRatioFromJson(
        post.frontmatter.featuredGifDimensions
      );
    }

    this.state = {
      hasGif,
      gifAspectRatio,
      showGif: null
    };
  }
  render() {
    const post = this.props.data.markdownRemark;
    const { title } = this.props.data.site.siteMetadata;
    let leadArtHtml = null;
    if (this.state.hasGif) {
      const gifContainerClasses = `sm-margin-sides sm-margin-bottom aspect-ratio-container-${this.state.gifAspectRatio}`;
      leadArtHtml = (
        <div className={gifContainerClasses}>
          {!isSSR && (
            <React.Suspense fallback={<div />}>
              <GifPlayer
                containerClasses='blog-post-featured-gif'
                gif={post.frontmatter.featuredGif.publicURL}
                still={post.frontmatter.featuredImage.childImageSharp.fluid.src}
              />
            </React.Suspense>
          )}
        </div>
      );
    } else {
      leadArtHtml = (
        <div className='sm-margin-sides sm-margin-bottom'>
          <Img fluid={post.frontmatter.featuredImage.childImageSharp.fluid} />
        </div>
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
        featuredGifDimensions
      }
    }
  }
`;
