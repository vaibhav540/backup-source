const key = "T15AZjNsUVZYdjRmQUEoZGN3TlEyQnh2Q0dwdUY4OWE=";

export const decryptUrl = async (encryptedUrl, iv) => {
  console.log("Decrypting URL:", encryptedUrl,"here is IV", iv);
  try {
    const base64ToArrayBuffer = (base64) => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    };

    const arrayBufferToString = (buffer) => {
      const decoder = new TextDecoder("utf-8");
      return decoder.decode(buffer);
    };

    const keyBuffer = base64ToArrayBuffer(key);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    const ivBuffer = base64ToArrayBuffer(iv);
    const encryptedBuffer = base64ToArrayBuffer(encryptedUrl);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: ivBuffer,
      },
      cryptoKey,
      encryptedBuffer
    );

    return arrayBufferToString(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    return encryptedUrl;
  }
};

export const processCitations = async (citations, environment) => {
  if (environment !== "production") return citations;

  const processedCitations = await Promise.all(
    citations.map(async (citation) => {
      try {
        const processedCitation = { ...citation };

        if (citation.actionLink && citation.pdf_url_iv) {
          processedCitation.actionLink = await decryptUrl(
            citation.actionLink,
            citation.pdf_url_iv
          );
        }

        if (citation.imageLink && citation.img_url_iv) {
          processedCitation.imageLink = await decryptUrl(
            citation.imageLink,
            citation.img_url_iv
          );
        }

        delete processedCitation.originalImageLink;

        return processedCitation;
      } catch (error) {
        console.error("Error processing citation:", error);
        return citation;
      }
    })
  );

  return processedCitations;
};
