import React from "react";
import "./style.css";
import Image1 from "../../assets/image_1.png";
import Image2 from "../../assets/image_2.png";
import Image3 from "../../assets/image_3.png";
import Image4 from "../../assets/image_4.png";

const LandingPage = () => (
  <div>
    <header>
      <h1>BudgetMate</h1>
      <p>Take Control of Your Money</p>
      <a href="/home" className="btn">
        Create an account
      </a>
    </header>
    <section className="screenshots">
      <div className="screenshot">
        <img src={Image1} alt="Banner" />
        <p>Home page</p>
      </div>
      <div className="screenshot">
        <img src={Image2} alt="Banner" />
        <p>Transactions</p>
      </div>
      <div className="screenshot">
        <img src={Image3} alt="Banner" />
        <p>Add transaction</p>
      </div>
      <div className="screenshot">
        <img src={Image4} alt="Banner" />
        <p>Manage categories</p>
      </div>
    </section>
    <footer>
      <p>&copy; 2024 BudgetMate</p>
    </footer>
  </div>
);

export default LandingPage;
