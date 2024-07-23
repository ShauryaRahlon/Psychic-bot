import { Player } from '@lordicon/react';
const ICON = require('./assets/lock.json');
export default function playOnce() {
    const playerRef = useRef < Player > (null);
    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, [])
}