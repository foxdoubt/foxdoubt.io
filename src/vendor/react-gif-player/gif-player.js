import React from 'react';

const GifPlayer = ({
  gif,
  containerClasses,
  still,
  playing,
  toggle,
  ...rest
}) => (
  <div className={`gif_player ${containerClasses}`} onClick={toggle}>
    <div className={`play_button${playing ? ' playing' : ''}`} />
    <img {...rest} src={playing ? gif || still : still || gif} alt='gif' />
  </div>
);

export default GifPlayer;
