document.addEventListener("DOMContentLoaded", () => {
  const cursorMagic = document.getElementById("cursorMagic");
  const pointerWrap = document.getElementById("pointerWrap");
  const form = document.getElementById("swapForm");
  const fromAmount = document.getElementById("fromAmount");
  const toAmount = document.getElementById("toAmount");
  const fromCurrencyWrapper = document.getElementById("fromCurrencyWrapper");
  const toCurrencyWrapper = document.getElementById("toCurrencyWrapper");
  const swapButton = document.getElementById("swapButton");
  const submitButton = document.getElementById("submitButton");
  const errorMessage = document.getElementById("errorMessage");
  const exchangeRate = document.getElementById("exchangeRate");
  const fromBalance = document.getElementById("fromBalance");
  const toBalance = document.getElementById("toBalance");
  const fromCurrencyImage = document.getElementById("fromCurrencyImage");
  const toCurrencyImage = document.getElementById("toCurrencyImage");
  const gifOverlay = document.getElementById("gifOverlay");
  const swapGif = document.getElementById("swapGif");
  const portfolioPanel = document.getElementById('portfolioPanel');
  const toggleButton = document.getElementById('togglePortfolio');
  const container = document.querySelector('.container');

  // Currency data
  let tokenPrices = {};
  let mockBalances = {
    BLUR: 10,
    bNEO: 5,
    BUSD: 200,
    USD: 450,
    ETH: 1.5,
    GMX: 8,
    STEVMOS: 100,
    LUNA: 150,
    RATOM: 25,
    STRD: 200,
    EVMOS: 300,
    IBCX: 2,
    IRIS: 1000,
    ampLUNA: 50,
    KUJI: 200,
    STOSMO: 500,
    USDC: 10000,
    axlUSDC: 5000,
    ATOM: 40,
    STATOM: 15,
    OSMO: 1500,
    rSWTH: 10000,
    STLUNA: 20,
    LSI: 3,
    OKB: 10,
    OKT: 50,
    SWTH: 10000,
    USC: 1000,
    WBTC: 0.05,
    wstETH: 0.1,
    YieldUSD: 1000,
    ZIL: 5000,
  };

   // Modify your existing fetchPrices function to include portfolio update
   async function fetchPrices() {
    try {
      const response = await fetch("https://interview.switcheo.com/prices.json");
      const data = await response.json();
      tokenPrices = getLatestPrices(data);

      // Update UI
      updateCurrencyOptions();
      updateExchangeRate();
      updateBalance();
      updatePortfolio(); 
    } catch (error) {
      console.error("Error loading prices:", error);
      showError("Error loading price data");
    }
  }

  function getLatestPrices(data) {
    const latestPrices = {};
    data.forEach((entry) => {
      const { currency, date, price } = entry;
      if (
        !latestPrices[currency] ||
        new Date(latestPrices[currency].date) < new Date(date)
      ) {
        latestPrices[currency] = { date, price };
      }
    });
    return latestPrices;
  }

  function updateCurrencyOptions() {
    const tokens = Object.keys(tokenPrices);

    // Update "You Send" dropdown
    const fromCurrencyOptions = document.getElementById("fromCurrencyOptions");
    fromCurrencyOptions.innerHTML = ""; // Clear existing options
    tokens.forEach((token) => {
      const optionItem = createOptionItem(token, "from");
      fromCurrencyOptions.appendChild(optionItem);
    });

    // Update "You Receive" dropdown
    const toCurrencyOptions = document.getElementById("toCurrencyOptions");
    toCurrencyOptions.innerHTML = ""; // Clear existing options
    tokens.forEach((token) => {
      const optionItem = createOptionItem(token, "to");
      toCurrencyOptions.appendChild(optionItem);
    });

    // Set default selections
    const defaultFromCurrency = tokens.includes("ETH") ? "ETH" : tokens[0];
    const defaultToCurrency = tokens.includes("USDT")
      ? "USDT"
      : tokens[1] || tokens[0];

    updateSelectedCurrency("from", defaultFromCurrency);
    updateSelectedCurrency("to", defaultToCurrency);

    // Update images
    updateTokenImage("from", defaultFromCurrency);
    updateTokenImage("to", defaultToCurrency);
  }

  function createOptionItem(token, type) {
    const optionItem = document.createElement("li");
    optionItem.classList.add("custom-option");
    optionItem.setAttribute("data-value", token);

    // Create the image element
    const image = document.createElement("img");
    image.src = `tokens/${token}.svg`; // Ensure correct path for images
    image.alt = `${token} logo`;
    image.style.width = "20px"; // Adjust size if needed
    image.style.height = "20px"; // Adjust size if needed

    // Create the text element
    const text = document.createElement("span");
    text.textContent = token;

    // Append the image and text to the option
    optionItem.appendChild(image);
    optionItem.appendChild(text);

    // Add event listener to update selected currency when an option is clicked
    optionItem.addEventListener("click", function () {
      const selectedValue = this.getAttribute("data-value");
      updateSelectedCurrency(type, selectedValue);
      closeOptions(type);
    });

    return optionItem;
  }

  function openOptions(type) {
    const optionsList =
      type === "to"
        ? document.getElementById("toCurrencyOptions")
        : document.getElementById("fromCurrencyOptions");
    optionsList.style.display = "block"; // Show dropdown
  }

  function closeOptions(type) {
    const optionsList =
      type === "to"
        ? document.getElementById("toCurrencyOptions")
        : document.getElementById("fromCurrencyOptions");
    optionsList.style.display = "none"; // Hide dropdown
  }

  function updateSelectedCurrency(type, currency) {
    const currencyImage = type === "to" ? toCurrencyImage : fromCurrencyImage;
    const currencyLabel =
      type === "to"
        ? document.getElementById("toCurrencyLabel")
        : document.getElementById("fromCurrencyLabel");

    currencyImage.src = `tokens/${currency}.svg`;
    currencyImage.alt = `${currency} logo`;
    currencyLabel.textContent = currency;

    // Update exchange rate and balance after currency change
    updateExchangeRate();
    updateBalance();
    calculateExchange();
  }

  function updatePortfolio() {
    const tokenList = document.getElementById('tokenList');
    const totalBalance = document.getElementById('totalBalance');
    let totalValue = 0;
  
    // Clear existing token list
    tokenList.innerHTML = '';
  
    // Calculate and sort tokens by value
    const tokenEntries = Object.entries(mockBalances)
      .map(([token, amount]) => ({
        token,
        amount,
        value: amount * (tokenPrices[token]?.price || 0)
      }))
      .filter(entry => entry.value > 0)
      .sort((a, b) => b.value - a.value);
  
    // Create token elements
    tokenEntries.forEach(({ token, amount, value }) => {
      totalValue += value;
      
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      
      // Add a subtle animation class for updated values
      tokenItem.classList.add('token-update-animation');
      
      tokenItem.innerHTML = `
        <img src="./tokens/${token}.svg" alt="${token}" class="token-icon" 
             onerror="this.src='./tokens/DEFAULT.svg'" style="width: 32px; height: 32px;"/>
        <div class="token-details">
          <div class="token-header">
            <span class="token-name">${token}</span>
            <span class="token-value">$${value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</span>
          </div>
          <span class="token-balance">${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
          })} ${token}</span>
        </div>
      `;
  
      tokenList.appendChild(tokenItem);
      
      // Remove animation class after animation completes
      setTimeout(() => {
        tokenItem.classList.remove('token-update-animation');
      }, 1000);
    });
  
    // Update total balance with animation
    const previousTotal = parseFloat(totalBalance.textContent.replace(/[^0-9.-]+/g, ""));
    totalBalance.textContent = `$${totalValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    
    // Add animation class if value changed
    if (previousTotal !== totalValue) {
      totalBalance.classList.add('balance-update-animation');
      setTimeout(() => {
        totalBalance.classList.remove('balance-update-animation');
      }, 1000);
    }
  }
    

  document
    .getElementById("toCurrencyTrigger")
    .addEventListener("click", function () {
      const optionsList = document.getElementById("toCurrencyOptions");
      if (optionsList.style.display === "block") {
        closeOptions("to"); // Close dropdown if already open
      } else {
        openOptions("to"); // Open dropdown if closed
      }
    });

  document
    .getElementById("fromCurrencyTrigger")
    .addEventListener("click", function () {
      const optionsList = document.getElementById("fromCurrencyOptions");
      if (optionsList.style.display === "block") {
        closeOptions("from"); // Close dropdown if already open
      } else {
        openOptions("from"); // Open dropdown if closed
      }
    });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select")) {
      closeOptions("to");
      closeOptions("from");
    }
  });

  function updateExchangeRate() {
    const from = fromCurrencyWrapper.querySelector(
      ".custom-select-trigger span"
    ).textContent; // Use selected currency
    const to = toCurrencyWrapper.querySelector(
      ".custom-select-trigger span"
    ).textContent; // Use selected currency
    const fromPrice = tokenPrices[from]?.price;
    const toPrice = tokenPrices[to]?.price;

    if (fromPrice && toPrice) {
      const rate = fromPrice / toPrice;
      exchangeRate.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
    } else {
      exchangeRate.textContent = "Exchange rate unavailable";
    }
  }

  function updateBalance() {
    const currency = fromCurrencyWrapper.querySelector(
      ".custom-select-trigger span"
    ).textContent;
    const balance = mockBalances[currency] || 0;
    fromBalance.textContent = `Balance: ${balance.toFixed(
      6
    )} ${currency}`;

    const toCurrencyValue = toCurrencyWrapper.querySelector(
      ".custom-select-trigger span"
    ).textContent;
    const toBalanceAmount = mockBalances[toCurrencyValue] || 0;
    toBalance.textContent = `Balance: ${toBalanceAmount.toFixed(
      6
    )} ${toCurrencyValue}`;
  }

  function calculateExchange() {
    const amount = parseFloat(fromAmount.value);
    if (!amount || isNaN(amount)) {
      toAmount.value = "";
      return;
    }

    const fromPrice =
      tokenPrices[
        fromCurrencyWrapper.querySelector(".custom-select-trigger span")
          .textContent
      ]?.price;
    const toPrice =
      tokenPrices[
        toCurrencyWrapper.querySelector(".custom-select-trigger span")
          .textContent
      ]?.price;

    if (fromPrice && toPrice) {
      const exchangeAmount = (amount * fromPrice) / toPrice;
      toAmount.value = exchangeAmount.toFixed(6);
    }
  }

  function swapCurrencies() {
    // Save the current values first
    const fromCurrencyText = fromCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
    const toCurrencyText = toCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
    const tempAmount = fromAmount.value;
    
    // Update currency labels
    fromCurrencyWrapper.querySelector(".custom-select-trigger span").textContent = toCurrencyText;
    toCurrencyWrapper.querySelector(".custom-select-trigger span").textContent = fromCurrencyText;
    
    // Update amount fields
    fromAmount.value = toAmount.value;
    toAmount.value = tempAmount;
    
    // Update images
    updateTokenImage("from", toCurrencyText);
    updateTokenImage("to", fromCurrencyText);
    
    // Update UI elements
    updateExchangeRate();
    updateBalance();
    calculateExchange();
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function hideError() {
    errorMessage.style.display = "none";
  }

  function updateTokenImage(type, currency) {
    const imageElement = type === "from" ? fromCurrencyImage : toCurrencyImage;
    imageElement.src = `tokens/${currency}.svg`;
    imageElement.alt = `${currency} logo`;
  }

  // Event listeners for currency changes
  fromCurrencyWrapper
    .querySelector(".custom-select-trigger")
    .addEventListener("click", () => {
      updateExchangeRate();
      updateBalance();
      calculateExchange();
    });
  toCurrencyWrapper
    .querySelector(".custom-select-trigger")
    .addEventListener("click", () => {
      updateExchangeRate();
      updateBalance();
      calculateExchange();
    });

 // Update the fromAmount event listener to prevent feedback loops
fromAmount.addEventListener("input", function() {
  // Clear the toAmount event listener temporarily
  toAmount.removeEventListener("input", calculateReverseExchange);
  
  // Calculate and update the toAmount
  calculateExchange();
  
  // Re-add the event listener after a short delay
  setTimeout(() => {
    toAmount.addEventListener("input", calculateReverseExchange);
  }, 10);
});

// Similarly update the toAmount event listener
toAmount.addEventListener("input", function() {
  // Clear the fromAmount event listener temporarily
  fromAmount.removeEventListener("input", calculateExchange);
  
  // Calculate and update the fromAmount
  calculateReverseExchange();
  
  // Re-add the event listener after a short delay
  setTimeout(() => {
    fromAmount.addEventListener("input", calculateExchange);
  }, 10);
});

// Add this new function to calculate from amount based on to amount
function calculateReverseExchange() {
  const amount = parseFloat(toAmount.value);
  if (!amount || isNaN(amount)) {
    fromAmount.value = "";
    return;
  }

  const fromCurrency = fromCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
  const toCurrency = toCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
  
  const fromPrice = tokenPrices[fromCurrency]?.price;
  const toPrice = tokenPrices[toCurrency]?.price;

  if (fromPrice && toPrice) {
    const exchangeAmount = (amount * toPrice) / fromPrice;
    fromAmount.value = exchangeAmount.toFixed(6);
  }
}

  swapButton.addEventListener("click", swapCurrencies);


  // Animation upon send
  async function simulateSwap() {
    return new Promise((resolve) => setTimeout(resolve, 1500));
  }
  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
  
    const amount = parseFloat(fromAmount.value);
    if (!amount || isNaN(amount)) {
      showError("Please enter a valid amount");
      return;
    }
  
    const fromCurrency = fromCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
    const toCurrency = toCurrencyWrapper.querySelector(".custom-select-trigger span").textContent;
    
    // Check if user has enough balance
    if (!hasEnoughBalance(amount, fromCurrency)) {
      showError(`Insufficient ${fromCurrency} balance`);
      return;
    }
  
    // Disable the button and show loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span> Swapping...';
  
    try {
      // Simulate the API call for the swap
      await simulateSwap();
  
      // Calculate the final amount being received
      const receivedAmount = parseFloat(toAmount.value);
  
      // Update the balances
      updateMockBalances(fromCurrency, toCurrency, amount, receivedAmount);
  
      // Update the portfolio display
      updatePortfolio();
  
      // Update the balance displays
      updateBalance();
  
      // Show success animation
      gifOverlay.style.display = "flex";
  
      // Reset form after successful swap
      setTimeout(() => {
        gifOverlay.style.display = "none";
        submitButton.innerHTML = "Swap Now";
        fromAmount.value = '';
        toAmount.value = '';
        submitButton.disabled = false;
        
        // Update exchange rate display
        updateExchangeRate();
      }, 3700);
  
    } catch (error) {
      console.error("Swap failed:", error);
      showError("Failed to complete swap. Please try again.");
      submitButton.disabled = false;
      submitButton.innerHTML = "Swap Now";
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  function hasEnoughBalance(amount, currency) {
    const balance = mockBalances[currency] || 0;
    return amount <= balance;
  }
  
  function updateMockBalances(fromCurrency, toCurrency, fromAmount, toAmount) {
    // Deduct the amount from the source currency
    mockBalances[fromCurrency] -= parseFloat(fromAmount);
    
    // Add the amount to the destination currency
    mockBalances[toCurrency] = (mockBalances[toCurrency] || 0) + parseFloat(toAmount);
  }

  // Mouse move: update pointer-wrap translation based on mouse position
  cursorMagic.addEventListener("mousemove", (e) => {
    const rect = cursorMagic.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position inside container
    const y = e.clientY - rect.top; // Y position inside container

    // Calculate percentage positions (0 to 1)
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;

    // Map to a translation from -50% to 50%
    const xOffset = (xPercent - 0.5) * 100;
    const yOffset = (yPercent - 0.5) * 100;

    pointerWrap.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
  });

  // On mouse enter, fade in the pointer-wrap (hover in animation)
  cursorMagic.addEventListener("mouseenter", () => {
    pointerWrap.style.opacity = "1";
  });

  // On mouse leave, hide the pointer-wrap (hover out animation)
  cursorMagic.addEventListener("mouseleave", () => {
    pointerWrap.style.opacity = "0";
  });

  toggleButton.addEventListener('click', () => {
    portfolioPanel.classList.toggle('collapsed');
    container.classList.toggle('expanded');
  });

  document.getElementById("togglePortfolio").addEventListener("click", function () {
    portfolioPanel.classList.toggle("closed");
    toggleButton.classList.toggle("closed");

    // Change arrow direction dynamically
    toggleButton.innerHTML = portfolioPanel.classList.contains("closed") 
        ? '<i class="arrow-right"></i>' 
        : '<i class="arrow-left"></i>';
});


  // Initialize
  fetchPrices();
});
