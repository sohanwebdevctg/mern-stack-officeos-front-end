import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router";

const ErrorCom = () => {

  //Catching the error object from useRouteError
  const error = useRouteError();
  
  // navigation the user
  const navigation = useNavigate();
  const backPageBtn = () => {
    navigation(-1);
  };

  // logic to dynamically extract the error message
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // if this is React Router's own error response
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    // if this is normal javaScript
    errorMessage = error.message;
  } else if (typeof error === "string") {
    // if the error is only in string form
    errorMessage = error;
  } else {
    // default message if nothing is found
    errorMessage = "Unknown Error";
  }

  return (
    <>
    <div className="h-screen flex justify-center items-center bg-base-100">
      {/* content section start */}
      <div className="text-center space-y-4 p-4">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-red-500">
          Oops!
        </h1>
        <p className="text-base sm:text-xl md:text-2xl font-medium">
          Sorry, an unexpected error has occurred.
        </p>
        {/* error message start */}
        <p className="text-base sm:text-lg text-base-content/70 bg-base-200 px-4 py-2 rounded-lg inline-block my-2">
          <i>{errorMessage}</i>
        </p>
        {/* error message end */}
        <div>
          {/* button start */}
          <button 
            onClick={backPageBtn} 
            className="btn bg-red-500 hover:bg-red-600 border-none font-bold text-white px-6"
          >
            Back
          </button>
          {/* button end */}
        </div>
      </div>
      {/* content section end */}
    </div>
    </>

  );
};

export default ErrorCom;