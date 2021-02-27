import * as blockcc from "../src/blockcc-api";

describe("blockcc-api-client rest request", () => {
  const client = new blockcc.HttpClient(
    "YOUR_API_KEY"
  );

  it("ticker", async () => {
    console.log(await client.getTickers(
      "gate-io",
      "bitcoin",
      undefined,
      undefined,
      undefined,
      0,
      15
    ));
  });

  it("price", async () => {
    console.log(await client.getPrices(
      "bitcoin",
      0,
      1
    ));
  });

  it("historyPrice", async () => {
    console.log(await client.getHistoryPrices(
      "bitcoin",
      1610596800000,
      1611288000000,
      blockcc.Interval.ONE_HOUR
    ));
  });

  it("orderbook", async () => {
    console.log(await client.getOrderBook(
      "gate-io_BTC_USDT",
      10
    ));
  });

  it("market", async () => {
    console.log(await client.getMarkets(
      "gate-io"
    ));
  });

  it("symbol", async () => {
    console.log(await client.getSymbols(
      "bitcoin",
      false
    ));
  });

  it("exchange_rate", async () => {
    console.log(await client.getExchangeRate());
  });

  it("trade", async () => {
    console.log(await client.getTrades("gate-io_BTC_USDT"));
  });

  it("kline", async () => {
    console.log(await client.getKline("gate-io_BTC_USDT"));
  });

  it("brief", async () => {
    console.log(await client.getBriefs(blockcc.Locale.zh_CN));
  });

  it("announcement", async () => {
    console.log(await client.getAnnouncements(blockcc.Locale.zh_CN, "binance"));
  }, 10000);

  it("articles", async () => {
    console.log(await client.getArticles(blockcc.Locale.zh_CN));
  });

  it("article", async () => {
    console.log(await client.getArticle("5e1d96a5aeae8770b7ff34ac"));
  });

  it("social_media", async () => {
    console.log(await client.getSocialMedia(blockcc.Source.WEIBO));
  });

  it("test_error", async () => {
    console.log(await client.getTickers("abc"));
  });
});


describe("websocket", () => {

  const client = new blockcc.WebSocketClient("YOUR_API_KEY");

  it("subscribe", (t) => {
    return new Promise<void>(resolve => {
      client.subscribe((data: any) => {
          console.log(data);
          resolve();
        },
        blockcc.price("bitcoin"),
        blockcc.ticker("binance_BNB_USDT"),
        blockcc.orderbook("binance_BTC_USDT"));
    });
  }, 10000000);
});
