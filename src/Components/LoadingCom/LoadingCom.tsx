

const LoadingCom = () => {
  return (
    <div  className='flex justify-center items-center h-screen'>
      {/* content section start */}
      <div className='text-center flex items-center'>
        <p className='text-black text-4xl sm:text-6xl md:text-9xl'>L</p>
        <div className='border-dashed p-3 sm:p-6 md:p-10 rounded-full border-red-600 border-4 sm:border-4 md:border-8 animate-spin'></div>
        <p className='text-black text-4xl sm:text-6xl md:text-9xl'>ADING</p>
      </div>
      {/* content section end */}
    </div>
  );
};

export default LoadingCom;