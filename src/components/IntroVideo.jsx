import React, { forwardRef } from "react";

/* Full-screen intro film that plays behind the church doors as they open.
   Replace /public/intro.mp4 with your AI-generated video. */
const IntroVideo = forwardRef(function IntroVideo({ src, show, fading, skipLabel, onEnd, onSkip, onReady, onFail }, ref) {
  return (
    <div className={`intro-video ${show ? "show" : ""} ${fading ? "fading" : ""}`}>
      <video
        ref={ref}
        src={src}
        poster="/images/bg.jpg"
        playsInline
        preload="auto"
        onLoadedData={onReady}
        onError={onFail}
        onEnded={onEnd}
      />
      {show && !fading && <button className="skip" onClick={onSkip}>{skipLabel} ›</button>}
    </div>
  );
});
export default IntroVideo;
