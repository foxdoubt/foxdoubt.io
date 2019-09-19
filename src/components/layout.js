import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';

const TabletSidebar = ({ postData }) => {
  return (
    <nav className='foxdoubt-nav'>
      <div className='flex-tablet justify-space-evenly'>
        <p>about</p>
        <p>|</p>
        <p>connect</p>
      </div>
      <div className='nav-more-posts-container'>
        <p className='center'>posts</p>
        {postData &&
          postData.map(post => {
            const postTitle = post.node.frontmatter.title;
            return (
              <div className='nav-more-posts-post card-white'>{postTitle}</div>
            );
          })}
      </div>
    </nav>
  );
};

const Layout = props => (
  <StaticQuery
    query={graphql`
      query postPreviews {
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
      }
    `}
    render={data => {
      const { edges } = data.allMarkdownRemark;
      {
        const { location, title, children } = props;
        // const rootPath = `${__PATH_PREFIX__}/`;
        // let header;

        // if (location.pathname === rootPath) {
        //   header = (
        //     <h1>
        //       <Link to={`/`} className='logo-text'>
        //         {title}
        //       </Link>
        //     </h1>
        //   );
        // } else {
        //   header = (
        //     <h3>
        //       <Link to={`/`}>{title}</Link>
        //     </h3>
        //   );
        // }
        return (
          <React.Fragment>
            {/* <nav className='top-nav flex'>
          <div className='logo-container flex align-center'>
            {header}
            <div className='icon-fox'></div>
          </div>
        </nav> */}
            <div className='main-container flex-tablet sm-margin'>
              <main className='layout-main'>{children}</main>
              <TabletSidebar postData={edges ? edges : null} />
            </div>
            <footer className='footer'>
              <div className='flex nav'>
                <div className='flex nav-about-connect'>
                  <p>about</p>
                  <p>connect</p>
                </div>
                <p className='bold italic'>more posts</p>
              </div>
              <div className='copyright-container'>
                <p className='copyright-content'>{`copyright ${String.fromCharCode(
                  169
                )} 2019 foxdoubt`}</p>
              </div>
            </footer>
          </React.Fragment>
        );
      }
    }}
  />
);

export default Layout;
