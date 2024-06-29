'use client'
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import { styles } from '../../styles/style';


type Props = {
    setRoute: (route: string) => void
}

const schema = Yup.object().shape({
    name:Yup.string().required("Please enter your name !"),
    email: Yup.string().email("Invaild Email ").required("please enter your email!!"),
    password: Yup.string().required("Please enter your passward!").min(6)

});
const SignUp: React.FC<Props> = ({setRoute}) => {
    const [show, setShow] = useState(false);
    const formik = useFormik({
        initialValues: {name:"", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => setRoute("Verification")
    })

    const { errors, touched, values, handleChange,handleSubmit } = formik

    return (
        <div className=' lg:w-[100%] w-[80%]'>
            <h1 className={`${styles.title}`}>
                SignUp with ELearning
            </h1>
           <form onSubmit={handleSubmit}>
           <label htmlFor="name"
            className={`${styles.label}`}
            >
                Name:
            </label>
            <input type="string"
            name=''
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder=' user Names'
            className={
                `${errors.email &&touched.email && "border-red-500"} ${styles.input}`}
            
             />
              {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                )}
             <br />
           <label htmlFor="email"
            className={`${styles.label}`}
            >
                Email:
            </label>
            <input type="email"
            name=''
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder='loginmail@gmail.com'
            className={
                 `${errors.email &&touched.email && "border-red-500"} ${styles.input}`
            }
             />
              {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
             <br />
             
             <label htmlFor="password"
            className={`${styles.label}`}
            >
                Enter Your Password:
            </label>
            <input type={!show? "password":"string"}
            name='password'
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder='  * * * * * *'
            className={
                `${errors.email &&touched.email && "border-red-500"} ${styles.input}`
            }
             />
              {errors.password && touched.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
             <br />
             <br />
             
                <div className='w-full '>
                    <input type="submit" value="Sign Up" className={`${styles.button}`} />
                </div>
                
                
                    <h5 className='text-center font-poppins text-black dark:text-white mt-1 '
                    >
                        Or join with
                    </h5>
                    
                    <div className='text-center  mt-1 w-full flex justify-center items-center gap-2 '>
                        <FcGoogle className='cursor-pointer'/>
                        <AiFillGithub className='cursor-pointer'/>
                </div>

                <br />
                <h4 className='text-center font-poppins text-black dark:text-white '>
                     have already Accoun!?<span className=' text-[#2190ff] pl-1 cursor-pointer' onClick={()=>setRoute("Login")}> Login</span>
                     </h4>
                     <br />

            
            

           </form>



        </div>
    )
}

export default SignUp
