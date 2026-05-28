import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Sequence, Img, staticFile } from 'remotion';

const TextSegment = ({ text, startFrame, duration }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  const fadeInDuration = 20;
  const fadeOutDuration = 20;

  const opacity = interpolate(
    relativeFrame,
    [0, fadeInDuration, duration - fadeOutDuration, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    relativeFrame,
    [0, fadeInDuration],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
        maxWidth: '80%',
        padding: '30px 50px',
        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.85), rgba(101, 67, 33, 0.85))',
        borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(218, 165, 32, 0.3)',
      }}
    >
      <p
        style={{
          fontSize: '38px',
          fontWeight: '600',
          color: '#FFF8DC',
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
          lineHeight: '1.6',
          margin: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        {text}
      </p>
    </div>
  );
};

export const BeruniyVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoom = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.3],
    { extrapolateRight: 'clamp' }
  );

  const panX = interpolate(
    frame,
    [0, durationInFrames],
    [0, -5],
    { extrapolateRight: 'clamp' }
  );

  const panY = interpolate(
    frame,
    [0, durationInFrames],
    [0, -3],
    { extrapolateRight: 'clamp' }
  );

  const overlayOpacity = interpolate(
    frame,
    [0, 30],
    [1, 0.3],
    { extrapolateRight: 'clamp' }
  );

  const narrationSegments = [
    { text: "Men Abu Rayhon Beruniyman. Men Xorazm zaminida tug'ilganman.", start: 60, duration: 150 },
    { text: "Hayotimni ilm-fanga bag'ishladim.", start: 230, duration: 120 },
    { text: "Astronomiya, matematika, geografiya va tarix sohalarida tadqiqotlar olib bordim.", start: 370, duration: 150 },
    { text: "Yerning o'lchamini hisoblashga harakat qildim, yulduzlarni kuzatdim va turli xalqlarning madaniyatini o'rgandim.", start: 540, duration: 180 },
    { text: "Ilm insoniyatni yuksaltiradi deb ishonaman. Bilim izlash — eng buyuk yo'ldir.", start: 740, duration: 150 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a0f0a' }}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.3) 0%, rgba(26, 15, 10, 0.9) 70%)',
        }}
      />

      <AbsoluteFill
        style={{
          transform: `scale(${zoom}) translate(${panX}%, ${panY}%)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile("image.png")}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85) contrast(1.1) saturate(1.2)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(218, 165, 32, 0.15) 0%, transparent 30%, transparent 70%, rgba(26, 15, 10, 0.8) 100%)',
          opacity: overlayOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 150px rgba(0, 0, 0, 0.6)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(frame, [0, 40, 860, 900], [0, 1, 1, 0]),
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#DAA520',
            textShadow: '3px 3px 10px rgba(0, 0, 0, 0.8)',
            margin: 0,
            fontFamily: 'Georgia, serif',
            letterSpacing: '2px',
          }}
        >
          ABU RAYHON BERUNIY
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#FFF8DC',
            textAlign: 'center',
            marginTop: '10px',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            fontFamily: 'Georgia, serif',
          }}
        >
          973-1048
        </p>
      </div>

      {narrationSegments.map((segment, index) => (
        <Sequence key={index} from={segment.start} durationInFrames={segment.duration}>
          <TextSegment text={segment.text} startFrame={segment.start} duration={segment.duration} />
        </Sequence>
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: '3%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(frame, [860, 900], [0, 1]),
        }}
      >
        <p
          style={{
            fontSize: '22px',
            color: '#DAA520',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          MEROS — Raqamli Madaniy Meros Platformasi
        </p>
      </div>
    </AbsoluteFill>
  );
};
