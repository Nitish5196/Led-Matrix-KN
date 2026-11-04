require('dotenv').config();
const express = require('express');
const path = require('path');
const sharp = require('sharp');
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let currentDisplay = {
  type: 'text',
  content: 'ENTER TRACKING DETAILS'
};


app.post('/api/track', async (req, res) => {
  const { carrier, trackingNumber } = req.body;

  if (!carrier || !trackingNumber) {
    return res.status(400).json({ status: 'error', message: 'Carrier and Tracking Number are required.' });
  }

  const carrierSlug = carrier.toLowerCase().trim();
  let success = false;
  let statusText = "IN TRANSIT";

  // Tier 1: TrackCourier.io
  if (process.env.TRACKCOURIER_API_KEY) {
    try {
      const res1 = await fetch(`https://api.trackcourier.io/v1/track?courier=${carrierSlug}&tracking_number=${trackingNumber}`, {
        headers: { 'X-API-Key': process.env.TRACKCOURIER_API_KEY }
      });
      if (res1.ok) {
        const json = await res1.json();
        const desc = json.data?.MostRecentStatus || json.data?.status;
        if (desc) { statusText = desc.toUpperCase(); success = true; }
      }
    } catch (e) {}
  }

  
  if (!success && process.env.TRACK123_API_KEY) {
    try {
      const res2 = await fetch('https://api.track123.com/gateway/open-api/tk/v2.1/track/query', {
        method: 'POST',
        headers: {
          'Track123-Api-Secret': process.env.TRACK123_API_KEY,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({ trackNos: [trackingNumber], carrier: carrierSlug })
      });
      if (res2.ok) {
        const json = await res2.json();
        const item = json.data?.[0];
        const desc = item?.trackInfo?.latestCheckpoint?.checkpointDescription || item?.status;
        if (desc) { statusText = desc.toUpperCase(); success = true; }
      }
    } catch (e) {}
  }

  currentDisplay = {
    type: 'text',
    carrier: carrierSlug,
    content: `${carrier.toUpperCase()}: ${trackingNumber} - ${statusText}`
  };

  res.json({ status: 'success', display: currentDisplay });
});


app.post('/api/convert-image', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ status: 'error', message: 'No image provided.' });
  }

  try {
    const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    
    const resizedBuffer = await sharp(buffer)
      .resize(64, 64, { fit: 'fill' })
      .raw()
      .toBuffer();

    currentDisplay = {
      type: 'image',
      width: 64,
      height: 64,
      pixels: resizedBuffer.toString('base64')
    };

    console.log('[Image Converter] Successfully processed image to 64x64 for ESP32.');
    res.json({ status: 'success', message: 'Image resized to 64x64 and sent to matrix!' });
  } catch (err) {
    console.error('[Image Error]:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.post('/api/generate-ai-image', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt is required.' });
  }

  try {
    console.log(`[Hack Club AI] Generating image for: "${prompt}"...`);
    
    const aiRes = await fetch('https://ai.hackclub.com/proxy/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HACKCLUB_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        prompt: prompt + ", pixel art, 64x64 matrix style, vibrant colors",
        n: 1,
        size: '512x512'
      })
    });

    if (!aiRes.ok) {
      throw new Error(`Hack Club AI returned status ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const imageUrl = aiJson.data?.[0]?.url || aiJson.data?.[0]?.b64_json;

    let imageBuffer;
    if (imageUrl.startsWith('http')) {
      const imgFetch = await fetch(imageUrl);
      imageBuffer = Buffer.from(await imgFetch.arrayBuffer());
    } else {
      imageBuffer = Buffer.from(imageUrl, 'base64');
    }

    const resizedBuffer = await sharp(imageBuffer)
      .resize(64, 64, { fit: 'fill' })
      .raw()
      .toBuffer();

    currentDisplay = {
      type: 'image',
      width: 64,
      height: 64,
      pixels: resizedBuffer.toString('base64')
    };

    console.log('[Hack Club AI] Successfully generated and resized image to 64x64!');
    res.json({ status: 'success', message: 'Orph AI image generated & sent to matrix!' });

  } catch (err) {
    console.error('[AI Generation Error]:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});


app.get('/matrix', (req, res) => {
  res.json(currentDisplay);
});

app.listen(PORT, () => {
  console.log(`Matrix Dashboard running locally at http://localhost:${PORT}`);
});

if (process.env.VERCEL) {
  const serverless = require('serverless-http');
  module.exports = serverless(app);
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Matrix Dashboard running locally at http://localhost:${PORT}`);
  });
}