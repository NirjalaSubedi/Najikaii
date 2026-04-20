import Navbar from './Components/Navbar'
import LocationBanner from './Components/LocationBanner';
import ImageBanner from './Components/ImageBanner';
import AllCategory from './Components/AllCategory';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LocationBanner/>
      <ImageBanner/>
      <AllCategory/>
    </div>
  );
}

export default App;