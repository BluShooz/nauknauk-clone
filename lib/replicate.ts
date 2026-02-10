import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export interface AnimationParams {
  image: string
  prompt: string
  template?: string
}

export async function animateImage(params: AnimationParams) {
  try {
    // Using Stable Video Diffusion for image-to-video
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          cond_aug: 0.02,
          decoding_t: 7,
          input_image: params.image,
          video_length: "14",
          sizing_strategy: "maintain_aspect_ratio",
          motion_bucket_id: 127,
          frames_per_second: 6,
        },
      }
    )

    return output
  } catch (error) {
    console.error('Animation error:', error)
    throw error
  }
}

export async function animateWithPrompt(params: AnimationParams) {
  try {
    // Alternative: Use ModelScope for text-guided animation
    const output = await replicate.run(
      "cjwbw/deep-floyd-if:84d23a51079c46d2f305005d75f18ffb1c3fb4b22b3cbc2bd32a5ef56084222e",
      {
        input: {
          image: params.image,
          prompt: params.prompt,
          negative_prompt: "blurry, low quality, distorted",
          num_inference_steps: 50,
        },
      }
    )

    return output
  } catch (error) {
    console.error('Animation with prompt error:', error)
    throw error
  }
}
