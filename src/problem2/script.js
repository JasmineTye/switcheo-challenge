document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const form = document.getElementById('swapForm');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const fromCurrencyWrapper = document.getElementById('fromCurrencyWrapper');
    const toCurrencyWrapper = document.getElementById('toCurrencyWrapper');
    const swapButton = document.getElementById('swapButton');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');
    const exchangeRate = document.getElementById('exchangeRate');
    const fromBalance = document.getElementById('fromBalance');
    const toBalance = document.getElementById('toBalance');
    const fromCurrencyImage = document.getElementById('fromCurrencyImage');
    const toCurrencyImage = document.getElementById('toCurrencyImage');
    const gifOverlay = document.getElementById('gifOverlay');
    const swapGif = document.getElementById('swapGif');
  const cursorMagic = document.getElementById('cursorMagic');
  const pointerWrap = document.getElementById('pointerWrap');
    // Currency data
    let tokenPrices = {};
    let mockBalances = {
        'BLUR': 10,
        'bNEO': 5,
        'BUSD': 2000,
        'USD': 5000,
        'ETH': 1.5,
        'GMX': 8,
        'STEVMOS': 100,
        'LUNA': 150,
        'RATOM': 25,
        'STRD': 200,
        'EVMOS': 300,
        'IBCX': 2,
        'IRIS': 1000,
        'ampLUNA': 50,
        'KUJI': 200,
        'STOSMO': 500,
        'USDC': 10000,
        'axlUSDC': 5000,
        'ATOM': 40,
        'STATOM': 15,
        'OSMO': 1500,
        'rSWTH': 10000,
        'STLUNA': 20,
        'LSI': 3,
        'OKB': 10,
        'OKT': 50,
        'SWTH': 10000,
        'USC': 1000,
        'WBTC': 0.05,
        'wstETH': 0.1,
        'YieldUSD': 1000,
        'ZIL': 5000
    };
    

    async function fetchPrices() {
        try {
            const response = await fetch('https://interview.switcheo.com/prices.json');
            const data = await response.json();
            tokenPrices = getLatestPrices(data);

            // Update UI
            updateCurrencyOptions();
            updateExchangeRate();
            updateBalance();
        } catch (error) {
            console.error('Error loading prices:', error);
            showError('Error loading price data');
        }
    }

    function getLatestPrices(data) {
        const latestPrices = {};
        data.forEach(entry => {
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
        const fromCurrencyOptions = document.getElementById('fromCurrencyOptions');
        fromCurrencyOptions.innerHTML = ''; // Clear existing options
        tokens.forEach(token => {
            const optionItem = createOptionItem(token, 'from');
            fromCurrencyOptions.appendChild(optionItem);
        });

        // Update "You Receive" dropdown
        const toCurrencyOptions = document.getElementById('toCurrencyOptions');
        toCurrencyOptions.innerHTML = ''; // Clear existing options
        tokens.forEach(token => {
            const optionItem = createOptionItem(token, 'to');
            toCurrencyOptions.appendChild(optionItem);
        });

        // Set default selections
        const defaultFromCurrency = tokens.includes('ETH') ? 'ETH' : tokens[0];
        const defaultToCurrency = tokens.includes('USDT') ? 'USDT' : tokens[1] || tokens[0];

        updateSelectedCurrency('from', defaultFromCurrency);
        updateSelectedCurrency('to', defaultToCurrency);

        // Update images
        updateTokenImage('from', defaultFromCurrency);
        updateTokenImage('to', defaultToCurrency);
    }

    function createOptionItem(token, type) {
        const optionItem = document.createElement('li');
        optionItem.classList.add('custom-option');
        optionItem.setAttribute('data-value', token);

        // Create the image element
        const image = document.createElement('img');
        image.src = `tokens/${token}.svg`; // Ensure correct path for images
        image.alt = `${token} logo`;
        image.style.width = "20px"; // Adjust size if needed
        image.style.height = "20px"; // Adjust size if needed

        // Create the text element
        const text = document.createElement('span');
        text.textContent = token;

        // Append the image and text to the option
        optionItem.appendChild(image);
        optionItem.appendChild(text);

        // Add event listener to update selected currency when an option is clicked
        optionItem.addEventListener('click', function() {
            const selectedValue = this.getAttribute('data-value');
            updateSelectedCurrency(type, selectedValue);
            closeOptions(type);
        });

        return optionItem;
    }

    function openOptions(type) {
        const optionsList = type === 'to' ? document.getElementById('toCurrencyOptions') : document.getElementById('fromCurrencyOptions');
        optionsList.style.display = 'block'; // Show dropdown
    }

    function closeOptions(type) {
        const optionsList = type === 'to' ? document.getElementById('toCurrencyOptions') : document.getElementById('fromCurrencyOptions');
        optionsList.style.display = 'none'; // Hide dropdown
    }

    function updateSelectedCurrency(type, currency) {
        const currencyImage = type === 'to' ? toCurrencyImage : fromCurrencyImage;
        const currencyLabel = type === 'to' ? document.getElementById('toCurrencyLabel') : document.getElementById('fromCurrencyLabel');

        currencyImage.src = `tokens/${currency}.svg`;
        currencyImage.alt = `${currency} logo`;
        currencyLabel.textContent = currency;

        // Update exchange rate and balance after currency change
        updateExchangeRate();
        updateBalance();
        calculateExchange();
    }

    document.getElementById('toCurrencyTrigger').addEventListener('click', function() {
        const optionsList = document.getElementById('toCurrencyOptions');
        if (optionsList.style.display === 'block') {
            closeOptions('to'); // Close dropdown if already open
        } else {
            openOptions('to'); // Open dropdown if closed
        }
    });

    document.getElementById('fromCurrencyTrigger').addEventListener('click', function() {
        const optionsList = document.getElementById('fromCurrencyOptions');
        if (optionsList.style.display === 'block') {
            closeOptions('from'); // Close dropdown if already open
        } else {
            openOptions('from'); // Open dropdown if closed
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            closeOptions('to');
            closeOptions('from');
        }
    });

    function updateExchangeRate() {
        const from = fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;  // Use selected currency
        const to = toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;  // Use selected currency
        const fromPrice = tokenPrices[from]?.price;
        const toPrice = tokenPrices[to]?.price;

        if (fromPrice && toPrice) {
            const rate = fromPrice / toPrice;
            exchangeRate.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
        } else {
            exchangeRate.textContent = 'Exchange rate unavailable';
        }
    }

    function updateBalance() {
        const currency = fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;
        const balance = mockBalances[currency] || 0;
        fromBalance.textContent = `Wallet Balance: ${balance.toFixed(4)} ${currency}`;

        const toCurrencyValue = toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;
        const toBalanceAmount = mockBalances[toCurrencyValue] || 0;
        toBalance.textContent = `Wallet Balance: ${toBalanceAmount.toFixed(4)} ${toCurrencyValue}`;
    }

    function calculateExchange() {
        const amount = parseFloat(fromAmount.value);
        if (!amount || isNaN(amount)) {
            toAmount.value = '';
            return;
        }

        const fromPrice = tokenPrices[fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent]?.price;
        const toPrice = tokenPrices[toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent]?.price;
        
        if (fromPrice && toPrice) {
            const exchangeAmount = (amount * fromPrice / toPrice);
            toAmount.value = exchangeAmount.toFixed(6);
        }
    }

    function swapCurrencies() {
        const tempCurrency = fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;
        fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent = toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent;
        toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent = tempCurrency;

        const tempAmount = fromAmount.value;
        fromAmount.value = toAmount.value;
        
        updateExchangeRate();
        updateBalance();
        calculateExchange();
        updateTokenImage('from', fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent);
        updateTokenImage('to', toCurrencyWrapper.querySelector('.custom-select-trigger span').textContent);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function updateTokenImage(type, currency) {
        const imageElement = type === 'from' ? fromCurrencyImage : toCurrencyImage;
        imageElement.src = `tokens/${currency}.svg`;
        imageElement.alt = `${currency} logo`;
    }

    // Event listeners for currency changes
    fromCurrencyWrapper.querySelector('.custom-select-trigger').addEventListener('click', () => {
        updateExchangeRate();
        updateBalance();
        calculateExchange();
    });
    toCurrencyWrapper.querySelector('.custom-select-trigger').addEventListener('click', () => {
        updateExchangeRate();
        updateBalance();
        calculateExchange();
    });

    // Ensure to update `toAmount` immediately on `fromAmount` change
    fromAmount.addEventListener('input', calculateExchange);

    swapButton.addEventListener('click', swapCurrencies);

    // form.addEventListener('submit', async (e) => {
    //     e.preventDefault();
    //     hideError();

    //     const amount = parseFloat(fromAmount.value);
    //     if (!amount || isNaN(amount)) {
    //         showError('Please enter a valid amount');
    //         return;
    //     }

    //     const balance = mockBalances[fromCurrencyWrapper.querySelector('.custom-select-trigger span').textContent];
    //     if (amount > balance) {
    //         showError('Insufficient balance');
    //         return;
    //     }

    //     submitButton.disabled = true;
    //     // submitButton.innerHTML = '<span class="loading"></span>Swapping...';

    //     // Simulate API call
    //     await new Promise(resolve => setTimeout(resolve, 1500));

    //     submitButton.disabled = false;
    //     submitButton.textContent = 'Swap Now';
    //     fromAmount.value = '';
    //     toAmount.value = '';
    //     updateExchangeRate();
    // });


    // Animation upon send
    async function simulateSwap() {
        // Simulating the API call and the swap
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';

        const amount = parseFloat(fromAmount.value);
        if (!amount || isNaN(amount)) {
            showError('Please enter a valid amount');
            return;
        }

        // Disable the button and show loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading"></span> Swapping...';

        // Simulate the API call for the swap
        await simulateSwap();

        // On successful swap, show the GIF on the overlay
        gifOverlay.style.display = 'flex'; // Show the overlay with the GIF

        // Reset the button after the animation finishes
        setTimeout(() => {
            gifOverlay.style.display = 'none'; // Hide the overlay
            submitButton.innerHTML = 'Swap Now'; // Reset button text
            submitButton.disabled = false; // Enable button again
        }, 3700); // Adjust the duration to match your GIF length
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

// // droplet animation
document.addEventListener("mousemove", function (e) {
    // Create ripple element
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");
  
    // Position the ripple at the mouse location
    ripple.style.left = `${e.pageX - 25}px`; // Center ripple on mouse
    ripple.style.top = `${e.pageY - 25}px`; // Center ripple on mouse
    ripple.style.width = "50px"; // Initial size
    ripple.style.height = "50px"; // Initial size
  
    // Add the ripple to the body
    document.body.appendChild(ripple);
  
    // Remove the ripple after the animation ends
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  });

  

    // Initialize
    fetchPrices();
});
