import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import Link from "next/link";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

import { getTrendingProducts, ProductMap } from "../api/fwbfestProducts";
import { Review } from "../types/types";
import { GET_ALL_REVIEWS } from "../graphql/reviews_queries";

import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Homepage_Trending() {
  const { chain } = useNetwork();
  const [products, setProducts] = useState<ProductMap[]>([]);

  useEffect(() => {
    // const chainId = chain?.id || 137;
    // chainId hardcoded to 137 (Polygon Mainnet) for now until more chains accepted.
    const chainId = 137;
    setProducts(getTrendingProducts(chainId));
  }, [chain]);

  const { loading, error, data: allReviews } = useQuery(GET_ALL_REVIEWS);
  const [allReviewsByAddress, setAllReviewsByAddress] = useState<{
    [address: string]: Review[];
  }>({});
  const [updatedReviewsByAddress, setUpdatedReviewsByAddress] = useState<{
    [address: string]: Review[];
  }>({});
  const [addressToAverageRating, setAddressToAverageRating] = useState<{
    [address: string]: number;
  }>({});

  useEffect(() => {
    if (allReviews) {
      const mappingOfReviewsByAddress: { [address: string]: Review[] } = {};
      allReviews.addedReviews.forEach((review: Review) => {
        if (mappingOfReviewsByAddress[review.existingReviewableAddress]) {
          const existingReviews =
            mappingOfReviewsByAddress[review.existingReviewableAddress];
          const hasReviewFromSameReviewer = existingReviews.some(
            (existingReview: Review) =>
              existingReview.reviewer === review.reviewer
          );
          if (!hasReviewFromSameReviewer) {
            existingReviews.push(review);
          }
        } else {
          mappingOfReviewsByAddress[review.existingReviewableAddress] = [
            review
          ];
        }
      });
      setAllReviewsByAddress(mappingOfReviewsByAddress);
    }
  }, [allReviews]);

  useEffect(() => {
    const fetchRatingsAndUpdateReviews = async () => {
      if (allReviewsByAddress) {
        const updatedReviewsByAddress: { [address: string]: Review[] } = {};
        for (const address of Object.keys(allReviewsByAddress)) {
          updatedReviewsByAddress[address] = [];
          for (const review of allReviewsByAddress[address]) {
            let tempReview = { ...review };
            if (review._reviewDecentralizedStorageURL) {
              try {
                const response = await fetch(
                  review._reviewDecentralizedStorageURL
                );
                const textContent = await response.text();
                let modifiedTextContent = textContent.split("[reviewContent]");
                modifiedTextContent = modifiedTextContent[1].split("[rating]");
                tempReview.rating = Number(modifiedTextContent[1]);
              } catch (e) {
                console.error(e);
              }
            }
            updatedReviewsByAddress[address].push(tempReview);
          }
        }
        setUpdatedReviewsByAddress(updatedReviewsByAddress);
      }
    };

    fetchRatingsAndUpdateReviews();
  }, [allReviewsByAddress]);

  useEffect(() => {
    if (updatedReviewsByAddress) {
      const addressToAverageRating: { [address: string]: number } = {};
      Object.keys(updatedReviewsByAddress).forEach((address) => {
        const reviews = updatedReviewsByAddress[address];
        let totalRating = 0;
        for (let i = 0; i < reviews.length; i++) {
          totalRating += reviews[i].rating || 0;
        }
        const averageRating = totalRating / reviews.length;
        addressToAverageRating[address] = averageRating;
      });
      setAddressToAverageRating(addressToAverageRating);
    }
  }, [updatedReviewsByAddress]);

  return (
    <div className="w-full">
      <div className="py-8 sm:py-12 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div className="relative mt-8">
          <div className="relative -mb-6 w-full overflow-x-auto pb-6">
            <ul
              role="list"
              className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:space-x-0"
            >
              {products?.map((product) => (
                <li
                  key={product.id}
                  className="inline-flex w-64 flex-col text-center lg:w-auto"
                >
                  <div className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={product.imageSrc}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <div className="mt-6">
                      <h3 className="mt-1 font-semibold text-gray-900">
                        <Link href={"product/" + product.contractAddress}>
                          <span className="absolute inset-0" />
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-gray-900">
                        {allReviewsByAddress[product.contractAddress]?.length}{" "}
                        reviews
                      </p>
                      <div className="flex justify-center mt-2 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              addressToAverageRating[product.contractAddress] >
                                rating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "h-5 w-5 flex-shrink-0"
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
