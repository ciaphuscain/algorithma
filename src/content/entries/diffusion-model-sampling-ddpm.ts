import type { AlgorithmEntry } from "../types";

export const diffusionModelSamplingDdpmEntry: AlgorithmEntry = {
  slug: "diffusion-model-sampling-ddpm",
  name: "Diffusion Model Sampling (DDPM)",
  aliases: ["DDPM", "Denoising Diffusion Probabilistic Model"],
  curriculum: [585],
  domain: "deep-learning",
  subcategory: "Deep Learning",
  difficulty: "intermediate",
  summary:
    "Generates data by iteratively denoising a sample of pure Gaussian noise through T learned reverse diffusion steps, each removing a small amount of noise predicted by a neural network.",
  tags: ["generative model", "diffusion", "denoising", "deep learning"],
  prerequisites: ["Backpropagation"],
  related: [],
  problem: {
    input: "A trained DDPM model and T timesteps.",
    output: "A generated sample (e.g., an image) produced by iterative denoising.",
  },
  levels: {
    intuition: [
      {
        kind: "p",
        text: "The forward process gradually adds Gaussian noise to data over T steps until it becomes pure noise. The reverse process learns to undo each step: given a noisy sample at time t, a neural network predicts the noise, which is subtracted to get a slightly cleaner sample at time t−1.",
      },
      {
        kind: "p",
        text: "Starting from pure noise and running the reverse process for T steps produces a sample from the data distribution. The key insight is that each reverse step is simple (small Gaussian perturbation) even though the overall transformation is complex.",
      },
    ],
    mechanics: [
      {
        kind: "list",
        ordered: true,
        items: [
          "Start with x_T ~ N(0, I) (pure Gaussian noise).",
          "For t = T, T−1, ..., 1: predict the noise ε_θ(x_t, t) using the trained network.",
          "Compute x_{t−1} = (1/√α_t)(x_t − (β_t/√(1−ᾱ_t))ε_θ(x_t, t)) + σ_t z, where z ~ N(0,I).",
          "Return x_0 as the generated sample.",
        ],
      },
      {
        kind: "p",
        text: "The schedule {β_t} controls how much noise is added/removed at each step. ᾱ_t = ∏(1 − β_s) is the cumulative noise scale.",
      },
    ],
    implementation: [
      {
        kind: "list",
        items: [
          "The neural network (typically a U-Net) takes the noisy input and timestep as inputs.",
          "Training minimizes the simple loss ||ε − ε_θ(x_t, t)||² where ε is the actual noise added.",
          "Sampling requires T forward passes; DDIM and other methods reduce this to fewer steps.",
        ],
      },
    ],
    mathematics: [
      {
        kind: "p",
        text: "The forward process is q(x_t|x_{t−1}) = N(x_t; √(1−β_t)x_{t−1}, β_t I). The reverse process p_θ(x_{t−1}|x_t) is trained to approximate the true reverse.",
      },
      {
        kind: "p",
        text: "Sampling takes O(T) neural network forward passes. Each pass is O(model_size). Total: O(T × model_size).",
      },
    ],
    advanced: [
      {
        kind: "list",
        items: [
          "DDIM (Denoising Diffusion Implicit Models) enables deterministic sampling in fewer steps.",
          "Classifier-free guidance improves sample quality by interpolating conditional and unconditional predictions.",
          "Score-based generative models provide an equivalent continuous-time SDE formulation.",
        ],
      },
    ],
  },
  complexity: {
    time: {
      best: "O(T)",
      average: "O(T)",
      worst: "O(T)",
    },
    space: "O(d)",
    worstClass: "n",
    note: "T denoising steps on d-dimensional data.",
  },
  properties: [
    {
      label: "Type",
      value: "Generative model",
    },
    {
      label: "Steps",
      value: "T (typically 1000)",
    },
    {
      label: "Quality",
      value: "State-of-the-art image generation",
    },
  ],
  implementations: [
    {
      language: "python",
      entry: "ddpm_sample_1d",
      code: `def ddpm_sample_1d(T, betas):
    """Simplified 1D DDPM sampling demo (no neural network, just noise schedule).
    Returns the variance of the noise schedule at each step."""
    import math
    alphas = [1 - b for b in betas]
    alpha_bar = []
    prod = 1.0
    for a in alphas:
        prod *= a
        alpha_bar.append(prod)
    return round(alpha_bar[-1], 6)
`,
      tests: [
        {
          args: [3, [0.1, 0.2, 0.3]],
          expected: 0.504,
        },
        {
          args: [2, [0.5, 0.5]],
          expected: 0.25,
        },
      ],
    },
  ],
  visualizer: null,
  practice: [
    {
      id: "ddpm-forward",
      kind: "mcq",
      prompt: "What does the forward process of DDPM do?",
      options: [
        "Gradually adds Gaussian noise to data",
        "Removes noise from data",
        "Compresses data",
        "Classifies data",
      ],
      answer: 0,
      explanation:
        "The forward process adds small amounts of Gaussian noise over T steps until the data becomes pure noise.",
      hints: ["Think about what the model must undo during sampling."],
      objective: "Understand the DDPM forward process",
    },
  ],
  exam: {
    definition:
      "DDPM generates samples by iteratively denoising Gaussian noise through T learned reverse steps.",
    steps: [
      "Sample x_T from N(0,I).",
      "For t=T..1: predict noise, subtract scaled prediction, add small noise.",
      "Return x_0.",
    ],
    timeComplexity: "O(T) network evaluations",
    spaceComplexity: "O(d) for d-dimensional data",
    correctness: "The reverse process approximates the true posterior of the forward diffusion.",
    applications: ["Image generation", "Audio synthesis", "3D shape generation"],
    limitations: ["Slow sampling (T steps)", "High compute cost for training"],
    faq: [
      {
        q: "How can sampling be accelerated?",
        a: "DDIM enables fewer-step deterministic sampling.",
      },
    ],
    answers: [
      {
        marks: 2,
        outline: ["Forward diffusion adds noise.", "Reverse process denoises iteratively."],
      },
    ],
  },
  references: [
    {
      citation:
        "J. Ho, A. Jain, P. Abbeel, 'Denoising Diffusion Probabilistic Models,' NeurIPS 2020.",
      supports: "The original DDPM paper.",
    },
  ],
  review: {
    status: "draft",
    note: "Written with AI assistance. Code samples and the worked example are checked by automated tests; the prose has not yet had expert review.",
  },
  version: 1,
  updated: "2026-10-27",
};
