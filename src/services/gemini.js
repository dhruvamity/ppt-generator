export const generateSlideData = async (rawText, token) => {
    const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ rawText })
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            throw new Error(`Server returned status ${response.status}`);
        }
        throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const json = await response.json();
    return json.data;
};
