import { useState, FC } from 'react';


type SwitcherOneProps = {
  id?: string;
  name?: string;
  enabled?: boolean;
  onChange?: (e: any, value: boolean)=>any;
};

const SwitcherOne: FC<SwitcherOneProps> = ({id, name, enabled: _enabled, onChange}) => {
  let enabled: any, setEnabled: any;

  if (typeof _enabled === 'undefined') {
    [enabled, setEnabled] = useState<boolean>(false);
  } else {
    enabled = _enabled;
  }

  return (
    <div>
      <label
        htmlFor="toggle1"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            id={id? id : "toggle1"}
            name={name}
            type="checkbox"
            className="sr-only"
            onChange={(e) => {
              if (setEnabled) setEnabled(!enabled);
              if (onChange) onChange(e, !enabled);
            }}
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              enabled && '!right-1 !translate-x-full !bg-primary dark:!bg-white'
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherOne;
