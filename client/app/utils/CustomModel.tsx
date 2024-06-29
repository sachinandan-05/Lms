import React from 'react'
import { Modal } from "@mui/material";
import {Box }from '@mui/material';

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void,
    activeItem: any,
    component: any;
    setRoute?: (route: any) => void

}

const CustomModel: React.FC<Props> = ({open,setOpen,setRoute,component:Component}) => {
    return (
        <div>
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby='modal-modal-title'
                aria-describedby='model-model-description'
                >
                <Box
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rouded-[8px] shadow p-4 outline-none">
                  <Component setOpen={setOpen} setRoute={setRoute}/>
                </Box>
            </Modal>

        </div>
    )
}

export default CustomModel
