# <img src="img/lunaLogo.svg" alt="drawing" width="25"/> LunaCopilot: An Integrated AI Assistant for System Dynamics Modeling
> :warning: LunaSim uses the [GoJS Library](https://gojs.net/), which is free for non-commercial, non-production use.  For commercial/production use, please obtain a license from them.

**LunaSim Copilot** is an integrated AI assistant for system dynamics (SD) modeling, developed as an extension to the lightweight, open-source web-based modeling software [LunaSim](https://lunasim.org/). The Copilot enables natural language-driven creation and editing of stock-and-flow models, powered by large language models (LLMs).

## Features

- **AI-Powered Modeling**: Generate complete system dynamics models from natural language prompts.
- **Integrated Chat Interface**: In-application chat interface allows for intuitive model editing and iteration.
- **Evaluation Framework**: Includes a detailed rubric-based evaluation of model accuracy, structure, and formatting.
- **Support for Multiple LLMs**: Assessed with GPT-4o, o3-mini, Deepseek-R1, and Claude 3.7 Sonnet.

## Installation

### Prerequisites
- Access to OpenAI, Anthropic, or DeepSeek API keys for model integration

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oboy-1/LunaSimCopilot.git
   cd LunaSimCopilot
2. Add your API keys in `chatconfig.js`:
