"use client";

import { TextArea } from "../../../components/text_area";

function SelectMenu({
  menuDescription,
  menuTitle,
  menuDefaultValue,
  menuOptions,
}) {
  return (
    <div>
      <label
        htmlFor={menuDescription}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {menuTitle}
      </label>
      <select
        id={menuDescription}
        name={menuDescription}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue={menuDefaultValue}
      >
        {menuOptions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export default function Page({ params }: { params: { productId: string } }) {
  const productId = params.productId;

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-xl">Post Review</h1>
      <form className="w-full mt-6">
        <TextArea />
        <div className="mt-6 flex flex-col w-8/12 justify-center mx-auto">
          <div className="">
            <SelectMenu
              menuDescription="rating"
              menuTitle="Rating"
              menuDefaultValue="5"
              menuOptions={["1", "2", "3", "4", "5"]}
            />
          </div>
          <div className="">
            <SelectMenu
              menuDescription="decentralizedStorage"
              menuTitle="Decentralized Storage"
              menuDefaultValue="Arweave"
              menuOptions={["Arweave", "Filecoin"]}
            />
          </div>
        </div>
        <div className="flex w-8/12 justify-end mx-auto mt-3">
          {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
          <button
            type="submit"
            className="rounded-md w-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Post Review
          </button>
        </div>
      </form>
    </div>
  );
}