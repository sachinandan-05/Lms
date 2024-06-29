'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { VscWorkspaceTrusted } from 'react-icons/vsc';
import { useRef } from 'react';
import { styles } from '../../styles/style';

type Props = {
    setRoute: (route: string) => void;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
};

const Verification: React.FC<Props> = ({ setRoute }) => {
    const [invalidError, setInvalidError] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<VerifyNumber>({
        0: "",
        1: "",
        2: "",
        3: ""
    });
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const verificationHandler = async () => {
        setInvalidError(true);

    }
    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verificationCode, [index]: value };
        setVerificationCode(newVerifyNumber);
        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();

        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus()

        }

    };





    return (
        <div >
            <h1 className={`${styles.title}`}>
                Verify your Account

            </h1>
            <br />
            <div className="w-full items-center flex justify-center mt-2">
                <div className='w-[80px] h-[80px] rounded-full bg-[#497df2] flex items-center justify-center'>
                    <VscWorkspaceTrusted size={36} />

                </div>

            </div>
            <br />
            <br />
            <div className='m-auto flex items-center justify-around'>
                {
                    Object.keys(verificationCode).map((key, index) => (
                        <input type="number"
                            key={key}
                            ref={inputRefs[index]}
                            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-poppins outline-none text-center ${invalidError ?
                                    "shake border-red-500" :
                                    "dark:border-white border-[#0000004a]"
                                }`
                            } 
                            placeholder=''
                            maxLength={1}
                            value={verificationCode[key as keyof VerifyNumber]}
                            onChange={(e)=>handleInputChange(index,e.target.value)}/>
                    ))
                }

            </div>
            <br />
            <br />
            <div className="flex justify-center">
                <button
                className={`${styles.button}`}
                onClick={verificationHandler}>

                    verify OTP
                </button>
            </div>
            <br />
            <h5 className="text-center pt-4 font-poppins text-[14px] text-black dark:text-white">
                Go back to sign in? <span
                className="text-[#4970f2] cursor-pointer" 
                onClick={()=>setRoute("Login")}> sin In</span>

            </h5>
            
        </div>
    );
};

export default Verification;
