import Hero from "../components/sections/Hero";
import Featured from "../components/sections/Featured";
import Categories from "../components/sections/Categories";
import Newsletter from "../components/sections/Newsletter";
import WhyUs from "../components/sections/WhyUs";

const Home = () => {
  return (
    <main>
      <Hero />
      <WhyUs />
      <Featured />
      <Categories />
      <Newsletter />
    </main>
  );
};

export default Home;
