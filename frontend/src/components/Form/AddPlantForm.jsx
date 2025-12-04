import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorPage from "../../pages/ErrorPage";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const AddPlantForm = () => {
  const { user } = useAuth();

  // useMutation hook useCase ( POST || PUT || PATCH || DELETE )
  // const mutation = useMutation({})
  const {
    isPending,
    isError,
    mutateAsync,
    reset: mutationReset,
  } = useMutation({
    mutationFn: async (payload) =>
      await axios.post(`${import.meta.env.VITE_API_URL}/plants`, payload),
    onSuccess: (data) => {
      console.log(data);
      // show toast
      toast.success("Plant added Successfully");
      // navigate to my inventory page
      mutationReset();
      // query key invalidate
    },
    onError: (error) => {
      console.log(error);
    },
    onMutate: (payload) => {
      console.log("I will post this data --->", payload);
    },
    onSettled: (data, error) => {
      if (data) console.log("I am from onSettled-->", data);
      if (error) console.log(error);
    },
    retry: 3,
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  console.log(errors);

  const onSubmit = async (data) => {
    const {
      plantName,
      plantDescription,
      plantQuantity,
      plantPrice,
      // plantImage,
      plantCategory,
    } = data;
    console.log("Selected image:", data.plantImage);

    const imageFile = data?.plantImage[0];
    try {
      const imageURL = await imageUpload(imageFile);
      const plantData = {
        plantImage: imageURL,
        plantName,
        plantDescription,
        quantity: Number(plantQuantity),
        price: Number(plantPrice),
        plantCategory,
        seller: {
          image: user?.photoURL,
          name: user?.displayName,
          email: user?.email,
        },
      };
      await mutateAsync(plantData);
      reset();
      // const { data } = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/plants`,
      //   plantData
      // );
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
    // console.log(data);
    // console.log(plantData);
    // console.table(plantData);
  };

  if (isPending) return <LoadingSpinner />;
  if (isError) return <ErrorPage />;

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-1 text-sm">
              <label htmlFor="name" className="block text-gray-600">
                Name
              </label>
              <input
                className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                id="name"
                type="text"
                placeholder="Plant Name"
                {...register("plantName", {
                  required: "Plant Name is Required",
                  maxLength: {
                    value: 20,
                    message: "Plant Name cannot be too long ",
                  },
                })}
                // name='name'
                // required
              />
              {errors.plantName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.plantName.message}
                </p>
              )}
            </div>
            {/* Category */}
            <div className="space-y-1 text-sm">
              <label htmlFor="category" className="block text-gray-600 ">
                Category
              </label>
              <select
                className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                {...register("plantCategory", {
                  required: "Plant Category is Required",
                })}
                // required
                // name="category"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Succulent">Succulent</option>
                <option value="Flowering">Flowering</option>
              </select>
              {errors.plantCategory && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.plantCategory.message}
                </p>
              )}
            </div>
            {/* Description */}
            <div className="space-y-1 text-sm">
              <label htmlFor="description" className="block text-gray-600">
                Description
              </label>

              <textarea
                id="description"
                placeholder="Write plant description here..."
                className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                // name="description"
                {...register("plantDescription", {
                  required: "Plant Description is Required",
                })}
              ></textarea>
              {errors.plantDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.plantDescription.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-6 flex flex-col">
            {/* Price & Quantity */}
            <div className="flex justify-between gap-2">
              {/* Price */}
              <div className="space-y-1 text-sm">
                <label htmlFor="price" className="block text-gray-600 ">
                  Price
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  id="price"
                  type="number"
                  placeholder="Price per unit"
                  {...register("plantPrice", {
                    required: "Plant Price is Required",
                    min: {
                      value: 0,
                      message: "Plant Price must be positive",
                    },
                  })}
                  // name="price"
                  // required
                />
                {errors.plantPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.plantPrice.message}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                  id="quantity"
                  type="number"
                  placeholder="Available quantity"
                  {...register("plantQuantity", {
                    required: "Plant Quantity is Required",
                    min: {
                      value: 0,
                      message: "Plant Quantity must be at least 1",
                    },
                  })}
                  // name="quantity"
                  // required
                />
                {errors.plantQuantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.plantQuantity.message}
                  </p>
                )}
              </div>
            </div>
            {/* Image */}
            <div className=" p-4  w-full  m-auto rounded-lg grow">
              <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                <div className="flex flex-col w-max mx-auto text-center">
                  <label>
                    <input
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      id="image"
                      accept="image/*"
                      {...register("plantImage", {
                        required: "Plant Image is Required",
                      })}
                      // name="image"
                      // hidden
                    />
                    {errors.plantImage && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.plantImage.message}
                      </p>
                    )}
                    <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                      Upload
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
            >
              {isPending ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPlantForm;
