import Hero from "../components/sections/Hero";
import Featured from "../components/sections/Featured";
import Categories from "../components/sections/Categories";
import Newsletter from "../components/sections/Newsletter";
import WhyUs from "../components/sections/WhyUs";

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <Featured />
      <WhyUs />
      <Newsletter />
    </main>
  );
};

export default Home;
