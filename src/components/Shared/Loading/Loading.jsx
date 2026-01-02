import React from 'react';
import { CircleLoader, DotLoader, PuffLoader, RingLoader } from 'react-spinners';


const Loading = () => {
    return (
        <div className='min-h-screen flex justify-center items-center'>
            {/* <CircleLoader color='#0000ff' /> */}
            <PuffLoader />
            {/* <RingLoader color='#0000ff' /> */}
        </div>
    );
};

export default Loading;