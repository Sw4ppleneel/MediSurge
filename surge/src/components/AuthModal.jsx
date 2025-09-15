import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Input,
  VStack,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AuthModal({ isOpen, onClose, setLoggedIn }) {
  const [loading, setLoading] = useState(false);
  
  // API endpoint - update this with your backend URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    hospitalName: "",
    email: "",
    password: "",
    location: ""
  });
  
  // Form validation errors
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!loginData.password) {
      errors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors = {};
    
    if (!signupData.hospitalName) {
      errors.hospitalName = "Hospital name is required";
    }
    
    if (!signupData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(signupData.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForms = () => {
    setLoginData({ email: "", password: "" });
    setSignupData({ hospitalName: "", email: "", password: "", location: "" });
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call your authentication API endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        // Store authentication token
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setLoggedIn(true);
        handleClose();
      } else {
        const error = await response.json();
        setLoginErrors({ general: error.detail || "Login failed" });
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call your authentication API endpoint
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const result = await response.json();
        // Store authentication token
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setLoggedIn(true);
        handleClose();
      } else {
        const error = await response.json();
        setSignupErrors({ general: error.detail || "Signup failed" });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login / Signup</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs isFitted>
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <form onSubmit={handleLogin}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={loginErrors.email}>
                      <Input 
                        placeholder="Email" 
                        type="email" 
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      />
                      <FormErrorMessage>{loginErrors.email}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={loginErrors.password}>
                      <Input 
                        placeholder="Password" 
                        type="password" 
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                      <FormErrorMessage>{loginErrors.password}</FormErrorMessage>
                    </FormControl>
                    
                    {loginErrors.general && (
                      <FormControl isInvalid>
                        <FormErrorMessage>{loginErrors.general}</FormErrorMessage>
                      </FormControl>
                    )}
                    
                    <Button 
                      colorScheme="blue" 
                      isLoading={loading} 
                      type="submit" 
                      w="100%"
                      loadingText="Logging in..."
                    >
                      Login
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
              <TabPanel>
                <form onSubmit={handleSignup}>
                  <VStack spacing={4}>
                    <FormControl isInvalid={signupErrors.hospitalName}>
                      <Input 
                        placeholder="Hospital Name" 
                        value={signupData.hospitalName}
                        onChange={(e) => setSignupData({...signupData, hospitalName: e.target.value})}
                      />
                      <FormErrorMessage>{signupErrors.hospitalName}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={signupErrors.email}>
                      <Input 
                        placeholder="Email" 
                        type="email" 
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      />
                      <FormErrorMessage>{signupErrors.email}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={signupErrors.password}>
                      <Input 
                        placeholder="Password" 
                        type="password" 
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      />
                      <FormErrorMessage>{signupErrors.password}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={signupErrors.location}>
                      <Input 
                        placeholder="Hospital Location (City, State)" 
                        value={signupData.location}
                        onChange={(e) => setSignupData({...signupData, location: e.target.value})}
                      />
                      <FormErrorMessage>{signupErrors.location}</FormErrorMessage>
                    </FormControl>
                    
                    {signupErrors.general && (
                      <FormControl isInvalid>
                        <FormErrorMessage>{signupErrors.general}</FormErrorMessage>
                      </FormControl>
                    )}
                    
                    <Button 
                      colorScheme="blue" 
                      isLoading={loading} 
                      type="submit" 
                      w="100%"
                      loadingText="Creating account..."
                    >
                      Sign Up
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
