<!-- Improved compatibility of back to top link -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
<p align="center">
  <a href="[contributors-url]"><img src="https://img.shields.io/github/contributors/your_username/AgriShieldnish.svg?style=for-the-badge" alt="Contributors"></a>
  <a href="[forks-url]"><img src="https://img.shields.io/github/forks/your_username/AgriShieldnish.svg?style=for-the-badge" alt="Forks"></a>
  <a href="[stars-url]"><img src="https://img.shields.io/github/stars/your_username/AgriShieldnish.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="[issues-url]"><img src="https://img.shields.io/github/issues/your_username/AgriShieldnish.svg?style=for-the-badge" alt="Issues"></a>
  <a href="[license-url]"><img src="https://img.shields.io/github/license/your_username/AgriShieldnish.svg?style=for-the-badge" alt="License"></a>
</p>

<!-- PROJECT LOGO -->
<div align="center">
  <img src="Frontend/src/assets/logo.png" alt="Logo" width="120" height="120" style="border-radius: 16px; box-shadow: 0 4px 16px #b2df28; margin-bottom: 10px;" />
  <h1 align="center" style="color:#4caf50; font-weight: bold;">AgriChain - AgriShield</h1>
  <p align="center" style="font-size:1.2em; color:#555;">
    <em>Blockchain-powered platform for agricultural insurance, carbon credits, lending, and farmer management.</em>
    <br />
    <a href="#getting-started"><strong>Get Started »</strong></a>
    <br />
    <br />
    <a href="#usage">Usage</a>
    &middot;
    <a href="#contributing">Contributing</a>
    &middot;
    <a href="#license">License</a>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details open>
  <summary><b>📑 Table of Contents</b></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## 🌱 About The Project

> **AgriChain - AgriShield** is a decentralized platform empowering farmers and stakeholders with:

- 🌦️ **Weather-triggered crop insurance**
- 🌳 **Carbon credit management**
- 🧑‍🌾 **Farmer NFT registration**
- 💸 **Lending interface**
- 🔒 **Transparent and secure smart contracts**

The platform leverages blockchain (Ethereum/Hardhat), React, and Vite for a seamless user experience and robust backend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🛠️ Built With
<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/Hardhat-181717?style=for-the-badge&logo=ethereum&logoColor=yellow" />
  <img src="https://img.shields.io/badge/Ethers.js-282C34?style=for-the-badge&logo=ethereum&logoColor=purple" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" />
  <img src="https://img.shields.io/badge/Wagmi-1A202C?style=for-the-badge&logo=ethereum&logoColor=green" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ✨ Features

- 🌦️ Weather-triggered insurance smart contract
- 🌳 Carbon credit tracking and trading
- 🧑‍🌾 Farmer NFT registration and management
- 💸 Lending and borrowing interface
- 📊 Dashboard with stats, weather widget, and activity table
- 👛 Wallet connection and profile management

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

```sh
# 1. Clone the repository
 git clone <your-repo-url>
 cd AgriShieldnish

# 2. Install Backend dependencies
 cd Backend
 npm install

# 3. Install Frontend dependencies
 cd ../Frontend
 npm install

# 4. Start Hardhat local blockchain
 cd ../Backend
 npx hardhat node

# 5. Deploy contracts (in a new terminal)
 cd Backend
 npx hardhat run scripts/deploymentInsurance.js --network localhost

# 6. Start the Frontend
 cd ../Frontend
 npm run dev

# 7. Open your browser and go to
 http://localhost:5173
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🧑‍💻 Usage

- Register as a farmer and mint your NFT
- Purchase weather insurance
- Track and trade carbon credits
- Access dashboard for stats and weather
- Use lending interface for loans

_For more details, see the documentation in the `Frontend/src` and `Backend/contracts` folders._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🗺️ Roadmap
- [x] Weather insurance smart contract
- [x] Carbon credit module
- [x] Farmer NFT registration
- [x] Lending interface
- [ ] Oracle integration for real weather data
- [ ] Mobile responsive UI
- [ ] Multi-chain support

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

```sh
# 1. Fork the Project
# 2. Create your Feature Branch
git checkout -b feature/AmazingFeature
# 3. Commit your Changes
git commit -m 'Add some AmazingFeature'
# 4. Push to the Branch
git push origin feature/AmazingFeature
# 5. Open a Pull Request
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📬 Contact

Project Maintainer: [Your Name](mailto:your.email@example.com)

Project Link: [https://github.com/your_username/AgriShieldnish](https://github.com/your_username/AgriShieldnish)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 🙏 Acknowledgments

- [Choose an Open Source License](https://choosealicense.com)
- [Hardhat](https://hardhat.org/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Wagmi](https://wagmi.sh/)
- [Img Shields](https://shields.io)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/your_username/AgriShieldnish.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/AgriShieldnish/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/AgriShieldnish.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/AgriShieldnish/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/AgriShieldnish.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/AgriShieldnish/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/AgriShieldnish.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/AgriShieldnish/issues
[license-shield]: https://img.shields.io/github/license/your_username/AgriShieldnish.svg?style=for-the-badge
[license-url]: https://github.com/your_username/AgriShieldnish/blob/main/LICENSE
