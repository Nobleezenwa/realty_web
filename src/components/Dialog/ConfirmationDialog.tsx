import React from 'react';
import Dialog from '.';

type ConfirmationDialogProps = {
    subject?: string,
    message?: string, 
    actionName?: string, 
    action: ()=> void,
    closeFn: ()=> void,
}
  
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({subject = "Confirm", message = "Are you sure to continue?", actionName, action, closeFn}) => {
    return (
        <Dialog title={subject} closeFn={closeFn}>
            <div className="flex flex-col gap-5.5">
                <p className="mb-1 block text-black dark:text-white">{message}</p>
                <div>
                    <button
                        onClick={action}
                        className="cursor-pointer items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        {actionName}
                    </button>
                </div>

            </div>
        </Dialog>    
    );
};

export default ConfirmationDialog;