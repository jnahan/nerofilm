import { Link } from "react-router-dom";
import { useFrame, useFrameUpdate } from "../../hooks/FrameContext";
import Frame from "../../components/Frame/Frame";
import BackHeader from "../../components/BackHeader/BackHeader";
import "./index.css";
import useRefreshWarning from "../../hooks/useRefreshWarning";
import { playClickSound } from "../../utils/soundUtils";
import { useEffect } from "react";
import { defaultFrame } from "../../constants/frames";
import { useRef } from "react";
import Unsplash from "../../components/Unsplash/Unsplash";

function SelectFrame() {
  const options = ["original", "wide"];

  const frame = useFrame();
  const setFrame = useFrameUpdate();
  useRefreshWarning();
  const frameMounted = useRef(false);

  const handleSelectLayout = (layout) => {
    playClickSound();
    setFrame({ ...frame, layout });
  };

  useEffect(() => {
    if (!frameMounted.current) {
      setFrame(defaultFrame);
      frameMounted.current = true;
    }
  }, [setFrame]);

  return (
    <div>
      <BackHeader />
      <Unsplash />
      <section className="options-c">
        <h1>Select Frame Layout</h1>
        <div className="options-r">
          <ul className="frame-options">
            {options.map((option, key) => (
              <li key={key} onClick={() => handleSelectLayout(option)}>
                <div
                  className={
                    frame.layout == option ? "frame-selected" : "frame"
                  }
                >
                  <Frame
                    images={frame.images}
                    filter={frame.filter}
                    layout={option}
                    color={frame.color}
                  />
                </div>
                <p className="frame-desc">4 Cut Original</p>
              </li>
            ))}
          </ul>
        </div>
        <Link className="btn" to="/try-it" role="button">
          Camera
        </Link>
      </section>
    </div>
  );
}

export default SelectFrame;
