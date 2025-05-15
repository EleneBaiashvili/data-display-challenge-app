
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [latestData, setLatestData] = useState<string>("");
  const [inputData, setInputData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the most recent data when component mounts
  useEffect(() => {
    fetchLatestData();
  }, []);

  // Function to fetch the most recent data from backend
  const fetchLatestData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/get-answer");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setLatestData(data.data || "No data available yet");
    } catch (error) {
      console.error("Error fetching data:", error);
      setLatestData("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send data to backend
  const submitData = async () => {
    if (!inputData.trim()) return;
    
    try {
      const response = await fetch("http://localhost:3001/api/create-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputData }),
      });
      
      if (!response.ok) throw new Error("Failed to submit data");
      
      // Refresh data to show the newly submitted value
      fetchLatestData();
      // Clear input field after successful submission
      setInputData("");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-center">Assignment Submission</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Send Data to Backend</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Enter data to send"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
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
