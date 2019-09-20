import React, { Fragment, useState } from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

const PostPreview = ({ postData, forFooterNav = false }) => {
  let itemClasses;
  let dividerHtml = <hr className='horizontal-divider' />;
  let headerHtml = (
    <Fragment>
      <div class={`card`}>
        <p className='bold uppercase'>posts</p>
      </div>
      {dividerHtml}
    </Fragment>
  );
  if (forFooterNav) {
    headerHtml = null;
    dividerHtml = null;
    itemClasses = 'capitalize color-content justify-center';
  }
  return (
    <div className={`nav-more-posts-container sm-padding`}>
      {headerHtml}
      {dividerHtml}
      {postData &&
        postData.map((post, i) => {
          const horizontalDivider =
            i !== postData.length - 1 ? dividerHtml : null;
          const postTitle = post.node.frontmatter.title;
          const { slug } = post.node.fields;
          return (
            <Fragment>
              <div className={`card${' ' + itemClasses}`}>
                <Link className='color-content' to={slug}>
                  {postTitle}
                </Link>
              </div>
              {horizontalDivider}
            </Fragment>
          );
        })}
    </div>
  );
};

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
              <footer className='footer uppercase flex-tablet align-center-tablet'>
                <div
                  className={`nav footer-nav-modal${
                    isFooterNavActive ? ' active' : ''
                  }`}>
                  <div className='footer-nav-items-container'>
                    <div className='nav-site-options-container'>
                      <div className='flex padding-sm'>
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
                        {footerNavBtnHtml}
                      </div>
                      <PostPreview postData={edges} forFooterNav={true} />
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
