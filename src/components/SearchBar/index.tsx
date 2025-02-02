import React from "react";
import ClickOutside from "../ClickOutside";
  
type SearchBarProps = {
    value?: string;
    className?: string;
    responsive?: boolean;
    disabled?: boolean;
    searchFn: (query: string)=> Promise<any[]>|any[]|undefined|false;
}
  
const SearchBar: React.FC<SearchBarProps> = ({ 
    value = "", 
    className = "", 
    responsive = false, 
    disabled = false, 
    searchFn 
}) => {
    const [query, setQuery] = React.useState<any>(value); 
    const [searchResult, setSearchResult] = React.useState<any>([]); 
    const [showSpinner, setShowSpinner] = React.useState<boolean>(false); 

    const SearchBarRef = React.useRef<any>(null);

    const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
    const [dropdownStyle, setDropdownStyle] = React.useState<any>({});

    const searchTimerRef = React.useRef<any>(null);

    const handleInputChange = (event: any) => {
        const { value } = event.target;
        setQuery(value);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        if (value.trim() != "") {
            searchTimerRef.current = setTimeout(async ()=> {
                setShowSpinner(true);
                const result = await searchFn(value);

                if (SearchBarRef.current) {
                    const rect = SearchBarRef.current.getBoundingClientRect();
                    if (window.innerHeight - rect.bottom >= 250) {
                        setDropdownStyle({top: '100%'}); //open below
                    } else {
                        setDropdownStyle({bottom: '100%'}); //open above
                    }
                }
                setDropdownOpen(true);

                setSearchResult(result);

                setShowSpinner(false);
            }, 1500);
        }
    };
  
    return(
        <div ref={SearchBarRef} className={className}>
            <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <div className="relative flex item-center justify-between sm:gap-4">

                <button className={(responsive? "hidden sm:block" : "block")}>
                    <svg
                        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                        fill=""
                        />
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                        fill=""
                        />
                    </svg>
                </button>

                <input
                    disabled={disabled}
                    type="text"
                    placeholder="Type to search..."
                    value={query}
                    onChange={handleInputChange}
                    className={"flex-1 w-full bg-transparent text-black focus:outline-none dark:text-white xl:w-125"}
                />

                {showSpinner &&
                    <div className="min-h-4 min-w-4 max-h-4 max-w-4 mt-1 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                }

                {dropdownOpen &&
                    <div style={dropdownStyle} className="flex flex-col gap-2 absolute w-[110%] min-h-[70px] max-h-[250px] p-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {
                           (searchResult && searchResult.length > 0) &&
                            searchResult.map((r: any, index: number)=>(
                                <button key={index} onClick={()=>{ setQuery(r.label); setDropdownOpen(false); r.action();}} className="w-full truncate font-bold text-black hover:text-primary text-left p-1 border-b border-solid border-gray ">{r.label}</button>
                            ))
                        }
                        {
                            (!searchResult || searchResult.length == 0) &&
                            <p className="w-full truncate text-center py-4">No results found.</p>
                        }
                    </div>
                }
            </div>
            </ClickOutside>
        </div>
    );
};
  
export default SearchBar;
  