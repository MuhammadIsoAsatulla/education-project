import React from 'react';
import { Composition } from 'remotion';
import { BeruniyVideo } from './BeruniyVideo.jsx';

export const Root = () => {
  return (
    <>
      <Composition
        id="BeruniyVideo"
        component={BeruniyVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
