"""Simple example to call Azure Model Inference with a GitHub Models endpoint.

Set the environment variable `GITHUB_TOKEN` before running:

```bash
export GITHUB_TOKEN=your_token_here
python scripts/azure_inference.py
```
"""

import os

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


def main() -> None:
    """Run a sample chat completion request against the configured model."""
    token = os.environ["GITHUB_TOKEN"]

    client = ChatCompletionsClient(
        endpoint="https://models.github.ai/inference",
        credential=AzureKeyCredential(token),
    )

    response = client.complete(
        messages=[
            SystemMessage("You are a helpful assistant."),
            UserMessage("What is the capital of France?"),
        ],
        temperature=1.0,
        top_p=1.0,
        model="openai/gpt-4.1",
    )

    print(response.choices[0].message.content)


if __name__ == "__main__":
    main()
