import React, { Fragment, useState } from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import Footer from './footer';
import PostPreview from './post-preview';
import Sidebar from './sidebar';

const Layout = props => {
  const [isFooterNavActive, setFooterNavState] = useState(false);
  return (
    <StaticQuery
      query={graphql`
        query getLayoutData {
          allMarkdownRemark(
            sort: { fields: frontmatter___date, order: DESC }
            limit: 6
            filter: { frontmatter: { title: { nin: ["About", "bio blurb"] } } }
          ) {
            edges {
              node {
                excerpt
                fields {
                  slug
                }
                frontmatter {
                  date(formatString: "MMMM DD, YYYY")
                  title
                  description
                }
              }
            }
          }
          site {
            siteMetadata {
              title
              siteNavigation {
                name
                slug
              }
            }
          }
        }
      `}
      render={data => {
        const { edges } = data.allMarkdownRemark;
        const { siteNavigation } = data.site.siteMetadata;
        const { title } = data.site.siteMetadata;
        const { location, children } = props;
        const rootPath = `${__PATH_PREFIX__}/`;

        let homeNavHtml = (
          <Fragment>
            <Link className='color-content' to='/'>
              Home
            </Link>
            <p>|</p>
          </Fragment>
        );

        let header = (
          <h3>
            <Link to={`/`}>{title}</Link>
          </h3>
        );

        if (location.pathname === rootPath) {
          header = (
            <h1>
              <Link to={`/`} className='logo-text'>
                {title}
              </Link>
            </h1>
          );
          homeNavHtml = null;
        }

        return (
          <React.Fragment>
            <div className='page-container'>
              <div className='main-container flex-tablet'>
                <main className='main-left'>{children}</main>
                <Sidebar header={header} siteNavigation={siteNavigation}>
                  <PostPreview postData={edges ? edges : null} />
                </Sidebar>
              </div>
              <Footer
                isActive={isFooterNavActive}
                setState={setFooterNavState}
                postPreviewData={edges}>
                {homeNavHtml}
                {siteNavigation.map((navItem, i) => {
                  const classes =
                    i === siteNavigation.length - 1 ? 'flex-1' : '';
                  return (
                    <Link
                      className={'color-content ' + classes}
                      to={navItem.slug}>
                      {navItem.name}
                    </Link>
                  );
                })}
              </Footer>
            </div>
          </React.Fragment>
        );
      }}
    />
  );
};

export default Layout;
