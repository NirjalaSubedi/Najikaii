import Navbar from './Components/Navbar'
import LocationBanner from './Components/LocationBanner';
import ImageBanner from './Components/ImageBanner';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LocationBanner/>
      <ImageBanner/>
    </div>
  );
}

export default App;