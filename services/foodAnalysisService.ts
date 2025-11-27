import * as FileSystem from 'expo-file-system';

export interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portionSize?: string;
  confidence?: string;
}

/**
 * Analyzes a food image using Claude Vision API
 * @param imageUri - The local URI of the image to analyze
 * @param apiKey - Anthropic API key
 * @returns Promise with nutritional information
 */
export async function analyzeFoodImage(
  imageUri: string,
  apiKey: string
): Promise<FoodAnalysisResult> {
  try {
    // Convert image to base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Determine media type from URI
    const mediaType = imageUri.toLowerCase().endsWith('.png')
      ? 'image/png'
      : 'image/jpeg';

    // Call Claude Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `Analyze this food image and provide nutritional information.

Please identify the food item(s) and estimate the nutritional values for the portion shown in the image.

Respond ONLY with a JSON object in this exact format (no markdown, no explanations):
{
  "foodName": "name of the food",
  "calories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fats": number (in grams),
  "portionSize": "estimated portion size",
  "confidence": "high/medium/low"
}

If multiple food items are visible, combine them into a single meal entry.`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();

    // Extract text content from Claude's response
    const textContent = data.content.find((c: any) => c.type === 'text')?.text;

    if (!textContent) {
      throw new Error('No text response from API');
    }

    // Parse JSON response
    let jsonText = textContent.trim();

    // Remove markdown code block if present
    if (jsonText.startsWith('```')) {
      // Remove opening ```json or ``` and closing ```
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText);

    // Validate required fields
    if (!parsed.foodName || typeof parsed.calories !== 'number') {
      throw new Error('Invalid response format: missing required fields');
    }

    // Build result with validation
    const result: FoodAnalysisResult = {
      foodName: parsed.foodName,
      calories: Math.round(parsed.calories),
      protein: Math.round(parsed.protein || 0),
      carbs: Math.round(parsed.carbs || 0),
      fats: Math.round(parsed.fats || 0),
      portionSize: parsed.portionSize,
      confidence: parsed.confidence,
    };

    return result;

  } catch (error) {
    console.error('Food analysis error:', error);
    throw error;
  }
}

/**
 * Validates that the API key is set
 */
export function validateApiKey(apiKey: string | undefined): boolean {
  return !!apiKey && apiKey.length > 0 && apiKey.startsWith('sk-ant-');
}
