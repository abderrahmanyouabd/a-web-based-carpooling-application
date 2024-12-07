import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();
    const navigate = useNavigate();

    const { clientSecret, rideId, token } = location.state;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            console.log("Stripe or elements or clientSecret is missing.");
            return;
        }

        setLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement) 
                    // By default stripe verifies all relevant information, we do not have to specify CVC, Postal code, Month & Year
                },
            });

            if (error) {
                console.error("Payment failed:", error);
            } else if (paymentIntent.status === "succeeded"){
                console.log("Payment succeeded:", paymentIntent.id);
                console.log("Attempting to join the ride...");
                await joinRide();
                navigate(`/confirmation/ride/${rideId}`);
            }

        } catch (error) {
            console.error("Error confirming payment:", error);
        } finally {
            setLoading(false);
        }
    }

    const joinRide = async () => {
        if (!token) {
            console.log("No token found, cannot join ride.");
            return;
        }

        try {
            console.log("Joining trip with ride ID:", rideId);
            const joinResponse = await fetch(`http://localhost:8080/api/trips/${rideId}/join`,
                {   
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

            if (joinResponse.status === 200) {
                console.log("Successfully joined the ride!");
            } else {
                console.error("Error joining the ride, status: ", joinResponse.status);
            }
        } catch (error) {
            console.error("Error joining the trip:", error);
        }

    };

    return (
        <div>
            <div className="flex justify-center mt-20">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Enter Payment Details</h2>

                    <label className="block">
                        <span>Card Number</span>
                        <CardNumberElement className="border p-2 rounded-md mt-1 w-full" />
                    </label>

                    <label className="block">
                        <span>Expiration Date</span>
                        <CardExpiryElement className="border p-2 rounded-md mt-1 w-full" />
                    </label>

                    <label className="block">
                        <span>CVC</span>
                        <CardCvcElement className="border p-2 rounded-md mt-1 w-full" />
                    </label>

                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm Payment"}
                    </button>
                </form>
            </div>
        </div>

    )
}

export default PaymentForm;