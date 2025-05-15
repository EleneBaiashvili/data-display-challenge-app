
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [latestData, setLatestData] = useState<string>("");
  const [inputData, setInputData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define base URL for API calls
  const apiBaseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : `http://${window.location.hostname}:3001/api`;

  // Fetch the most recent data when component mounts
  useEffect(() => {
    fetchLatestData();
  }, []);

  // Function to fetch the most recent data from backend
  const fetchLatestData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/get-answer`, {
        // Adding timeout and credentials to help with connection issues
        headers: { 'Cache-Control': 'no-cache' },
        mode: 'cors',
      });
      
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
      
      const data = await response.json();
      setLatestData(data.data || "No data available yet");
      
      // Show success toast
      toast({
        title: "Data refreshed",
        description: "Successfully loaded the latest data.",
        duration: 2000,
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Could not connect to backend server. Make sure the server is running on port 3001.");
      setLatestData("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send data to backend
  const submitData = async () => {
    if (!inputData.trim()) return;
    
    try {
      setError(null);
      const response = await fetch(`${apiBaseUrl}/create-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputData }),
      });
      
      if (!response.ok) throw new Error(`Failed to submit data: ${response.status}`);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Your data has been sent to the server.",
        duration: 2000,
      });
      
      // Refresh data to show the newly submitted value
      fetchLatestData();
      // Clear input field after successful submission
      setInputData("");
    } catch (error) {
      console.error("Error submitting data:", error);
      setError("Could not send data to backend server. Make sure the server is running on port 3001.");
      toast({
        title: "Connection Error",
        description: "Failed to connect to the backend server.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-center">Assignment Submission</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        
          <div>
            <h2 className="text-lg font-medium mb-2">Send Data to Backend</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter data to send"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitData()}
              />
              <Button onClick={submitData}>Send</Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Latest Data from Backend</h2>
            <div className="p-4 bg-gray-100 rounded-md min-h-[60px] flex items-center justify-center">
              {isLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : (
                <span id="answer" className="text-lg break-all">{latestData}</span>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={fetchLatestData} 
              className="w-full mt-2"
            >
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
        <p className="mb-2">
          You must have the backend server running at:
          <code className="block p-2 mt-1 bg-gray-100 rounded text-sm font-mono">
            {apiBaseUrl}
          </code>
        </p>
        <p>
          For the assignment, the backend URL endpoint is:
          <code className="block p-2 mt-1 bg-gray-100 rounded text-sm">
            http://your-ip-address:3001/api/create-answer
          </code>
        </p>
        <p className="mt-2">
          And the frontend URL showing the answer is:
          <code className="block p-2 mt-1 bg-gray-100 rounded text-sm">
            http://your-ip-address:5173/
          </code>
        </p>
      </div>
    </div>
  );
};

export default Index;
