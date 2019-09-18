import React from 'react';
import avatar from '../../images/icons/dewald-avatar.svg';

const Bio = ({ nametag, leadline }) => {
  return (
    <div className='flex profile'>
      <div className='avatar-container iceblue-container'>
        <img className='avatar' src={avatar} alt='Dan DeWald avatar' />
      </div>
      <div className='flex flex-column justify-space-evenly nametag-container'>
        <h3 className='nametag center'>{nametag}</h3>
        <p className='block-quote'>{leadline}</p>
      </div>
    </div>
  );
};

export default Bio;
