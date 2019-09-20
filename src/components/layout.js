import React, { Fragment, useState } from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

const PostPreview = ({ postData, classes }) => (
  <div className={`nav-more-posts-container sm-padding ${classes}`}>
    <div class='card'>
      <p className='bold uppercase'>posts</p>
    </div>
    <hr className='horizontal-divider' />
    {postData &&
      postData.map((post, i) => {
        const horizontalDivider =
          i !== postData.length - 1 ? (
            <hr className='horizontal-divider' />
          ) : null;
        const postTitle = post.node.frontmatter.title;
        const { slug } = post.node.fields;
        return (
          <Fragment>
            <div className='card'>
              <Link to={slug}>{postTitle}</Link>
            </div>
            {horizontalDivider}
          </Fragment>
        );
      })}
  </div>
);

const TabletSidebar = ({ postData, header, siteNavigation }) => {
  const dividerHtml = <p className='desert-sky-dusk capitalize'>|</p>;
  return (
    <nav className='foxdoubt-nav'>
      <div className='site-navigation-sticker flex align-center justify-center'>
        <div className='flex flex-1 justify-space-evenly align-center'>
          {header}
          {dividerHtml}
          {siteNavigation.map((navItem, i) => {
            if (navItem.name !== 'home') {
              const divider =
                i !== siteNavigation.length - 1 ? dividerHtml : null;
              const navItemHtml = (
                <Fragment>
                  <Link className='uppercase' to={navItem.slug}>
                    {navItem.name}
                  </Link>
                  {divider}
                </Fragment>
              );
              return navItemHtml;
            }
            return null;
          })}
        </div>
        <div className='icon-fox'></div>
      </div>
      <PostPreview postData={postData} />
    </nav>
  );
};

const Layout = props => {
  const [isFooterNavActive, setFooterNavState] = useState(false);
  return (
    <StaticQuery
      query={graphql`
        query getLayoutData {
          allMarkdownRemark(
            sort: { fields: frontmatter___date, order: DESC }
            limit: 3
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
        const { location, title, children } = props;
        const rootPath = `${__PATH_PREFIX__}/`;
        let header;

        if (location.pathname === rootPath) {
          header = (
            <h1>
              <Link to={`/`} className='logo-text'>
                {title}
              </Link>
            </h1>
          );
        } else {
          header = (
            <h3>
              <Link to={`/`}>{title}</Link>
            </h3>
          );
        }
        const footerNavBtnHtml = (
          <p
            onClick={() => setFooterNavState(!isFooterNavActive)}
            className={`bold italic${isFooterNavActive ? ' active' : ''}`}>
            {isFooterNavActive ? 'hide posts' : 'show posts'}
          </p>
        );
        return (
          <React.Fragment>
            <div className='page-container'>
              <div className='main-container flex-tablet'>
                <main className='main-left'>{children}</main>
                <TabletSidebar
                  postData={edges ? edges : null}
                  header={header}
                  siteNavigation={siteNavigation}
                />
              </div>
              <footer className='footer'>
                <div
                  className={`nav footer-nav-modal${
                    isFooterNavActive ? ' active' : ''
                  }`}>
                  <div className='footer-nav-items-container'>
                    <div className='nav-site-options-container'>
                      <div className='flex'>
                        <p>about</p>
                        <p className='flex-1'>connect</p>
                        {footerNavBtnHtml}
                      </div>
                      <PostPreview postData={edges} />
                    </div>
                  </div>
                  <div className='modal-cover'></div>
                </div>

                <div className='copyright-container'>
                  <p className='copyright-content'>{`copyright ${String.fromCharCode(
                    169
                  )} 2019 foxdoubt`}</p>
                </div>
              </footer>
            </div>
          </React.Fragment>
        );
      }}
    />
  );
};

export default Layout;
