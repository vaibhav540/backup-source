import axios from "axios";

class ChatService {
  async sendMessage(payload) {
    let config = {
      method: "post",
      url: `https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/phase2/keyword`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-API-Key": "AIzaSyC9s3SJxJNLgWdRotkB52UTHzEsfuU3mWo",
      },
      data: payload,
    };

    try {
      const response = await axios(config);
      return response.data; // Return response data
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }
}

export default new ChatService();