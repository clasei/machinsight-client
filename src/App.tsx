import CurrentData from "./components/CurrentData";
import './styles/App.css';


//   function App() {
// ---> React.FC added to dfine App as a functional component
const App: React.FC = () => {

    return (
        <div>
          <CurrentData />
        </div>
      );
    };
    
    export default App;