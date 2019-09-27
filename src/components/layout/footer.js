import React from 'react';
import PostPreview from './post-preview';

export default ({ isActive, children, setState, postPreviewData }) => {
  const footerNavBtnHtml = (
    <p
      onClick={() => setState(!isActive)}
      className={`bold italic${isActive ? ' active' : ''}`}>
      {isActive ? 'hide posts' : 'show posts'}
    </p>
  );
  return (
    <footer className='footer uppercase flex-tablet align-center-tablet'>
      <div className={`nav footer-nav-modal${isActive ? ' active' : ''}`}>
        <div className='footer-nav-items-container'>
          <div className='nav-site-options-container'>
            <div className='flex padding-sm'>
              {children}
              {footerNavBtnHtml}
            </div>
            <PostPreview postData={postPreviewData} forFooterNav={true} />
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
  );
};
