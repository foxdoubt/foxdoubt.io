import React from 'react';
import avatar from '../../images/icons/dewald-avatar.svg';

const Bio = ({ nametag, leadline, avatarSrc = avatar }) => {
  return (
    <div className='flex profile sm-margin-sides'>
      <div className='avatar-container'>
        <div className='aspect-ratio-container-33-35 bg-desert-sky-dusk'>
          <img className='avatar' src={avatar} alt='Dan DeWald avatar' />
        </div>
      </div>
      <div className='flex-2-tablet nametag-container'>
        <h3 className='nametag'>{nametag}</h3>
        <p className='block-quote'>{leadline}</p>
      </div>
    </div>
  );
};

export default Bio;
