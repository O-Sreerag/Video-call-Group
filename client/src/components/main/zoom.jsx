import { useMediaStream } from '../../context/mediaStreamContext';
import ReactPlayer from 'react-player';

const Zoom = () => {
    const { myStream, getMediaStream } = useMediaStream();

    return (
        <div className="grid p-4">
            <div className="rounded-md bg-yellow-200  max-h-[50%] overflow-hidden">
                {
                    myStream && <ReactPlayer
                        url={myStream}
                        playing
                        muted
                        width="100%"
                        height="100%"
                    />
                }
            </div>
        </div>
    )
}

export default Zoom