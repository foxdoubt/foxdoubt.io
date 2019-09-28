import React from 'react';
import avatar from '../../images/icons/dewald-avatar.svg';

const Bio = ({ nametag, leadline, avatarSrc = avatar }) => {
  return (
    <div className='flex profile'>
      <div className='avatar-container'>
        <img className='avatar' src={avatarSrc} alt='Dan DeWald avatar' />
      </div>
      <div className='flex flex-column justify-space-evenly sm-padding nametag-container'>
        <h3 className='nametag'>{nametag}</h3>
        <p className='block-quote'>{leadline}</p>
      </div>
    </div>
  );
};

export default Bio;
