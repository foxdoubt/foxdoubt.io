import React from 'react';
import { Link } from 'gatsby';

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1 className='logo-text'>
          <Link to={`/`}>{title}</Link>
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

        <main>{children}</main>
        <footer class='footer'>
          <div class='flex nav'>
            <div class='flex nav-about-connect'>
              <p>about</p>
              <p>connect</p>
            </div>
            <p class='bold italic'>more posts</p>
          </div>
          <div class='copyright-container'>
            <p class='copyright-content'>copyright &copy 2019 foxdoubt</p>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;
