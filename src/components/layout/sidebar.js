import React, { Fragment } from 'react';
import { Link } from 'gatsby';

export default ({ header, siteNavigation, children }) => {
  const dividerHtml = <p className='color-desert-sky-dusk capitalize'>|</p>;
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
      {children}
    </nav>
  );
};
