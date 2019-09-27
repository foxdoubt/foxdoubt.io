import React, { Fragment } from 'react';
import { Link } from 'gatsby';

export default ({ postData, forFooterNav = false }) => {
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
