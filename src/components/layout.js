import React from 'react';
import { Link } from 'gatsby';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
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
    return (
      <React.Fragment>
        <nav className='top-nav flex'>
          <div className='logo-container flex align-center'>
            {header}
            <div className='icon-fox'></div>
          </div>
        </nav>

        <main class='sm-margin layout-main'>{children}</main>
        <footer className='footer'>
          <div className='flex nav'>
            <div class='flex nav-about-connect'>
              <p>about</p>
              <p>connect</p>
            </div>
            <p class='bold italic'>more posts</p>
          </div>
          <div className='copyright-container'>
            <p class='copyright-content'>{`copyright ${String.fromCharCode(
              169
            )} 2019 foxdoubt`}</p>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;
