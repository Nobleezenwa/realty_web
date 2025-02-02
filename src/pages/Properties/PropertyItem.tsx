import React from 'react';
import { MapPinIcon } from "@heroicons/react/16/solid"
import config from '../../data/config';
import { shortenNumber } from '../../utils/shortenNumber';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import ContextMenu from '../../components/ContextMenu';

interface PropertyItemProps {
    data: any,
    viewProperty: (property_id: number|string)=> void,
    editProperty: false|((property_id: number|string)=> void),
    deleteProperty: (property_id: number|string)=> void,
    shareProperty: (property_id: number|string)=> void,
}
  
const PropertyItem: React.FC<PropertyItemProps> = ({data, viewProperty, editProperty, deleteProperty, shareProperty}) => {
    const {id, display_image, name, short_description, address, price} = data;
    
    const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

    return (
        <div className="cursor-pointer min-w-80 max-w-80 overflow-hidden">
            <div onClick={()=>viewProperty(id)} onContextMenu={()=>setMenuOpen(true)} className="w-full h-[240px] overflow-hidden bg-white">
                <img className="min-w-full min-h-full rounded-t" src={`${config.storagePath}/${display_image}`} alt={name} />
            </div>
            <div className="relative h-[120px] bg-white rounded-b shadow-md">
                <div onClick={()=>viewProperty(id)} onContextMenu={()=>setMenuOpen(true)} className="flex justify-between mb-3 p-2">
                    <span className="font-bold text-primary">{name} - {short_description}</span>
                    <span className="min-w-[100px] text-right font-bold text-primary text-2xl" dangerouslySetInnerHTML={{ __html: "&#8358;" + shortenNumber(price) }}></span>
                </div>
                <div className="absolute bottom-0 w-full flex items-center justify-between gap-2 p-2">
                    <div className="flex gap-1">
                        <MapPinIcon className="min-w-6 min-h-6 max-w-6 max-h-6 text-primaryfilm" />
                        <span className="text-sm text-primaryfilm">{address}</span>
                    </div>
                    <ContextMenu
                        open={menuOpen}
                        trigger={
                            <button className="text-primary hover:text-default">
                                <EllipsisVerticalIcon className="min-w-5 max-w-5 fill-current" />
                            </button>
                        }
                        items={[
                            {label: 'View', action: ()=>viewProperty(id) },
                            ...((editProperty)? [{label: 'Edit', action: ()=>editProperty(id) }] : []),
                            {label: 'Share', action: ()=>shareProperty(id) }
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default PropertyItem;