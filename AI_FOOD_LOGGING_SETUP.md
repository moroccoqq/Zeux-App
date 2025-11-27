# AI Food Logging Setup Guide

This guide will help you set up the AI-powered food recognition feature in Zeux-App.

## Overview

The AI food logging feature uses **Claude Vision API** by Anthropic to automatically:
- Identify food items from photos
- Estimate portion sizes
- Calculate calories and macronutrients (protein, carbs, fats)
- Auto-populate the food entry form

## Prerequisites

1. **Anthropic API Account**: You need an API key from Anthropic
2. **Active internet connection**: The app makes API calls to analyze images

## Setup Steps

### Step 1: Get Your Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key (it will start with `sk-ant-`)
5. Copy the API key (you won't be able to see it again!)

### Step 2: Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:
   ```
   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   ```

3. **Important**: Never commit your `.env` file to Git. It's already in `.gitignore`.

### Step 3: Restart the Development Server

After adding the API key, restart your Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm start
```

## How It Works

1. **Take a photo** or **select from gallery** in the Add Food screen
2. The app automatically sends the image to Claude Vision API
3. Claude analyzes the image and returns:
   - Food name
   - Estimated portion size
   - Calories
   - Macronutrients (protein, carbs, fats)
4. The form is auto-populated with the results
5. You can review and edit the values before saving

## Features

✅ **Automatic Detection**: AI identifies food items from photos
✅ **Smart Estimates**: Calculates nutritional values based on portion size
✅ **Manual Override**: You can always edit the AI-generated values
✅ **Graceful Fallback**: If AI analysis fails, manual entry still works
✅ **No API Key Required for Manual Entry**: AI is optional

## API Costs

Claude Vision API pricing (as of 2025):
- **Claude 3.5 Sonnet**: ~$3 per 1000 images analyzed
- Images are sent as base64 (typically 200-400 tokens per image)
- Each analysis uses ~400-600 total tokens

**Estimated cost**: $0.003-0.006 per food photo analyzed

## Privacy & Security

- Images are sent to Anthropic's API for processing
- No images are stored on Anthropic's servers beyond the API call
- Your API key is stored locally and never shared
- All API calls use HTTPS encryption

## Troubleshooting

### "API Key Missing" Error
- Make sure you created the `.env` file
- Verify the API key starts with `sk-ant-`
- Restart the Expo development server

### "Analysis Failed" Error
- Check your internet connection
- Verify your API key is valid and has credits
- Try taking a clearer photo with better lighting
- You can still enter food details manually

### Form Not Auto-Populating
- Wait for the "Analyzing food..." overlay to disappear
- Check the console/terminal for error messages
- Ensure the image is clear and contains recognizable food

## Example Response

When you take a photo of a meal, Claude might return:

```json
{
  "foodName": "Grilled Chicken Breast with Rice and Vegetables",
  "calories": 520,
  "protein": 45,
  "carbs": 52,
  "fats": 12,
  "portionSize": "1 plate (approx. 350g)",
  "confidence": "high"
}
```

## Technical Details

- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **Image Format**: Base64-encoded JPEG/PNG
- **Max Tokens**: 1024 per request
- **Response Format**: JSON

## Support

For issues with:
- **Zeux-App**: Open an issue in the project repository
- **Anthropic API**: Visit [Anthropic Support](https://support.anthropic.com/)

---

**Note**: The AI provides estimates based on visual analysis. For medical or dietary purposes, always verify nutritional information with authoritative sources or consult a healthcare professional.
