import React from "react";
import { 
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/16/solid";

interface AccordionProps {
  title: string;
  open?: boolean;
  children: React.ReactNode;
  className?: string;
  bodyClass?: string;
}

const Accordion = ({ title, open = true, children, className="", bodyClass="" }: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(open);

  const toggle: any = (e: any)=> {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 w-full h-12 bg-whiten p-2">
        <p className="flex-1 font-bold text-black truncate">{title}</p>
        <button onClick={toggle} className="hover:text-primary duration-300 ease-linear">
          {(!isOpen) && <PlusIcon className="min-w-6 max-w-6 fill-current" />}
          {(isOpen) && <MinusIcon className="min-w-6 max-w-6 fill-current" />}
        </button>
      </div>
      <div className={`w-full ${(isOpen)? 'block' : 'hidden'} border-b-2 border-gray border-solid duration-300 ease-linear p-2 overflow-hidden ${bodyClass}`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
