const axios = require('axios').default;
const request = require('request-promise');
let vsprintf = require('sprintf-js').vsprintf;

var sumBTC = 0;
var sumETH = 0;
var sumXRP = 0;
const BTC_LABEL = 'BTC';
const ETH_LABEL = 'ETH';
const XRP_LABEL = 'XRP';
const WITHDRAWAL_LABEL = 'WITHDRAWAL';
const DEPOSIT_LABEL = 'DEPOSIT';
let dataUrl = 'https://raw.githubusercontent.com/Propine/2b-boilerplate/master/data/transactions.csv';

function calculate(status, sum, value)
{
    if (status == WITHDRAWAL_LABEL) {
        sum = sum - value;
    } else if (status == DEPOSIT_LABEL) {
        sum = sum - value;
    }

    return sum;
}

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

        showTotalValueOfToken(BTC_LABEL, 'USD', sumBTC);
        showTotalValueOfToken(ETH_LABEL, 'USD', sumETH);
        showTotalValueOfToken(XRP_LABEL, 'USD', sumXRP);
    } else {
        console.log(error);
    }
});
