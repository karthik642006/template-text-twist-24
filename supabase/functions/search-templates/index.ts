
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
    const { query, category = "", page = 1, per_page = 15 } = await req.json()

    if (!query && !category) {
      return new Response(
        JSON.stringify({ error: "Query or category is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = Deno.env.get('PEXELS_API_KEY')
    if (!apiKey) {
      console.error("Pexels API key not found")
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Build search query
    let searchQuery = query || category
    if (category && query) {
      searchQuery = `${query} ${category}`
    }

    console.log("Searching Pexels for:", searchQuery)

    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&page=${page}&per_page=${per_page}&orientation=all`

    const response = await fetch(pexelsUrl, {
      headers: {
        'Authorization': apiKey,
        'User-Agent': 'MemeGen/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Pexels API failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform Pexels response to our format
    const templates = data.photos.map((photo: any) => ({
      id: photo.id,
      name: photo.alt || searchQuery,
      image: photo.src.large,
      thumbnail: photo.src.medium,
      category: category || "search",
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      pexels_url: photo.url
    }))

    console.log(`Found ${templates.length} templates from Pexels`)

    return new Response(
      JSON.stringify({ 
        templates,
        total_results: data.total_results,
        page: data.page,
        per_page: data.per_page,
        next_page: data.next_page
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: unknown) {
    console.error('Error in search-templates:', error)
    const errorMessage = error instanceof Error ? error.message : "Failed to search templates"
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
