# LMStudio API Angular Playground

This project is built with Angular 17 and Angular Material, enabling interaction with large language models (LLMs) loaded in the LM Studio application. The application allows users to display the various loaded models, change the internal prompt, and update the API URL for LM Studio.

## Features ✨

- **LLM Interaction:** Send queries and receive responses from large language models loaded in LM Studio.
- **Model Visualization:** Display the various language models currently loaded in memory.
- **Dynamic Configuration:** Change the internal prompt and the LM Studio API URL from the user interface.

## Requirements 📋

- **Node.js** (version 14 or higher)
- **Angular CLI**
- **LM Studio**

## Installation 💻

1. Clone this repository to your local machine.
    ```bash
    git clone https://github.com/marcguillemdev/LMStudio-API-Angular-Playground
    ```
2. Navigate to the project directory.
    ```bash
    cd LMStudio-API-Angular-Playground
    ```
3. Install the project dependencies.
    ```bash
    npm install
    ```

## Usage 🚀

1. Ensure that **LM Studio** is running and accessible at the configured URL.
2. Start the Angular application.
    ```bash
    ng serve
    ```
3. Open your web browser and navigate to `http://localhost:4200` to view the application.

## Configuration ⚙️

You can change the **LM Studio API URL** and the **internal prompt** through the configuration dialog in the application. Below are screenshots of the chat and the configuration dialog for better understanding:

### Chat Screenshot 🖼️
![Chat Screenshot](https://github.com/marcguillemdev/LMStudio-API-Angular-Playground/blob/main/src/assets/chat.png?raw=true)

### Configuration Dialog Screenshot 🛠️
![Config Dialog Screenshot](https://github.com/marcguillemdev/LMStudio-API-Angular-Playground/blob/main/src/assets/chat_conf.png?raw=true)

## License 📄
This project is licensed under the **GPL-3.0**. See the LICENSE file for more details.
