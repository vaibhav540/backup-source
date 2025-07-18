// // services/chat.service.js
// import axios from "axios";

// class ChatService {
//   constructor() {
//     this.devApiKeys = "AIzaSyC9s3SJxJNLgWdRotkB52UTHzEsfuU3mWo";
//     this.prodApiKeys = "AIzaSyARNFW5hKMLSJG5TAlhXTRZ6Fb2OtJkLWg";
//     this.devUrls = {
//       sendMessageServiceManual: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/keyword",
//       sendMessageOperatorHandbook: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/keywords/ohb",
//       getFinalResults: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/master/functions",
//       storeUserFeedback: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/feedback",
//       resultTranslation: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/translate/responses",
//       userQuestion: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/user/question",
//       getTTS: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/t2s",
//     };
//     this.prodUrls = {
//       sendMessageServiceManual: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/keywords-sm",
//       sendMessageOperatorHandbook: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/keywords-ohb",
//       getFinalResults: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/master-api",
//       storeUserFeedback: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/get-feedback",
//       resultTranslation: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/translate-api",
//       userQuestion: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev/phase2/stt",
//       getTTS: "https://al-genai-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/prod-tts",
//     };
//   }

//   getConfig(endpointName, environment = "development") {
//     const isProd = environment === "production";
//     const baseURLs = isProd ? this.prodUrls : this.devUrls;
//     const apiKey = isProd ? this.prodApiKeys : this.devApiKeys;

//     return {
//       method: "post",
//       url: baseURLs[endpointName],
//       headers: {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*",
//         "X-API-Key": apiKey,
//       },
//     };
//   }

//   async sendMessageServiceManual(payload, environment) {
//     const config = this.getConfig("sendMessageServiceManual", environment);
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.log("error", error);
//       throw error;
//     }
//   }

//   async sendMessageOperatorHandbook(payload, environment) {
//     const config = this.getConfig("sendMessageOperatorHandbook", environment);
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.log("error", error);
//       throw error;
//     }
//   }

//   async getFinalResults(payload, environment) {
//     const config = this.getConfig("getFinalResults", environment);
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.log("error", error);
//       throw error;
//     }
//   }

//   async storeUserFeedback(payload, environment) {
//     const config = this.getConfig("storeUserFeedback", environment);
//     const transformedPayload = {
//       username: payload.username || '',
//       session_id: payload.session_id,
//       question: payload.question,
//       official_docs_responses: payload.official_docs_responses,
//       external_sources_responses: payload.external_sources_responses,
//       response_id: payload.response_id,
//       response_messages: payload.response_messages,
//       thumbs_up_reason: payload.feedback === 'liked' ? payload.selectedFeedbackOption : '',
//       thumbs_down_reason: payload.feedback === 'disliked' ? payload.selectedFeedbackOption : '',
//       comment: payload.comment || '',
//       document_type: payload.document_type,
//       vehicle_type: payload.vehicle_type,
//       suggested_questions: Array.isArray(payload.suggested_questions) ? payload.suggested_questions.join(', ') : payload.suggested_questions || '',
//       citations: payload.citations || []
//     };
//     try {
//       const response = await axios({ ...config, data: transformedPayload });
//       return response.data;
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       throw error;
//     }
//   }

//   async resultTranslation(payload, environment) {
//     const config = this.getConfig("resultTranslation", environment);
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.log("error", error);
//       throw error;
//     }
//   }

//   async userQuestion(payload, environment) {
//     const config = this.getConfig("userQuestion", environment);
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.log("error", error);
//       throw error;
//     }
//   }

//   async getTTS({ welcome_intent_response = '', official_response = '', external_response = '', lang_code = 'en-US' }, environment = 'development') {
//     const config = this.getConfig("getTTS", environment);
//     const payload = {
//       welcome_intent_response,
//       official_response,
//       external_response,
//       lang_code,
//     };
//     try {
//       const response = await axios({ ...config, data: payload });
//       return response.data;
//     } catch (error) {
//       console.error('TTS API error:', error);
//       throw error;
//     }
//   }
// }

// export default new ChatService();



// services/chat.service.js
import axios from "axios";

// API Configuration Constants
const API_CONFIG = {
  DEVELOPMENT: {
    BASE_URL: "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev",
    API_KEY: "AIzaSyC9s3SJxJNLgWdRotkB52UTHzEsfuU3mWo"
  },
  PRODUCTION: {
    BASE_URL: "https://al-prod-genai-api-82ww2seo.uc.gateway.dev",
    API_KEY: "AIzaSyARNFW5hKMLSJG5TAlhXTRZ6Fb2OtJkLWg"
  }
};

// Endpoint configurations
const ENDPOINTS = {
  DEVELOPMENT: {
    sendMessageServiceManual: "/phase2/keyword",
    sendMessageOperatorHandbook: "/keywords/ohb",
    getFinalResults: "/master/functions",
    storeUserFeedback: "/phase2/feedback",
    resultTranslation: "/translate/responses",
    userQuestion: "/user/question",
    getTTS: "/phase2/t2s",
  },
  PRODUCTION: {
    sendMessageServiceManual: "/phase2/keywords-sm",
    sendMessageOperatorHandbook: "/phase2/keywords-ohb",
    getFinalResults: "/phase2/master-api",
    storeUserFeedback: "/phase2/get-feedback",
    resultTranslation: "/phase2/translate-api",
    userQuestion: "/phase2/stt",
    getTTS: "/phase2/text-to-speech",
  }
};

class ChatService {
  constructor() {
    this.devApiKeys = API_CONFIG.DEVELOPMENT.API_KEY;
    this.prodApiKeys = API_CONFIG.PRODUCTION.API_KEY;
    
    // Base URLs
    this.devBaseUrl = API_CONFIG.DEVELOPMENT.BASE_URL;
    this.prodBaseUrl = API_CONFIG.PRODUCTION.BASE_URL;
    
    // Endpoints
    this.endpoints = ENDPOINTS.DEVELOPMENT;
    this.prodEndpoints = ENDPOINTS.PRODUCTION;
  }

  getConfig(endpointName, environment = "development") {
    const isProd = environment === "production";
    const baseUrl = isProd ? this.prodBaseUrl : this.devBaseUrl;
    const endpoints = isProd ? this.prodEndpoints : this.endpoints;
    const apiKey = isProd ? this.prodApiKeys : this.devApiKeys;

    // Validate endpoint exists
    if (!this.isValidEndpoint(endpointName, environment)) {
      throw new Error(`Invalid endpoint: ${endpointName} for environment: ${environment}. Available endpoints: ${this.getAvailableEndpoints(environment).join(', ')}`);
    }

    return {
      method: "post",
      url: `${baseUrl}${endpoints[endpointName]}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-API-Key": apiKey,
      },
    };
  }

  // Utility method to get current environment configuration
  getEnvironmentConfig(environment = "development") {
    const isProd = environment === "production";
    return {
      baseUrl: isProd ? this.prodBaseUrl : this.devBaseUrl,
      apiKey: isProd ? this.prodApiKeys : this.devApiKeys,
      endpoints: isProd ? this.prodEndpoints : this.endpoints,
      environment: isProd ? "production" : "development"
    };
  }

  // Utility method to get full URL for debugging
  getFullUrl(endpointName, environment = "development") {
    const config = this.getEnvironmentConfig(environment);
    return `${config.baseUrl}${config.endpoints[endpointName]}`;
  }

  // Utility method to validate if endpoint exists
  isValidEndpoint(endpointName, environment = "development") {
    const config = this.getEnvironmentConfig(environment);
    return endpointName in config.endpoints;
  }

  // Utility method to get all available endpoints for an environment
  getAvailableEndpoints(environment = "development") {
    const config = this.getEnvironmentConfig(environment);
    return Object.keys(config.endpoints);
  }

  // Utility method to log current configuration (for debugging)
  logConfiguration(environment = "development") {
    const config = this.getEnvironmentConfig(environment);
    console.log(`ChatService Configuration for ${config.environment}:`, {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'Not set',
      endpoints: config.endpoints,
      availableEndpoints: this.getAvailableEndpoints(environment)
    });
  }

  async sendMessageServiceManual(payload, environment) {
    const config = this.getConfig("sendMessageServiceManual", environment);
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async sendMessageOperatorHandbook(payload, environment) {
    const config = this.getConfig("sendMessageOperatorHandbook", environment);
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async getFinalResults(payload, environment) {
    const config = this.getConfig("getFinalResults", environment);
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async storeUserFeedback(payload, environment) {
    const config = this.getConfig("storeUserFeedback", environment);
    const transformedPayload = {
      username: payload.username || '',
      session_id: payload.session_id,
      question: payload.question,
      official_docs_responses: payload.official_docs_responses,
      external_sources_responses: payload.external_sources_responses,
      response_id: payload.response_id,
      response_messages: payload.response_messages,
      thumbs_up_reason: payload.feedback === 'liked' ? payload.selectedFeedbackOption : '',
      thumbs_down_reason: payload.feedback === 'disliked' ? payload.selectedFeedbackOption : '',
      comment: payload.comment || '',
      document_type: payload.document_type,
      vehicle_type: payload.vehicle_type,
      suggested_questions: Array.isArray(payload.suggested_questions) ? payload.suggested_questions.join(', ') : payload.suggested_questions || '',
      citations: payload.citations || []
    };
    try {
      const response = await axios({ ...config, data: transformedPayload });
      return response.data;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  }

  async resultTranslation(payload, environment) {
    const config = this.getConfig("resultTranslation", environment);
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async userQuestion(payload, environment) {
    const config = this.getConfig("userQuestion", environment);
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async getTTS({ welcome_intent_response = '', official_response = '', external_response = '', lang_code = 'en-US' }, environment = 'development') {
    const config = this.getConfig("getTTS", environment);
    const payload = {
      welcome_intent_response,
      official_response,
      external_response,
      lang_code,
    };
    try {
      const response = await axios({ ...config, data: payload });
      return response.data;
    } catch (error) {
      console.error('TTS API error:', error);
      throw error;
    }
  }

  // Add this method for admin dashboard feedback fetch
  async getNegativeFeedback(payload, environment = "development") {
    const apiKey = environment === "production"
      ? this.prodApiKeys
      : this.devApiKeys;
    const url = "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/get/feedback";
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });
      return response.data;
    } catch (error) {
      // return (error.message)
      console.error("Error fetching negative feedback:", error.message);
      throw error;
    }
  }

  // Add image upload method
  async uploadImage(payload, environment = "development") {
    const apiKey = environment === "production"
      ? this.prodApiKeys
      : this.devApiKeys;
    const url = "https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/image/upload";
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
}

export default new ChatService();