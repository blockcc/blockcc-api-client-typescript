# Blockcc Api Client TypeScript

This project is designed to help you make your own projects that interact with
the [Blockcc API](https://blockcc.gitee.io/blockcc-api-document/en_US/#overview). providing complete API coverage, and
supporting synchronous requests, as well as event streaming using WebSockets.

## Language

[简体中文](https://github.com/blockcc/blockcc-api-client-typescript/blob/master/README.zh-CN.md )|English

## Installation

```shell
npm install blockcc-api
```

## Getting started

```ts
import * as blockcc from 'typescript_api_test'
```

## Blockcc HTTP API

### init the Blockcc Api Client

```ts
const client = new blockcc.HttpClient("YOUR_API_KEY");
```

### Tickers

```ts
console.log(await client.getTickers(
  "gate-io",
  "bitcoin"
));
```

### Prices

```ts
console.log(await client.getPrices(
  "bitcoin"
));
```

### HistoryPrices

```ts
console.log(await client.getHistoryPrices(
  "bitcoin",
  1610596800000,
  1611288000000,
  blockcc.Interval.ONE_HOUR
));
```

### Orderbook

```ts
console.log(await client.getOrderBook("gate-io_BTC_USDT", 10));
```

### Markets

```ts
console.log(await client.getMarkets("gate-io"));
```

### Symbols

```ts
console.log(await client.getSymbols("bitcoin", false));
```

### ExchangeRates

```ts
console.log(await client.getExchangeRate());
```

### Trades

```ts
console.log(await client.getTrades("gate-io_BTC_USDT"));
```

### Kline

```ts
console.log(await client.getKline("gate-io_BTC_USDT"));
```

### Brief

```ts
console.log(await client.getBriefs(Locale.zh_CN));
```

### Announcements

```ts
console.log(await client.getAnnouncements(Locale.zh_CN, "binance"));
```

### Articles

```ts
console.log(await client.getArticles(Locale.zh_CN));
```

### Article

```ts
console.log(await client.getArticle("5e1d96a5aeae8770b7ff34ac"));
```

### Social Media

```ts
console.log(await client.getSocialMedia(Source.WEIBO));
```

## Blockcc WebSocket Implementation

### Initialize the WebSocket Client

```ts
const client = new blockcc.WebSocketClient("YOUR_API_KEY");
```

### Subscribe Topics

After connecting to the WebSocket client, you need to reply to the subscription message. The format of the subscription
message is as follows

```json
{
  "op": "subscribe",
  "args": [
    "price:bitcoin"
  ]
}
```

Our client provides a method to directly construct a subscription message, which can be used directly as parameters, as
shown below

```ts
new Promise<void>(resolve => {
  client.subscribe((data: any) => {
      console.log(data);
      resolve();
    },
    blockcc.price("bitcoin"),
    blockcc.ticker("binance_BNB_USDT"),
    blockcc.orderbook("binance_BTC_USDT"));
});
```
