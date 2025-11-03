# 🛍️ GTP — Full-Stack E-Commerce Platform (MERN)

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![PayPal](https://img.shields.io/badge/PayPal-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/)

---

## 🌟 Project Overview

**GTP** is a production-ready **MERN stack e-commerce platform** that provides:

- A seamless shopping experience for users  
- Secure payment integration (Stripe / PayPal)  
- Real-time order notifications via email  
- Complete admin dashboard to manage products, orders, users, messages, and testimonials  

This project demonstrates end-to-end **full-stack development skills**, **real-world app functionality**, and attention to **scalable, maintainable code**.

---

## 🚀 Key Features

### User-Facing
- 🔐 Secure signup and login with JWT authentication  
- 🛒 Add products to cart, checkout, and track orders  
- 💳 Payment integration with **Stripe / PayPal**  
- 🔍 Product search and category filtering  
- 📦 Inventory stock alerts for low-stock items  
- 🧾 Email notifications for order confirmations  
- 📱 Fully responsive mobile-first design  

### Admin Dashboard
- 🖥️ Manage **products, orders, users, messages, and testimonials**  
- 📦 Track inventory and stock alerts  
- 📊 Analytics: order summary, revenue, user insights  
- 🛎️ Receive notifications for new orders  
- 🧾 Generate PDF reports  

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React (Vite), Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Authentication** | JWT |
| **Payments** | Stripe / PayPal |
| **Email Notifications** | Nodemailer |
| **File Uploads** | Multer / Cloudinary |
| **Analytics & Charts** | Chart.js |

---



📸 Screenshots / Demo

Home Page
![Uploading localhost_5173_.png…]()

Product Listings

Cart & Checkout
<img width="2146" height="1522" alt="localhost_5173_ (2)" src="https://github.com/user-attachments/assets/a46361b6-4ceb-4bcf-8afa-bc0a2a848ed4" />

Admin Dashboard
<img width="2146" height="1522" alt="localhost_5173_admin" src="https://github.com/user-attachments/assets/f97c1baf-45ff-4ff6-83e7-590076fa6d38" />


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Shila-Mehta/ecommerce-website.git
cd GTP


2️⃣ Backend Setup
cd Backend
npm install
npm run start

Backend runs at http://localhost:5000

3️⃣ Frontend Setup
cd ../Frontend/react-app
npm install
npm run dev

Frontend runs at http://localhost:5173

```

🗂️ Folder Structure

```
📁GTP
    └── 📁Backend
        └── 📁controllers
        └── 📁models
            ├── cartModel.js
            ├── messageModel.js
            ├── orderModel.js
            ├── productsModel.js
            ├── testimonialModel.js
            ├── userModel.js
        └── 📁routes
            ├── cartRouter.js
            ├── dashBoardRouter.js
            ├── loginRouter.js
            ├── messageRouter.js
            ├── orderRouter.js
            ├── paymentRouter.js
            ├── pdfRouter.js
            ├── productsRouter.js
            ├── testimonialRouter.js
            ├── userRoutes.js
        └── 📁uploads
            ├── black_tshirt-1755799504977-611737193.png
            ├── blue_shirt-1755799484051-700374861-removebg-preview-1756707415281-294225956.png
            ├── blue_shirt-1755799484051-700374861-removebg-preview.png
            ├── blue-frock-removebg-preview-1756707452715-587818818.png
            ├── blue-frock-removebg-preview.png
            ├── button-cotton-shirt-classic-background-1757927761247-582701407.jpg
            ├── fashion-woman-with-clothes_(2)-1757928213618-804823602.jpg
            ├── fashion-woman-with-clothes_(3)-1757928314500-854998957.jpg
            ├── fashion-woman-with-clothes-1757923649314-56670969.jpg
            ├── kid-blue-frock-1762176092768-590217288.png
            ├── kid-blue-frock.png
            ├── kid-blue-shirt-1762176107811-601295954.png
            ├── kid-blue-shirt.png
            ├── men-rsquo-s-white-short-sleeve-shirt-casual-apparel-1757927919351-871807102.jpg
            ├── navy-frock-1755799432831-214448166-removebg-preview-1756707404356-352880479.png
            ├── navy-frock-1755799432831-214448166-removebg-preview-1757928044338-476011140.png
            ├── navy-frock-1755799432831-214448166-removebg-preview.png
            ├── pink-frock-removebg-preview-1756707700318-113581707.png
            ├── pink-frock-removebg-preview.png
            ├── purple-removebg-preview-1756707438967-882694542.png
            ├── purple-removebg-preview-1757928079465-7971170.png
            ├── purple-removebg-preview.png
            ├── red_shirt-1755799457945-674444790-removebg-preview-1756707426137-829755756.png
            ├── red_shirt-1755799457945-674444790-removebg-preview.png
            ├── testimonial1-1756457813943-220005357-1756923056232-667385067.jpg
            ├── testimonial1-1756457813943-220005357.jpg
            ├── testimonial2-1756457764853-941851709-1756921643166-474953597.jpg
            ├── testimonial2-1756457764853-941851709-1756921804277-979012911.jpg
            ├── testimonial2-1756457764853-941851709-1756921958080-899596858.jpg
            ├── testimonial2-1756457764853-941851709.jpg
            ├── testimonial3-1756457866058-735720808-1756921438903-39245857.jpg
            ├── testimonial3-1756457866058-735720808.jpg
            ├── testimonial3.jpg
            ├── top-long-casual-beautiful-sleeve-1757929341849-313869508.jpg
            ├── vecteezy_plain-black-t-shirt-ai-generative_49223523-1757929367555-576358449.png
            ├── white-shirt-removebg-preview-1756707788174-221342524-1756917316783-912700067.png
            ├── white-shirt-removebg-preview-1756707788174-221342524-1756919200442-971791177.png
            ├── white-shirt-removebg-preview-1756707788174-221342524.png
            ├── white-shirt-removebg-preview-1757927951088-491809956.png
            ├── white-shirt-removebg-preview.png
            ├── yellow-shirt-1756195894459-436941952-removebg-preview-1756707772121-556660536.png
            ├── yellow-shirt-1756195894459-436941952-removebg-preview-1757927839678-300649427.png
            ├── yellow-shirt-1756195894459-436941952-removebg-preview.png
        └── 📁utils
            ├── auth.js
        ├── .env
        ├── package-lock.json
        ├── package.json
        ├── server.js
    └── 📁Frontend
        └── 📁react-app
            └── 📁public
                └── 📁assets
                    ├── black tshirt.png
                    ├── blue shirt.jpg
                    ├── heroimage.png
                    ├── jewellery.jpg
                    ├── men-dress.jpg
                    ├── navy-frock.jpg
                    ├── newArrivals.jpg
                    ├── purple.jpg
                    ├── red shirt.jpg
                    ├── testimonial1.jpg
                    ├── testimonial2.jpg
                    ├── testimonial3.jpg
                    ├── woman-dress.jpg
                ├── vite.svg
            └── 📁src
                └── 📁components
                    ├── AdminDashboard.jsx
                    ├── AdminTestimonial.jsx
                    ├── CheckoutMenu.jsx
                    ├── ContactUsForm.jsx
                    ├── Dashboard.jsx
                    ├── Footer.jsx
                    ├── HeroSection.jsx
                    ├── LogInForm.jsx
                    ├── Messages.jsx
                    ├── NavBarSection.jsx
                    ├── NewArrivals.jsx
                    ├── orderModel.jsx
                    ├── Orders.jsx
                    ├── ParticlesBackground.jsx
                    ├── ProductsAdmin.jsx
                    ├── ProductsAdminWrapper.jsx
                    ├── ProductsSection.jsx
                    ├── settings.jsx
                    ├── SideBar.jsx
                    ├── SignUpForm.jsx
                    ├── TestimonialSection.jsx
                    ├── Users.jsx
                    ├── WhyShopWithUs.jsx
                    ├── WhyShopWithUSHead.jsx
                └── 📁context
                    ├── cartContext.jsx
                └── 📁css
                    ├── AdminDashboard.css
                    ├── AdminForms.css
                    ├── AdminTestimonials.css
                    ├── Basis.css
                    ├── CheckoutMenu.css
                    ├── ContactUsForm.css
                    ├── Dashboard.css
                    ├── Footer.css
                    ├── HeroSection.css
                    ├── LogInForm.css
                    ├── Messages.css
                    ├── NavBarSection.css
                    ├── NewArrivals.css
                    ├── orderModal.css
                    ├── Orders.css
                    ├── ProductsAdmin.css
                    ├── ProductsSection.css
                    ├── SignUpFrom.css
                    ├── TestimonialSection.css
                    ├── Users.css
                    ├── WhyShopWithUs.css
                └── 📁pages
                    ├── AdminDashboardPage.jsx
                    ├── AuthPage.jsx
                    ├── ContactUs.jsx
                    ├── Home.jsx
                    ├── LogIn.jsx
                    ├── Products.jsx
                    ├── SignUP.jsx
                    ├── WhyShopWithUs.jsx
                ├── main.jsx
            ├── .env
            ├── .gitignore
            ├── eslint.config.js
            ├── index.html
            ├── package-lock.json
            ├── package.json
            ├── README.md
            ├── vite.config.js
    └── .gitignore
```


🧑‍💻 About the Developer

Nimra Abdul Jabbar — MERN Stack Developer
Passionate about building scalable, maintainable, and production-ready applications with clean code and a focus on user experience.

📬 Contact:

Email: nimraabduljabbar14@gmail.com

LinkedIn: https://www.linkedin.com/in/n-jabbar-1113aa374/

Portfolio:https://nimra-react-portfolio.netlify.app/

🪪 License

This project is licensed under the MIT License.
