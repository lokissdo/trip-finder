import Navbar from "../../components/Navbar";
import SearchBar from "../../components/Search";

const Home: React.FC = () => {
  return (
    <div>
      <div className="relative">
        <div style={{ height: 450 }} className="overflow-hidden">
          <img src="https://images.unsplash.com/photo-1605036687969-9c2878c7395b" />
        </div>
        <div className="absolute top-0 w-full px-12 py-8">
          <Navbar />
        </div>
        <div className="absolute m-auto left-0 right-0 -bottom-10 border rounded-lg w-3/4 bg-white shadow-lg">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
