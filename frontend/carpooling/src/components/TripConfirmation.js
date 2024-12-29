import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TripConfirmation = ({ user }) => {
    const navigate = useNavigate();
    const { rideId } = useParams();
    const token = localStorage.getItem('jwtToken');

    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                if (!token) {
                    console.log("User is not logged in. Navigating to sign in page...");
                    navigate("/signin");
                    return;
                }

                console.log("Ride Id: ", rideId);

                let url = `http://localhost:8080/api/trips/${rideId}`;

                console.log("Fetched backend Url: " + url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTripDetails(data);
                } else {
                    console.error("Failed to fetch trip details.");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };

        fetchTripDetails();
    }, [rideId, token]);

    const handleDownloadReceipt = async () => {
        const element = document.getElementById("receipt");
    
        const originalStyle = {
            width: element.style.width,
            position: element.style.position,
            left: element.style.left,
        };
        
        element.style.width = "768px";
        element.style.position = "absolute";
        element.style.left = "-9999px"; // Move off-screen
    
        try {
            const canvas = await html2canvas(element, {
                scale: 4,
                useCORS: true,
            });
    
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
            });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 40;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
            pdf.save(`trip-confirmation-receipt_${rideId}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            element.style.width = originalStyle.width;
            element.style.position = originalStyle.position;
            element.style.left = originalStyle.left;
        }
    };
    

    if (!tripDetails) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center mt-10">
            <h1 className="text-lg md:text-2xl font-bold text-green-500 text-center">
                You have Successfully joined the trip with <br/>{tripDetails.driver.fullName} to {tripDetails.goingTo.name}!🎉
            </h1>
            <div id="receipt" className="bg-white p-4 md:p-8 mt-2 md:mt-10 rounded-lg shadow-lg max-w-2xl w-full space-y-2 md:space-y-4 items-center">
                
                <h2 className="text-lg md:text-2xl font-semibold text-center text-gray-800 mb-2 md:mb-4">
                    🧾 Trip Confirmation Receipt
                </h2>

                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">👤 Passenger Information</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <p className="text-md md:text-lg"><span className="font-semibold pr-1 md:pr-2">Name:</span>{user.fullName}</p>
                        <p className="text-md md:text-lg"><span className="font-semibold pr-1 md:pr-2">Date of Birth:</span>{user.dateOfBirth}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">👤 Driver Information</h3>
                    <div className="flex items-center justify-center mb-4">
                        
                        <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
                            <img
                                src={
                                    tripDetails.driver.profilePicture
                                        ? `data:image/jpeg;base64,${tripDetails.driver.profilePicture}`
                                        : tripDetails.driver.gender === "FEMALE"
                                            ? "/images/default_female.jpg"
                                            : tripDetails.driver.gender === "MALE"
                                                ? "/images/default_male.png"
                                                : "/images/default_user.png"
                                }
                                alt="Profile Picture"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:justify-between">
                        <p className="text-md md:text-lg"><span className="font-semibold pr-1 md:pr-2">Name:</span> {tripDetails.driver?.fullName}</p>
                        <p className="text-md md:text-lg"><span className="font-semibold pr-1 md:pr-2">Email:</span>{tripDetails.driver.email}</p> 
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">🛣️ Trip Details</h3>
                    <div className="flex flex-col md:flex-row items-start md:justify-between md:space-x-4">
                        <div className="text-left">
                            <p><span className="font-semibold">Leaving From: </span>{tripDetails.leavingFrom.name}</p>
                            <p className="hidden md:block"><span className="font-semibold">Departure Date: </span> {tripDetails.date}</p>
                        </div>
                        <div className="text-left">
                            <p><span className="font-semibold">Going To: </span> {tripDetails.goingTo.name}</p>
                            <p className="block md:hidden"><span className="font-semibold">Departure: </span>{tripDetails.date} at {tripDetails.time}</p>
                            <p className="hidden md:block"><span className="font-semibold">Departure Time: </span>{tripDetails.time}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">🚗 Vehicle Information</h3>
                    <div className="flex items-center justify-between space-x-4">
                        <div>
                            <p className="text-md md:text-lg"><span className="font-semibold md:pr-2">Brand:</span> {tripDetails.driver.vehicle.brand}</p>
                            <p className="text-md md:text-lg"><span className="font-semibold md:pr-2">Model:</span> {tripDetails.driver.vehicle.model}</p>
                        </div>
                        <div>
                            <p className="text-md md:text-lg"><span className="font-semibold md:pr-2">Color:</span> {tripDetails.driver.vehicle.color}</p>
                            <p className="text-md md:text-lg"><span className="font-semibold md:pr-2">License Plate:</span> {tripDetails.driver.vehicle.licensePlateNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">💵 Payment Details:</h3>
                    <div className="flex flex-col md:flex-row items-center justify-between text-md md:text-lg">
                        <p><span className="font-semibold">Fare per Seat:</span> ${tripDetails.farePerSeat.toFixed(2)}</p>
                        <p><span className="font-semibold">Seats Booked:</span> 1</p>
                        <p className="font-bold text-gray-900"><span className="text-gray-700">Total Amount:</span> ${(tripDetails.farePerSeat * 1).toFixed(2)}</p>
                    </div>
                </div>
                
            </div>
            <button 
                onClick={handleDownloadReceipt}
                className="mt-6 mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Download Receipt as PDF
            </button>
        </div>
    );
};

export default TripConfirmation;