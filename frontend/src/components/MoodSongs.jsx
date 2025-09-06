import { useState } from "react"
import './MoodSongs.css'

const MoodSongs = ({ Songs }) => {

    const [isPlaying, setIsPlaying] = useState(null)

    const handlePlayPause = (index) => {
        if (isPlaying === index) {
            setIsPlaying(null)
        } else {
            setIsPlaying(index)
        }
    }


    return (
        <div className="mood-songs">
            <h2>Recommended Songs</h2>
            {Songs.map((song, index) => (
                <div className="song" key={index}>
                    <div className="title">
                        <h3>{song.title}</h3>
                        <p>{song.artist}</p>
                    </div>
                    <div className="play-pause-button">
                        {
                            isPlaying === index &&
                            <audio
                                src={song.audio} style={{
                                    display: "none"
                                }}
                                autoPlay={isPlaying === index}
                            >
                            </audio>
                        }
                        <button onClick={() => handlePlayPause(index)}>
                            {
                                isPlaying === index ?
                                    <i className="ri-pause-line"></i>
                                    :
                                    <i className="ri-play-circle-fill"></i>
                            }
                        </button>

                    </div>
                </div>
            ))}
        </div>
    )
}

export default MoodSongs