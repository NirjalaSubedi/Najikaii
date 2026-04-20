import Navbar from './Components/Navbar'
import LocationBanner from './Components/LocationBanner';
import ImageBanner from './Components/ImageBanner';
import CategorySelector from './Components/CategorySelector';
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LocationBanner/>
      <ImageBanner/>
      <CategorySelector/>
    </div>
  );
}

export default App;