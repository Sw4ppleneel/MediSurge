import { Box, Heading, Button, Input, VStack, Text, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fileInput = useRef();

  // Replace below with real API endpoint
  const API_URL = process.env.REACT_APP_API_URL || "https://your-backend.com";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} is ready for upload`,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async () => {
    if (!file || !location) {
      toast({
        title: "Missing Information",
        description: "Please enter your hospital location and upload an inventory file before generating a plan.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Validate file type
    if (file && !file.name.match(/\.(csv|xlsx|xls|json)$/i)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV, Excel, or JSON file.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    
    try {
      toast({
        title: "Generating Plan",
        description: "Processing your inventory data...",
        status: "info",
        duration: 2000,
        isClosable: true,
      });

      // Demo: Replace with real API call
      const payload = { location: location, inventory: "file-content" };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPlan({ 
        translated: { orders: "Sample order based on current inventory levels" }, 
        briefing: "AI-generated surge plan summary based on your location and inventory data." 
      });
      
      toast({
        title: "Plan Generated Successfully",
        description: "Your surge plan is ready for review.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your surge plan. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={16} p={8} bg="white" borderRadius="xl" boxShadow="lg" maxW="900px" mx="auto">
      <Heading color="#0093d5" mb={4}>
        Dashboard
      </Heading>
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Enter your hospital location (city or lat,lon)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={() => fileInput.current.click()}
        >
          {file ? `Selected: ${file.name}` : "Upload Inventory File"}
        </Button>
        <input
          ref={fileInput}
          type="file"
          style={{ display: "none" }}
          accept=".csv,.xlsx,.xls,.json"
          onChange={handleFileChange}
        />
        <Button 
          colorScheme="blue" 
          onClick={handleUpload}
          isLoading={loading}
          loadingText="Generating Plan..."
        >
          Generate Surge Plan
        </Button>
      </VStack>
      {plan && (
        <Box mt={8} bg="#f2f2f2" p={5} borderRadius="md">
          <Heading size="md" color="#003399" mb={2}>
            Briefing
          </Heading>
          <Text color="#005b94">{plan.briefing}</Text>
          <Heading size="sm" color="#0093d5" mt={4}>
            Orders
          </Heading>
          <Text>{JSON.stringify(plan.translated.orders)}</Text>
        </Box>
      )}
    </Box>
  );
}