import "./App.css";
import Splash from "./components/Splash";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {

  return (
    <div 
      className="desktop-screen"
    >
      <Splash/>
      <Header/>
      <section className="window-area"></section>
      <Footer/>
    </div>
  );
};

export default App;
