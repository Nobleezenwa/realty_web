import React from "react";
import ClickOutside from "../ClickOutside";
  
type ContextMenuProps = {
    trigger: any;
    open?: boolean;
    items: {label: string, action: ()=>void}[];
}
  
const ContextMenu: React.FC<ContextMenuProps> = ({ trigger, items, open = false }) => {
    const [menuOpen, setMenuOpen] = React.useState<boolean>(open);
    const [menuStyle, setMenuStyle] = React.useState<any>({});
    
    React.useEffect(()=> {
        setMenuOpen(open);
    }, [open]);

    const triggerRef = React.useRef<any>(null);

    const showMenu = (event: any)=> {
        if (!triggerRef.current) return;
        event.preventDefault();
        let menuPosition = {x: 0, y: 0}, menuDimension = {x: 0, y: 0};
        menuDimension.x = 120;
        var h = items.length * 30;
        h = (h > (window.innerHeight*0.5))? (window.innerHeight * 0.5) : h;
        menuDimension.y = h;
        if (event.pageX + menuDimension.x > window.innerWidth) {
            menuPosition.x = event.pageX - menuDimension.x;
        } else {
            menuPosition.x = event.pageX;
        }
        if (event.pageY + menuDimension.y > window.innerHeight) {
            menuPosition.y = event.pageY - menuDimension.y;
        } else {
            menuPosition.y = event.pageY;
        }
        setMenuStyle({
            top: menuPosition.y + 'px',
            left: menuPosition.x + 'px',
        });
        setMenuOpen(true);
    };
  
    return(
        <div>
            <ClickOutside onClick={() => setMenuOpen(false)} className="relative">
            <div className="relative">
                {
                    React.cloneElement(trigger, {
                        ...trigger.props,
                        ref: triggerRef,
                        onClick: showMenu,
                        onContextMenu: showMenu
                    })
                }

                {menuOpen &&
                    <div style={menuStyle} className="flex flex-col gap-2 fixed inline-block min-w-[120px] p-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        {
                            items.map((item: any, index: number)=>(
                                <button key={index} onClick={()=>{ setMenuOpen(false); item.action();}} className="w-full h-[30px] truncate text-black hover:text-primary text-center">{item.label}</button>
                            ))
                        }
                    </div>
                }
            </div>
            </ClickOutside>
        </div>
    );
};
  
export default ContextMenu;
  