// Pinata IPFS Service for uploading farmer NFT metadata and images
// Get your API keys from https://www.pinata.cloud/

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || '';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

// Use JWT if available, otherwise use API key/secret
const useJWT = PINATA_JWT !== '';

/**
 * Upload image file to Pinata IPFS
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} IPFS hash
 */
export const uploadImageToPinata = async (file) => {
  try {
    // Validation
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Check if API credentials are configured
    if (!useJWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
      console.warn('Pinata API credentials not configured, using fallback');
      return uploadToFallbackIPFS(file);
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    const metadata = JSON.stringify({
      name: `farmer-crop-${Date.now()}.${file.name.split('.').pop()}`,
      keyvalues: {
        type: 'farmer-crop-image',
        timestamp: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    // Pinning options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    // Set up headers
    const headers = useJWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        };

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload to Pinata');
    }

    const data = await response.json();
    console.log('Image uploaded to Pinata:', data.IpfsHash);
    
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading image to Pinata:', error);
    // Fallback to base64 encoding
    return uploadToFallbackIPFS(file);
  }
};

/**
 * Upload JSON metadata to Pinata IPFS
 * @param {Object} metadata - NFT metadata object
 * @returns {Promise<string>} IPFS hash
 */
export const uploadMetadataToPinata = async (metadata) => {
  try {
    // Check if API credentials are configured
    if (!useJWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
      console.warn('Pinata API credentials not configured, using fallback');
      return uploadJSONToFallback(metadata);
    }

    // Add standard NFT metadata fields
    const nftMetadata = {
      name: metadata.name || 'Farmer NFT',
      description: metadata.description || `Farmer NFT for ${metadata.farmerName}`,
      image: metadata.image || '',
      attributes: [
        { trait_type: 'Farmer Name', value: metadata.farmerName || 'Unknown' },
        { trait_type: 'Location', value: metadata.location || 'Unknown' },
        { trait_type: 'Crop Type', value: metadata.cropType || 'Unknown' },
        { trait_type: 'Farm Size', value: metadata.farmSize || 'Unknown' },
        { trait_type: 'Farming Method', value: metadata.farmingMethod || 'Unknown' },
        { trait_type: 'Years of Experience', value: metadata.yearsOfExperience || 0 },
        { trait_type: 'Registration Date', value: new Date().toISOString() },
      ],
      external_url: metadata.externalUrl || '',
      ...metadata,
    };

    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      ...(useJWT
        ? { Authorization: `Bearer ${PINATA_JWT}` }
        : {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          }),
    };

    const body = {
      pinataContent: nftMetadata,
      pinataMetadata: {
        name: `farmer-nft-metadata-${Date.now()}.json`,
        keyvalues: {
          type: 'farmer-nft-metadata',
          farmer: metadata.farmerName || 'Unknown',
          timestamp: new Date().toISOString(),
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload metadata to Pinata');
    }

    const data = await response.json();
    console.log('Metadata uploaded to Pinata:', data.IpfsHash);
    
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    return uploadJSONToFallback(metadata);
  }
};

/**
 * Complete NFT creation flow: upload image and metadata
 * @param {File} imageFile - Crop image
 * @param {Object} farmerData - Farmer information
 * @returns {Promise<string>} Metadata IPFS URI
 */
export const createFarmerNFTMetadata = async (imageFile, farmerData) => {
  try {
    console.log('Starting NFT metadata creation...');
    
    // Step 1: Upload image
    console.log('Uploading image...');
    const imageHash = await uploadImageToPinata(imageFile);
    const imageUri = `ipfs://${imageHash}`;
    
    console.log('Image uploaded:', imageUri);
    
    // Step 2: Create metadata with image URI
    const metadata = {
      name: `Farmer NFT - ${farmerData.name}`,
      description: `AgriShield Farmer NFT for ${farmerData.name}, farming ${farmerData.cropType} in ${farmerData.location}`,
      image: imageUri,
      farmerName: farmerData.name,
      location: farmerData.location,
      cropType: farmerData.cropType,
      farmingMethod: farmerData.farmingMethod,
      farmSize: farmerData.farmSize,
      yearsOfExperience: farmerData.yearsOfExperience,
      email: farmerData.email,
      phone: farmerData.phone,
      walletAddress: farmerData.walletAddress,
      externalUrl: 'https://agrishield.example.com',
    };
    
    // Step 3: Upload metadata
    console.log('Uploading metadata...');
    const metadataHash = await uploadMetadataToPinata(metadata);
    const metadataUri = `ipfs://${metadataHash}`;
    
    console.log('Metadata uploaded:', metadataUri);
    
    return metadataUri;
  } catch (error) {
    console.error('Error creating NFT metadata:', error);
    throw error;
  }
};

/**
 * Fallback: Convert file to base64 data URI (not real IPFS but works without API)
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 data URI
 */
const uploadToFallbackIPFS = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Create a mock IPFS-style hash from the data
      const base64 = reader.result;
      console.warn('Using fallback base64 encoding instead of IPFS');
      resolve(`data:${file.type};base64,${base64.split(',')[1]}`);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Fallback: Create data URI for JSON (not real IPFS but works without API)
 * @param {Object} json - JSON object
 * @returns {string} Data URI
 */
const uploadJSONToFallback = (json) => {
  const jsonString = JSON.stringify(json);
  const base64 = btoa(jsonString);
  console.warn('Using fallback base64 encoding for metadata instead of IPFS');
  return `data:application/json;base64,${base64}`;
};

/**
 * Get IPFS gateway URL for a hash
 * @param {string} hash - IPFS hash
 * @returns {string} Gateway URL
 */
export const getIPFSGatewayUrl = (hash) => {
  if (!hash) return '';
  
  // Handle different URI formats
  if (hash.startsWith('ipfs://')) {
    hash = hash.replace('ipfs://', '');
  }
  
  // Handle data URIs
  if (hash.startsWith('data:')) {
    return hash;
  }
  
  // Use Pinata gateway or public gateway
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

/**
 * Test Pinata connection
 * @returns {Promise<boolean>} Connection status
 */
export const testPinataConnection = async () => {
  try {
    if (!useJWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
      console.warn('Pinata credentials not configured');
      return false;
    }

    const headers = useJWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        };

    const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    console.log('Pinata connection test:', data);
    
    return response.ok;
  } catch (error) {
    console.error('Pinata connection test failed:', error);
    return false;
  }
};

export default {
  uploadImageToPinata,
  uploadMetadataToPinata,
  createFarmerNFTMetadata,
  getIPFSGatewayUrl,
  testPinataConnection,
};
