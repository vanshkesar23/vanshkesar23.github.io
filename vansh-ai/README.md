# Vansh AI

Vansh AI is the local AI assistant embedded in Vansh Kesar's portfolio.

## What it does

- Answers questions about Vansh Kesar, his work, projects, skills, and portfolio.
- Runs an open-source Qwen3 0.6B model locally in the visitor's browser through WebLLM.
- Keeps the conversation in the browser session instead of sending prompts to a hosted AI API.
- Uses a portfolio-specific knowledge prompt so the assistant stays focused on Vansh.

## Source

The live implementation is currently used by the portfolio from:

- `assets/vansh-ai.js`

This folder documents the Vansh AI project as an open-source component of the portfolio repository.

## Tech

- JavaScript
- WebLLM
- Qwen3 0.6B (MLC)
- WebGPU-capable browser

## Run locally

Serve the portfolio with any static HTTP server and open the site in a WebGPU-capable browser. On first use, WebLLM downloads the model assets; inference then runs locally in the browser.

## Notes

The model is intentionally small so it can run client-side. Response quality and startup time depend on the visitor's device and browser.

## License

MIT License. See `LICENSE` in this directory.
