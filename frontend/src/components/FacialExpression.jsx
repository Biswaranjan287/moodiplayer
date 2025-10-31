import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './FacialExpression.css';
import axios from 'axios';

export default function FacialExpression({ setSongs }) {
    const videoRef = useRef();

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error("Error accessing webcam: ", err));
    };

    async function detectMood() {
        const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        let mostProableExpression = 0
        let _expression = ""

        if (!detections || detections.length === 0) {
            console.log("No faces detected")
            return
        }

        for (const expression of Object.keys(detections[0].expressions)) {
            if (detections[0].expressions[expression] > mostProableExpression) {
                mostProableExpression = detections[0].expressions[expression]
                _expression = expression
            }
        }
        axios.get(`http://localhost:3000/songs?mood=${_expression}`)
        .then(response =>{
            console.log(response.data)
            setSongs(response.data.songs)
        })
    }

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        };

        loadModels().then(startVideo);

    }, []);

    return (
        <div className='mood-container'>
            <div className='mood-element'>
                <div className='video-container'>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className='user-video-feed'
                    />
                    <div className='video-overlay'>
                        <div className='pulse-ring'></div>
                    </div>
                </div>
                <div className='controls'>
                    <button className='detect-button' onClick={detectMood}>
                        <span className='button-icon'>🎭</span>
                        Detect My Mood
                    </button>
                    <p className='helper-text'>Click to analyze your facial expression and get mood-based songs</p>
                </div>
            </div>
        </div>
    );
}
