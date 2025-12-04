import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const {
    data: plant = {},
    isLoading,
    // refetch,
  } = useQuery({
    queryKey: ["plant", id],
    queryFn: async () => {
      const result = await axios(
        `${import.meta.env.VITE_API_URL}/plants/${id}`
      );
      return result.data;
    },
  });

  const closeModal = () => {
    setIsOpen(false);
  };
  if (isLoading) return <LoadingSpinner />;

  const {
    plantName,
    plantImage,
    quantity,
    plantDescription,
    plantCategory,
    seller,
    price,
  } = plant || {};
  console.log(plant);
  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 flex-1">
          <div>
            <div className="w-full overflow-hidden rounded-xl">
              <img
                className="object-cover w-full"
                src={plantImage}
                // src="https://i.ibb.co/DDnw6j9/1738597899-golden-money-plant.jpg"
                alt="header image"
              />
            </div>
          </div>
        </div>
        <div className="md:gap-10 flex-1">
          {/* Plant Info */}
          <Heading title={plantName} subtitle={`Category: ${plantCategory}`} />
          <hr className="my-6" />
          <div
            className="
          text-lg font-light text-neutral-500"
          >
            {plantDescription}
            {/* Professionally deliver sticky testing procedures for next-generation
            portals. Objectively communicate just in time infrastructures
            before. */}
          </div>
          <hr className="my-6" />

          <div
            className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              "
          >
            <div>Seller: {seller?.name}</div>

            <img
              className="rounded-full"
              height="30"
              width="30"
              alt="Avatar"
              referrerPolicy="no-referrer"
              src={seller?.image}
              // src="https://lh3.googleusercontent.com/a/ACg8ocKUMU3XIX-JSUB80Gj_bYIWfYudpibgdwZE1xqmAGxHASgdvCZZ=s96-c"
            />
          </div>
          <hr className="my-6" />
          <div>
            <p
              className="
                gap-4 
                font-light
                text-neutral-500
              "
            >
              Quantity: {quantity} Units Left Only
            </p>
          </div>
          <hr className="my-6" />
          <div className="flex justify-between">
            <p className="font-bold text-3xl text-gray-500">Price: {price}$</p>
            <div>
              <Button onClick={() => setIsOpen(true)} label="Purchase" />
            </div>
          </div>
          <hr className="my-6" />

          <PurchaseModal
            plant={plant}
            closeModal={closeModal}
            isOpen={isOpen}
          />
        </div>
      </div>
    </Container>
  );
};

export default PlantDetails;
