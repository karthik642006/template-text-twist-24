
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, layout = "single" } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get API keys from environment
    const apiKeys = [
      Deno.env.get('POLLINATION_API_KEY_1'),
      Deno.env.get('POLLINATION_API_KEY_2'),
      Deno.env.get('POLLINATION_API_KEY_3')
    ].filter(Boolean)

    if (apiKeys.length === 0) {
      console.error("No API keys found in environment")
      return new Response(
        JSON.stringify({ error: "No API keys configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create enhanced prompt with meme rules
    const enhancedPrompt = createMemePrompt(prompt, layout)
    
    console.log("Generating image with prompt:", enhancedPrompt)

    // Try API keys in rotation
    let imageUrl = null
    let lastError = null

    for (const apiKey of apiKeys) {
      try {
        imageUrl = await generateImageWithPollination(enhancedPrompt, apiKey as string)
        if (imageUrl) {
          console.log("Successfully generated image:", imageUrl)
          break
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.log(`API key failed, trying next:`, errorMessage)
        lastError = error
        continue
      }
    }

    if (!imageUrl) {
      console.error("All API keys failed, last error:", lastError)
      throw lastError || new Error("All API keys failed")
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        prompt: enhancedPrompt,
        layout 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: unknown) {
    console.error('Error in generate-meme-image:', error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image"
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function createMemePrompt(userPrompt: string, layout: string): string {
  const baseRules = [
    "no text or words in the image",
    "no copyrighted characters or logos",
    "meme-appropriate style",
    "high contrast for text overlay",
    "clear and simple composition"
  ]

  let layoutPrompt = ""
  switch (layout) {
    case "split-horizontal":
      layoutPrompt = "image split horizontally into two clear sections, top and bottom parts with distinct scenes"
      break
    case "split-vertical":  
      layoutPrompt = "image split vertically into two clear sections, left and right parts with contrasting scenes"
      break
    case "quad":
      layoutPrompt = "image divided into four equal quadrants, each showing a different scene or reaction"
      break
    default:
      layoutPrompt = "single scene perfect for meme text overlay"
  }

  return `${userPrompt}, ${layoutPrompt}, ${baseRules.join(", ")}, photorealistic, high quality`
}

async function generateImageWithPollination(prompt: string, apiKey: string): Promise<string> {
  const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
  
  const params = new URLSearchParams({
    width: "1024",
    height: "1024", 
    seed: Math.floor(Math.random() * 1000000).toString(),
    model: "flux",
    enhance: "true",
    nologo: "true"
  })

  const fullUrl = `${pollinationUrl}?${params.toString()}`
  
  console.log("Calling Pollination API:", fullUrl)
  
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'MemeGen/1.0',
        'Accept': 'image/*'
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    if (!response.ok) {
      throw new Error(`Pollination API failed: ${response.status} ${response.statusText}`)
    }

    // Check if response is actually an image
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Expected image response, got: ${contentType}`)
    }

    console.log("Successfully fetched image from Pollination API")
    return fullUrl
  } catch (error) {
    console.error("Error calling Pollination API:", error)
    throw error
  }
}
