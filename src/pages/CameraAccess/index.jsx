import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam"; 
import { useFrame, useFrameUpdate } from "../../hooks/FrameContext"; 
import WhiteBackArrow from "../../assets/WhiteBackArrow.png";
import Camera from "../../assets/Camera.png";
import CameraDisabled from "../../assets/CameraDisabled.png";
import Shutter from "../../assets/Shutter.png";
import ShutterSound from "../../assets/sounds/CamShutter.wav";  
import "./index.css";
import useRefreshWarning from "../../hooks/useRefreshWarning";

const CameraAccess = () => {
  useRefreshWarning();
  
  const navigate = useNavigate();
  const frame = useFrame();
  const setFrame = useFrameUpdate();
  
  const shutterAudio = useRef(new Audio(ShutterSound)); 

  const [cameraPermission, setCameraPermission] = useState(null);
  const [isShooting, setIsShooting] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [showPhotoCount, setShowPhotoCount] = useState(false);
  const [flash, setFlash] = useState(false); 
  const [countdown, setCountdown] = useState(null);

  const webcamRef = useRef(null); 

  useEffect(() => {
    setCameraPermission(true); 
  }, []);

  const takePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      shutterAudio.current.currentTime = 0;
      shutterAudio.current.play().catch(error => console.log("Audio play failed:", error));

      setFlash(true);
      setTimeout(() => setFlash(false), 200); 
  
      setFrame((prevFrame) => {
        const updatedPhotos = [...prevFrame.images, imageSrc].slice(-8);
        return { ...prevFrame, images: updatedPhotos };
      });
  
      setPhotoCount((prevCount) => prevCount + 1);
    }
  };

  const startCountdown = (count, callback) => {
    if (count === 0) {
      callback();
      return;
    }
    setCountdown(count);
    setTimeout(() => startCountdown(count - 1, callback), 1000);
  };

  const startPhotoSequence = () => {
    if (isShooting) return;
    setIsShooting(true);
    setPhotoCount(0);
    setShowPhotoCount(true);
    let count = 8;

    const takeNextPhoto = () => {
      if (count === 0) {
        setIsShooting(false);
        setCountdown(null);
        navigate("/select-photos"); 
        return;
      }
      startCountdown(3, () => {
        takePhoto();
        count--;
        setTimeout(takeNextPhoto, 500);
      });
    };

    takeNextPhoto();
  };

  return (
    <div className={`camera-page ${frame.layout === "wide" ? "wide-mode" : "original-mode"}`}>
      <button className="back-button" onClick={() => navigate("/select-frame")}>
        <img src={WhiteBackArrow} alt="Back" className="back-arrow" />
      </button>

      {cameraPermission === null && (
        <div className="camera-access-message">
          <img src={Camera} alt="Camera" className="camera-image" />
          <h2>Allow Camera Access</h2>
          <p>To take your photo, allow camera access.</p>
        </div>
      )}

      {cameraPermission === false && (
        <div className="camera-access-message">
          <img src={CameraDisabled} alt="Camera Disabled" className="camera-image" />
          <h2>Camera Access Disabled</h2>
          <p>Please enable camera access in your browser settings.</p>
        </div>
      )}

      {cameraPermission === true && (
        <>
          {!showPhotoCount ? (
            <h2 className="instructions">Click to start taking photos</h2>
          ) : (
            <div className="count-display">{photoCount}/8</div>
          )}

          <div className="camera-container">

            <div className={`camera-preview-screen ${frame.layout}`}>
              {flash && <div className="flash-overlay"></div>}
              <Webcam
                className="webcam"
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
                mirrored={true}
                videoConstraints={{
                  facingMode: "user",
                  aspectRatio: frame.layout === "wide" ? 9 / 16 : 16 / 9,
                }}
              />
            </div>
          </div>

          {/* shutter & countdown */}
          <div className="shutter">
            {countdown !== null && <div className="countdown-timer">{countdown}</div>}
            <button className="shutter-button" onClick={startPhotoSequence} disabled={isShooting}>
              <img src={Shutter} alt="Shutter" className="shutter-icon" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraAccess;
