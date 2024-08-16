# PantryPal

Welcome to **PantryPal**! This is your ultimate companion to managing your pantry, generating recipes, and planning meals with ease.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About

**PantryPal** helps you keep track of what you have in your pantry, ensures you never miss out on using ingredients before they expire, and gives you personalized recipes and meal plans based on what you have on hand. It’s designed to be user-friendly and efficient, making your kitchen management seamless.



### Features

**1. Item Management System**
   - **CRUD Operations with Firestore:** The application provides full Create, Read, Update, and Delete (CRUD) capabilities for managing pantry items. All data is stored in a Firestore database, allowing real-time updates and scalability.
   - **Image Upload with Firebase Storage:** Users can upload images associated with pantry items. The images are stored in Firebase Storage, and the application retrieves and displays these images via the Firebase `getDownloadURL` function.
   - **UUID for Image Identification:** Unique identifiers (UUIDs) are generated for each image file to avoid filename conflicts and ensure secure and unique storage in Firebase.

**2. Date Management with React DatePicker**
   - **Expiration Date Tracking:** Users can select and assign expiration dates to pantry items using the React DatePicker component. The selected date is stored in Firestore, allowing users to track and manage item expiration.

**3. Real-Time UI Updates**
   - **Loading Spinner Integration:** An animated spinner (`react-loader-spinner`) is displayed during data fetching and processing operations, ensuring a smooth user experience while background tasks are executed.
   - **Conditional Rendering:** The application conditionally renders different views (e.g., items list, recipe generator, meal planner) based on user interactions, controlled by React state.

**4. Generative AI Integration for Recipe and Meal Plan Suggestions**
   - **Google Generative AI Integration:** The application uses Google's Generative AI API to generate recipes and meal plans based on the current items in the user's pantry. 
   - **Dynamic Prompt Generation:** The names of the pantry items are dynamically concatenated and passed to the AI as a prompt, which then generates a contextual recipe or meal plan without requiring further user input.

**5. Responsive and Interactive UI**
   - **Responsive Design:** The UI is built to be fully responsive, ensuring a seamless experience across various devices and screen sizes, from desktops to mobile devices.
   - **Interactive Image Handling:** The application allows users to upload images for pantry items and preview them before submission. This enhances the interactivity of the app and provides users with visual feedback.

**6. View Modes for Enhanced User Experience**
   - **Toggle Between Views:** Users can toggle between different views (`Items`, `Recipe`, and `Meal Plan`) using buttons that adjust the application state. This enables users to easily navigate between managing their pantry, generating recipes, and planning meals.
   - **Item Editing and Deletion:** Users can edit or delete items directly from the list view. The edit function pre-populates the form with the existing item data for ease of updating.

**7. Firebase Firestore as the Backend**
   - **Firestore Collection Handling:** The app uses Firestore collections to store and manage pantry items. Each pantry item is stored as a document within a specific collection (`PantryID`), with fields such as name, quantity, price, category, and location.
   - **Document Referencing for Updates and Deletion:** The app references specific documents by their unique IDs for efficient updating and deletion operations.

**8. State Management with React Hooks**
   - **Use of React Hooks:** State management is handled with React's `useState` and `useEffect` hooks. These hooks manage form inputs, list data, loading states, and view modes, ensuring a reactive and responsive user interface.
   - **Asynchronous Data Fetching:** The app leverages `useEffect` for data fetching, ensuring that Firestore data is retrieved as soon as the component mounts, and the UI is updated in real-time.


## Getting Started

### Prerequisites

To run this project locally, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Firebase account with Firestore and Storage enabled
- Google API Key for generative AI

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/pantrypal.git
   cd pantrypal
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Firebase:**

   - Create a Firebase project.
   - Set up Firestore and Storage in Firebase.
   - Add your Firebase config to `src/config/firebase.js`.

4. **Set up Google Generative AI:**

   - Obtain an API key from Google Cloud.
   - Create a `.env` file in the root directory and add your API key:

     ```
     VITE_API_KEY=your_google_ai_api_key
     ```

5. **Start the development server:**

   ```bash
   npm start
   ```

   Your app will be available at `http://localhost:3000`.

## Usage

- **Adding Items:** Use the form to add items to your pantry, including images and details like quantity, price, and category.
- **Generating Recipes:** Click on "Generate Recipe" to create a recipe using your pantry items.
- **Meal Planning:** Get a meal plan suggestion tailored to your pantry's contents.
- **Updating/Deleting Items:** Easily update or delete items as you use them or add new stock.

## Contributing

We welcome contributions! If you'd like to contribute to PantryPal, please fork the repository and submit a pull request. 

1. Fork the repo.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Enjoy using **PantryPal** and happy cooking! 🍲
