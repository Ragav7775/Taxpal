import { Link } from "react-router-dom"; 
import welcomeImage from "../assets/welcomeimage.png";

const WelcomePage = () => { 
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] text-center">
        <h1 className="text-2xl font-bold text-customBlue mb-4">TaxPal</h1>
        <p className="text-gray-800 font-medium mb-6">Smarter Taxes start here</p>
        <img
          src={welcomeImage}
          alt="Welcome"
          className="mx-auto mb-6 w-56 h-auto"
        />
        <Link to="/SignIn"> 
          <button
            className="w-full bg-customBlue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
