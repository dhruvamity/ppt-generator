import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

// Helper function to load the Razorpay SDK script dynamically
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function UpgradeButton() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const backendUrl = rawBackendUrl.replace(/\/+$/, '');

    const handleUpgrade = async () => {
        if (!isLoaded || !isSignedIn) {
            toast.error("Please sign in first to upgrade.");
            return;
        }

        const toastId = toast.loading("Initializing payment...");
        
        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Failed to load Razorpay SDK. Check your connection.", { id: toastId });
                return;
            }

            const token = await getToken();
            
            // 1. Get Order ID from your FastAPI backend
            const orderResponse = await fetch(`${backendUrl}/api/create-razorpay-order`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!orderResponse.ok) {
                throw new Error("Failed to create order on server");
            }
            
            const orderData = await orderResponse.json();
            toast.dismiss(toastId);

            // 2. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "PPT Generator",
                description: "Upgrade to Pro",
                order_id: orderData.order_id,
                handler: function (response) {
                    // This triggers when payment is successful on the frontend
                    toast.success("Payment Successful! Refreshing your account...");
                    setTimeout(() => window.location.reload(), 2000); 
                },
                prefill: {
                    name: "Pro User",
                },
                theme: { color: "#4F46E5" } 
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                toast.error(response.error.description);
            });
            rzp.open();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong", { id: toastId });
        }
    };

    return (
        <button 
            onClick={handleUpgrade} 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 px-4 py-3 rounded-xl font-label-md text-sm transition-all shadow-md shadow-indigo-500/20 mt-2"
        >
            <Sparkles size={18} />
            Upgrade to Pro
        </button>
    );
}
