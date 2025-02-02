import React from "react";

const RenderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating%1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <div className="flex">
            {Array(fullStars).fill(0).map((_, index) => (
                <svg
                    key={`full-${index}`}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 .587l3.668 7.431 8.175 1.183-5.916 5.76 1.396 8.134L12 18.897l-7.323 3.848 1.396-8.134L.157 9.201l8.175-1.183z" />
                </svg>
            ))}
            {halfStar && (
                <>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-400 transform scale-x-[-1]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >   
                        <defs>
                            <linearGradient id="halfStarGradient">
                                <stop offset="50%" stopColor="#D3D3D3"/>
                                <stop offset="50%" stopColor="yellow" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#halfStarGradient)" d="M12 .587l3.668 7.431 8.175 1.183-5.916 5.76 1.396 8.134L12 18.897l-7.323 3.848 1.396-8.134L.157 9.201l8.175-1.183z" />
                    </svg>
                </>
                
            )}
            {Array(emptyStars).fill(0).map((_, index) => (
                <svg
                    key={`empty-${index}`}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 .587l3.668 7.431 8.175 1.183-5.916 5.76 1.396 8.134L12 18.897l-7.323 3.848 1.396-8.134L.157 9.201l8.175-1.183z" />
                </svg>
            ))}
            
        </div>
    )
}

export default RenderStars;