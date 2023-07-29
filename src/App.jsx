import Canvas from "./canvas/index.jsx";
import Customizer from "./pages/Customizer.jsx";
import Home from "./pages/Home.jsx";

function App() {
    return (<main className="app transition-all ease-in bg-gradient-to-br from-blue-400 to-purple-500">
        <Home/>
        <Canvas/>
        <Customizer/>
    </main>)
}

export default App
