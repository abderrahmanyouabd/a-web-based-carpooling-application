import React from "react";

const Step4 = ({ setParams, setStep, step, params}) => {

    return (
        <>
            <h1 className="text-3xl font-extrabold text-gray-700">How would you like to be addressed?</h1>

            <div className="flex flex-col mt-5 space-y-4">
                <div 
                    className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                    onClick={() => {
                        setParams({ ...params, gender: 'FEMALE'});
                        setStep(step + 1);
                    }}
                >
                    <span className="w-[32rem] font-bold text-gray-700">FEMALE</span>
                    <span>&#8250;</span>
                </div>

                <div 
                    className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                    onClick={() => { 
                        setParams({ ...params, gender: 'MALE'});
                        setStep(step + 1);
                    }}
                >
                    <span className="w-[32rem] font-bold text-gray-700">MALE</span>
                    <span>&#8250;</span>
                </div>

                <div 
                    className="flex justify-betwween items-center py-4 px-6 hover:bg-gray-300 rounded-[20px] border-b cursor-pointer"
                    onClick={() => {
                        setParams({ ...params, gender: 'NOT_SPECIFIED'});
                        setStep(step + 1);
                    }}
                >
                    <span className="w-[32rem] font-bold text-gray-700">NOT SPECIFIED</span>
                    <span>&#8250;</span>
                </div>
            </div>
        </>
    )
}

export default Step4;