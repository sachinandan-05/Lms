'use client'
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { styles } from '../../styles/style';

type Props = {
    setRoute: (route: string) => void
}

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6, "Password must be at least 6 characters")
});

const Login: React.FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async (values) => {
            console.log(values.email, values.password);
            // Handle login logic here
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='lg:w-[100%] w-[80%]'>
            <h1 className={`${styles.title}`}>
                Login with ELearning
            </h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className={`${styles.label}`}>
                    Email:
                </label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder='loginmail@gmail.com'
                    className={`${errors.email && touched.email ? "border-red-500" : ""} ${styles.input}`}
                />
                {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}
                <br />

                <label htmlFor="password" className={`${styles.label}`}>
                    Enter Your Password:
                </label>
                <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    id="password"
                    placeholder='  * * * * * *'
                    className={`${errors.password && touched.password ? "border-red-500" : ""} ${styles.input}`}
                />
                {errors.password && touched.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}
                <br />
                <br />

                <div className='w-full'>
                    <input type="submit" value="Login" className={`${styles.button}`} />
                </div>

                <h5 className='text-center font-poppins text-black dark:text-white mt-1'>
                    Or join with
                </h5>

                <div className='text-center mt-1 w-full flex justify-center items-center gap-2'>
                    <FcGoogle className='cursor-pointer' />
                    <AiFillGithub className='cursor-pointer' />
                </div>

                <br />
                <h4 className='text-center font-poppins text-black dark:text-white'>
                    Not have any Account?<span className='text-[#2190ff] pl-1 cursor-pointer' onClick={() => setRoute("Sign-Up")}> Sign-Up</span>
                </h4>
                <br />
            </form>
        </div>
    );
}

export default Login;
