# Blockcc Api Client TypeScript

此项目设计的目的是旨在于帮助您的项目与[Blockcc API](https://blockcc.gitee.io/blockcc-api-document/en_US/#overview)
交互，提供完整的API覆盖，提供完整的API覆盖，支持同步请求，以及使用WebSockets的事件流

## Language

简体中文|English

## 安装

```shell
npm install blockcc-api
```

## 入门

```ts
import * as blockcc from 'typescript_api_test'
```

## Blockcc HTTP API

### 初始化 Blockcc API 端

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

## Blockcc WebSocket 实现

### 初始化 WebSocket 客户端

```ts
const client = new blockcc.WebSocketClient("YOUR_API_KEY");
```

### 订阅

### Subscribe Topics

当你成功与WebSocket客户端连接之后, 你需要回复需要订阅的消息。 返回订阅消息的格式如下

```json
{
  "op": "subscribe",
  "args": [
    "price:bitcoin"
  ]
}
```

我们客户端有提供直接构建订阅消息的方法，可以直接作为参数使用，如下所示

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
