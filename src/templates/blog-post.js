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
    this.leadArtRef = React.createRef();
    this.state = {
      hasGif: !!(post.frontmatter && post.frontmatter.featuredGif),
      showGif: null,
      playGif: null,
      leadArtHeight: null
    };
  }
  handleGif = () => {
    if (GifPlayer && this.state.hasGif) {
      this.setState({
        showGif: true,
        leadArtHeight: this.leadArtRef.current.clientHeight
      });
    }
  };
  playGif = () => {
    this.setState({
      playGif: !this.state.playGif
    });
  };

  render() {
    const post = this.props.data.markdownRemark;
    const { title } = this.props.data.site.siteMetadata;
    const { showGif } = this.state;
    let leadArtHtml = (
      <div
        ref={this.leadArtRef}
        className={`sm-margin-sides sm-margin-bottom${
          showGif ? ' gif relative' : ''
        }`}>
        {showGif && <div onClick={this.playGif} className='play_button'></div>}
        <Img
          fluid={post.frontmatter.featuredImage.childImageSharp.fluid}
          onLoad={this.handleGif}
        />
      </div>
    );
    if (this.state.playGif) {
      leadArtHtml = (
        <div className='gif-playing sm-margin-sides sm-margin-bottom relative'>
          <GifPlayer
            gif={post.frontmatter.featuredGif.publicURL}
            still={post.frontmatter.featuredImage.childImageSharp.fluid.src}
            autoplay={this.state.playGif}
            style={{ height: this.state.leadArtHeight }}
          />
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
      }
    }
  }
`;
