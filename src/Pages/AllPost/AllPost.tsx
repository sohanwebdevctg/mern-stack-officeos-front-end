import { Link } from "react-router";


const AllPost = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5 border-b-red-500 border-b-2 pb-2">
        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-red-500 ">All Posts ({3})</h3>
        <Link to={`/createPost`}>
          <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-2 md:px-3 py-1 lg:py-5 sm:text-[10px] md:text-[12px] lg:text-[14px]">Create Post</button></Link>
      </div>
      {/* card start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card card-side bg-base-100 shadow-sm flex flex-col md:flex-row">
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            alt="Movie" className="h-40 md:h-48 lg:h-auto" />
        </figure>
          <div className="card-body">
            {/* user details start */}
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10">
                  <img src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                    alt="Avatar Tailwind CSS Component" />
                </div>
              </div>
              <div>
                <div className="font-bold text-[8px] md:text-[10px] lg:text-[11px] xl:text-[13px]">Hart Hagerty</div>
                <div className="text-sm opacity-50 text-[8px] md:text-[10px] lg:text-[11px] xl:text-[12px]">United States</div>
              </div>
            </div>
            {/* user details end */}
            {/* post details start */}
            <h2 className="card-title text-[12px] md:text-[13px] lg:text-[12px] xl:text-[15px]">New movie is released!</h2>
            <p className="text-[11px] md:text-[12px] lg:text-[11px] xl:text-[14px]">Click the button to watch on Jetflix app.</p>
            <div className="card-actions justify-end">
              {/* button start */}
              <Link to={`/updateSingleUser/1`}>
              <button className="btn btn-sm bg-green-500 border-none font-bold text-white px-4">Edit</button></Link>
              <button className="btn btn-sm bg-red-500 border-none font-bold text-white px-4">Delete</button>
              {/* button end */}
            </div>
            {/* post details end */}
          </div>
        </div>
      </div>
      {/* card end */}
    </div>
  );
};

export default AllPost;