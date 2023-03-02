import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

const ReviewModal = ({ movieName, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      movieName: `${movieName}`,
    },
  });
  const onSubmit = async (data) => {
    console.log(data);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const review = await res.json();

      reset();
      toast.success("Review created successfully");
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <Toaster />
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        />
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              className="text-lg font-medium leading-6 text-gray-900"
              id="modal-headline"
            >
              Add Review
            </h3>
            <div className="mt-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    className="shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Movie / TV Show Name"
                    type="text"
                    value={movieName}
                    {...register("movieName")}
                    disabled
                  />
                  <input
                    className="mt-2 shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Write a review here..."
                    type="text"
                    {...register("description")}
                  />
                  <input
                    className="mt-2 shadow-sm focus:ring-rose-500 focus:border-rose-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Rating"
                    type="number"
                    {...register("rating", {
                      min: 1,
                      max: 5,
                      required: true,
                    })}
                  />
                  {errors.rating && <span>This field is required</span>}
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
