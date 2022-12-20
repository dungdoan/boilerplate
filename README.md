## Requirement
From existing transactions daily in CSV file, the application will return the latest portfolio value per token in USD.

## Install the application on local environment
Get repository that contains the source code

```
git clone dungdoan/boilerplate
cd boilerplate
```

Install dependencies
```
npm install axios
npm install sprintf-js
npm install --save request-promise
```

Run the application
```
npm install
node index
```

## Working flow
Get data from online CSV data file and split to data that we need.
```
let dataUrl = 'https://raw.githubusercontent.com/Propine/2b-boilerplate/master/data/transactions.csv';

request(dataUrl, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        let dataTransactions = html.split("\n");

        for (let i = 1; i < dataTransactions.length; i++) {
            var transaction = dataTransactions[i];
            transaction = transaction.split(',');
            if (transaction[2] == BTC_LABEL) {
                sumBTC = calculate(transaction[1], sumBTC, transaction[3]);
            } else if (transaction[2] == ETH_LABEL) {
                sumETH = calculate(transaction[1], sumETH, transaction[3]);
            } else if (transaction[2] == XRP_LABEL) {
                sumXRP = calculate(transaction[1], sumXRP, transaction[3]);
            }
        }

        // Show total value of each token in USD
        showTotalValueOfToken(BTC_LABEL, 'USD', sumBTC);
        showTotalValueOfToken(ETH_LABEL, 'USD', sumETH);
        showTotalValueOfToken(XRP_LABEL, 'USD', sumXRP);
    } else {
        console.log(error);
    }
});
```

The <strong>calculate</strong> will process the sum of each token.
```
function calculate(status, sum, value)
{
    if (status == WITHDRAWAL_LABEL) {
        sum = sum - value;
    } else if (status == DEPOSIT_LABEL) {
        sum = sum - value;
    }

    return sum;
}
```

Use <strong>axios</strong> to get currency rate of each token from existing API.
After that show total value of each token in USD
```
function showTotalValueOfToken(tokenSymbol, currency, amount)
{
    let url = vsprintf('https://min-api.cryptocompare.com/data/price?fsym=%s&tsyms=%s', [tokenSymbol, currency]);
    let price;

    price = axios.get(url).then(function (response) {
        return ((response.data)[currency]);
    }).catch(function (error) {
        return 1;
    });

    price.then(function (data) {
        console.log(vsprintf('Total value of %s: %d %s', [tokenSymbol, data*amount, currency]));
    })
}
```
