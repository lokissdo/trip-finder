import { useRef, useImperativeHandle, forwardRef } from 'react';

type CheckboxProps = {
  id: string;
  label: string;
};

type CheckboxGroupProps = {
  checkboxes: CheckboxProps[];
};

const CheckboxGroup = forwardRef<{ getValues: () => { [key: string]: boolean } }, CheckboxGroupProps>(
  ({ checkboxes }, ref) => {
    const refs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useImperativeHandle(ref, () => ({
      getValues: () => {
        const values: { [key: string]: boolean } = {};
        for (const key in refs.current) {
          if (refs.current[key]) {
            values[key] = refs.current[key]!.checked;
          }
        }
        return values;
      }
    }));

    return (
      <div className='flex flex-wrap gap-1 justify-between'>
        {checkboxes.map((checkbox) => (
          <div className="inline-flex items-center" key={checkbox.id}>
            <label
              className="relative flex items-center p-3 rounded-full cursor-pointer"
              htmlFor={checkbox.id}
              data-ripple-dark="true"
            >
              <input
                id={checkbox.id}
                type="checkbox"
                ref={(el) => (refs.current[checkbox.id] = el)}
                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
              />
              <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </label>
            <label
              className="mt-px font-light text-gray-700 cursor-pointer select-none"
              htmlFor={checkbox.id}
            >
              {checkbox.label}
            </label>
          </div>
        ))}
      </div>
    );
  }
);

export default CheckboxGroup;
