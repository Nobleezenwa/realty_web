import React from 'react';
import { 
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";
import { request } from '../../utils/request';
import { toast } from "react-toastify";
import config from '../../data/config';
import PropertyItem from "./PropertyItem"
import PropertyDialog from './PropertyDialog';
import ConfirmationDialog from '../../components/Dialog/ConfirmationDialog';
import {  
    useDashboardController,
    setBusy,
} from '../../context'
  
interface PropertyGroupProps {
    id: string, 
    name: string, 
    description: string, 
    editCategory: (category_id: number|string)=> void,
    deleteCategory: (category_id: number|string)=> void,
};
  
const PropertyGroup: React.FC<PropertyGroupProps> = ({id, name, description, editCategory, deleteCategory}) => {
    const [controller, dispatch] = useDashboardController();
    const { userSession, signal } = controller;

    const [properties, setProperties] = React.useState<any>([]);

    const [showPropertyDialog, setShowPropertyDialog] = React.useState<any>(false);

    const [confirmation, setConfirmation] = React.useState<any>(false);

    const load = async ()=> {
        //console.log(config.backend + `/api/properties/${id}`);
        await request({
            method: 'GET',
            url: config.backend + `/api/properties/${id}`,
            callback: (res) => {
                setProperties((prev: any[]) => ([...res.data]));
                //console.log(res);
            },
            onError: (err) => toast(err.message)
        });
    };
    
    React.useEffect(() => {
        load();
    }, []);

    const addToCategory = (category_id: any) => {
        setShowPropertyDialog({
            data: {category_id},
            mode: 'edit',
            share: false,
        });
    };

    const shareProperty = async (property_id: any)=> {
        const property = properties.find((p: any) => p.id == property_id);
        var shareInfo = {
            title: property.name + ' - ' + property.shortDescription + ' - ' + config.appName,
            text: "Check out " + property.name + ' - ' + property.short_description,
            url: config.frontend + '/properties/' + property_id + '?ref=' + userSession.id,
        };
        try {
            await navigator.share(shareInfo);
        } catch (err) {
            navigator.clipboard.writeText(shareInfo.text+'\n'+shareInfo.url);
            toast('Share link copied to clipboard.');
        }
    };

    const viewProperty = (property: any)=> {
        setShowPropertyDialog({
            data: (typeof property === 'object')? property : properties.find((p: any) => p.id == property),
            mode: 'view',
            share: (typeof property === 'object')? ()=>shareProperty(property.id) : ()=>shareProperty(property)
        });
    };

    const editProperty = (userSession.as == 'admin')? (property_id: any)=> {
        setShowPropertyDialog({
            data: properties.find((p: any) => p.id == property_id),
            mode: 'edit',
            share: ()=>shareProperty(property_id)
        });
    } : false;

    const deleteProperty = (property_id: any) => {
        const property = properties.find((c: any) => c.id == property_id);
        setConfirmation({
            message: "Are you sure to delete " + property.name + " ("+ property.short_description +")?",
            actionName: "Delete",
            action: async () => {
                setConfirmation(false);

                setBusy(dispatch, true);

                await request({
                    method: 'DELETE',
                    url: config.backend + `/api/property/${property_id}`,
                    headers: { 'Authorization': `Bearer ${userSession.token}` },
                    callback: load,
                    onError: (err: any) => toast(err.message)
                });

                setBusy(dispatch, false);
            },
            closeFn: () => setConfirmation(false)
        });
    };

    React.useEffect(()=> {
        if (signal && signal.type == 'show-property') viewProperty(signal.data);
    }, [signal]);

    return (
        <>
            {confirmation && <ConfirmationDialog {...confirmation} />}

            <div key={id} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4 sm:p-7.5 mb-8">
                <div className="flex flex-nowrap items-start justify-between gap-6">
                    <div className="mb-6">
                        <p className="font-semibold text-black dark:text-white">{name}</p>
                        <p className="text-sm">{description}</p>
                    </div>
                    {(userSession.as == 'admin') &&
                        <div className="flex items-center space-x-3.5">
                            <button onClick={()=>editCategory(id)} className="hover:text-primary">
                                <PencilIcon className="min-w-5 max-w-5 fill-current" />
                            </button>
                            <button onClick={()=>addToCategory(id)} className="hover:text-primary">
                                <PlusIcon className="min-w-5 max-w-5 fill-current" />
                            </button>
                            {/*
                            <button onClick={()=>deleteCategory(id)} className="hover:text-primary">
                                <TrashIcon className="min-w-5 max-w-5 fill-current" />
                            </button>
                            */}
                        </div>
                    }
                </div>
                <div className="flex flex-nowrap gap-3 p-3 bg-whiten w-full min-h-54 overflow-auto">
                    {
                        properties.map((p: any) => <PropertyItem key={p.id} data={p} viewProperty={viewProperty} editProperty={editProperty} deleteProperty={deleteProperty} shareProperty={shareProperty} />)
                    }
                    {
                        (properties.length == 0) &&
                        <div className='px-2 w-full min-h-full flex items-center justify-center'>
                            <p className="text-2xl">No properties to show.</p>
                        </div>
                    }
                </div>
            </div>

            {showPropertyDialog &&
                <PropertyDialog
                    closeFn={() => setShowPropertyDialog(false)}
                    failFn={(err: any) => toast(err.message)}
                    successFn={() => { setShowPropertyDialog(false); load(); }}
                    data={showPropertyDialog}
                />
            }
        </>
    )
}

export default PropertyGroup;