import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const publishingOptions = [
  {
    title: "Public review",
    // description: "This review is public and can be viewed by anyone.",
    current: true
  },
  {
    title: "Hide my review (Coming Soon)",
    // description: "This review is private but the reviewer's details are public.",
    current: false
  },
  {
    title: "Hide my identity (Coming Soon)",
    // description: "This review is public but the reviewer's details are private.",
    current: false
  },
  {
    title: "Hide my review and identity (Coming Soon)",
    // description: "This review is private and cannot be viewed by anyone.",
    current: false
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DetailedSelectMenu() {
  const [selected, setSelected] = useState(publishingOptions[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">
            Change published status
          </Listbox.Label>
          <div className="relative">
            <div className="inline-flex divide-x divide-gray-700 rounded-md shadow-sm">
              <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-gray-600 px-3 py-2 text-white shadow-sm">
                <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                <p className="text-sm font-semibold">{selected.title}</p>
              </div>
              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-gray-600 p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                <span className="sr-only">Change published status</span>
                <ChevronDownIcon
                  className="h-5 w-5 text-white"
                  aria-hidden="true"
                />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {publishingOptions.map((option, optionIdx) => (
                  <Listbox.Option
                    disabled={optionIdx > 0}
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active
                          ? "bg-gray-600 text-white"
                          : optionIdx <= 0
                          ? "text-gray-900"
                          : "text-gray-400",
                        "cursor-default select-none p-4 text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p
                            className={
                              selected ? "font-semibold" : "font-normal"
                            }
                          >
                            {option.title}
                          </p>
                          {selected ? (
                            <span
                              className={
                                active ? "text-white" : "text-gray-600"
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={classNames(
                            active
                              ? "text-gray-200"
                              : optionIdx <= 0
                              ? "text-gray-500"
                              : "text-gray-300",
                            "mt-2"
                          )}
                        >
                          {option.description}
                        </p>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
