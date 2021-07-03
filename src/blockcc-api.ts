import axios from "axios";
import * as WebSocket from "ws";

export class HttpClient {

  private readonly host: string;
  private readonly apiKey: string;

  /**
   * Blockcc Api Client
   * @param apiKey
   * @param host
   */
  constructor(apiKey: string, host = "https://data.mifengcha.com") {
    this.host = host;
    this.apiKey = apiKey;
  }


  /**
   * Gets the ticker information for params
   * @param market
   * @param slug
   * @param symbol
   * @param currency
   * @param market_pair
   * @param page
   * @param size
   */
  async getTickers(
    market?: string,
    slug?: string,
    symbol?: string,
    currency?: string,
    market_pair?: string,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/tickers", {
        market,
        slug,
        symbol,
        currency,
        market_pair,
        page,
        size,
        api_key: this.apiKey
    }, convertTickerData);
  }

  /**
   * Gets the price information for a given slug
   * @param slug
   * @param page
   * @param size
   */
  async getPrices(
    slug?: string,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/price", {
      slug,
      page,
      size,
      api_key: this.apiKey
    }, convertPriceData);
  }

  /**
   * Gets the OrderBook information for a given desc
   * @param desc
   * @param limit
   */
  async getOrderBook(
    desc: string,
    limit?: number
  ) {
    return await get(this.host + "/api/v3/orderbook", {
        desc,
        limit,
        api_key: this.apiKey
    }, convertOrderBookData);
  }

  /**
   * Gets the Market information for a given slug
   * @param slug
   * @param page
   * @param size
   */
  async getMarkets(
    slug?: string,
    page?: number,
    size?: number
  ) {
    let url = "/api/v3/markets";
    if (slug != undefined) {
      url += "/" + slug;
    }
    return await get(this.host + url, {
        page,
        size,
        api_key: this.apiKey
    });
  }

  /**
   * Gets the Symbols information for a given slug
   * @param slug
   * @param details
   * @param page
   * @param size
   */
  async getSymbols(
    slug?: string,
    details?: boolean,
    page?: number,
    size?: number
  ) {
    let url = "/api/v3/symbols";
    if (slug != undefined) {
      url += "/" + slug;
    }
    return await get(this.host + url, {
        details: details === true ? 1 : 0,
        page,
        size,
        api_key: this.apiKey
    });
  }

  /**
   * Gets the HistoryPrices information for given params
   * @param slug
   * @param start
   * @param end
   * @param interval
   */
  async getHistoryPrices(
    slug: string,
    start?: number,
    end?: number,
    interval?: Interval
  ) {
    return await get(this.host + "/api/v3/price/history?slug=" + slug, {
        start,
        end,
        interval,
        api_key: this.apiKey
    }, convertHistoryPriceData);
  }

  /**
   * Gets Trade information for a given desc
   * @param desc
   * @param limit
   */
  async getTrades(
    desc: string,
    limit?: number
  ) {
    return await get(this.host + "/api/v3/trades", {
        desc,
        limit,
        api_key: this.apiKey
    }, convertTradeData);
  }

  /**
   * Gets kline information for a given desc
   * @param desc
   * @param interval
   * @param end
   * @param start
   */
  async getKline(
    desc: string,
    interval?: Interval,
    end?: number,
    start?: number
  ) {
    return await get(this.host + "/api/v3/kline", {
        desc,
        interval,
        end,
        start,
        api_key: this.apiKey
    }, convertKlineData);
  }

  /**
   * Get the latest exchangeRate
   */
  async getExchangeRate() {
    return await get(this.host + "/api/v3/exchange_rate", {
        api_key: this.apiKey
    }, convertExchangeRateData);
  }

  /**
   * Get the latest briefs information
   * @param locale
   * @param page
   * @param size
   */
  async getBriefs(
    locale: Locale,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/briefs", {
        locale: locale,
        page: page,
        size: size,
        api_key: this.apiKey
    });
  }

  /**
   * Get the latest Announcements for markets
   * @param locale
   * @param market
   * @param page
   * @param size
   */
  async getAnnouncements(
    locale: Locale,
    market?: string,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/announcements", {
        locale: locale,
        page: page,
        size: size,
        market: market,
        api_key: this.apiKey
    });
  }

  /**
   * Get articles information
   * @param locale
   * @param page
   * @param size
   */
  async getArticles(
    locale: Locale,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/articles", {
        locale: locale,
        page: page,
        size: size,
        api_key: this.apiKey
    });
  }

  /**
   * Get article for a given id
   * @param id
   */
  async getArticle(
    id: string
  ) {
    return await get(this.host + "/api/v3/articles/" + id, {
        api_key: this.apiKey
    });
  }

  /**
   * Get social media for a given source
   * @param source
   * @param page
   * @param size
   */
  async getSocialMedia(
    source?: Source,
    page?: number,
    size?: number
  ) {
    return await get(this.host + "/api/v3/social_media", {
        source: source,
        page: page,
        size: size,
        api_key: this.apiKey
    });
  }

}

export class WebSocketClient {

  private readonly host: string;
  private readonly apiKey: string;

  constructor(apiKey: string, host = "wss://data.mifengcha.com/ws/v3") {
    this.host = host;
    this.apiKey = apiKey;
  }


  /**
   * subscribe topic
   * @param cb callback
   * @param params
   */
  subscribe = (cb: any, ...params: any[]) => {
    const wss = new WebSocket(this.host + "?api_key=" + this.apiKey);
    wss.on("open", () => {
      wss.send("{\"op\": \"subscribe\", \"args\": [" + params.toString() + "]}");
    });

    wss.onmessage = (msg: any) => {
      const {
        code: code,
        message: message,
        topic: topic,
        data: data
      } = JSON.parse(msg.data);
      cb(
        {
          code,
          message,
          topic,
          data: parseData(topic, data)
        });
      return wss;
    };

  };

}

async function get(url: string, params: any, convertData?: (data: any | any[]) => any) {
  try {
    const response = await axios.get(url, { params });
    if (response.status !== 200 || !convertData) {
      return response.data;
    }
    return convertData(response.data);
  } catch (error) {
    return handleErrorResponse(error.response);
  }
}

function handleErrorResponse(error: any) {
  return {
    status: error.status,
    statusText: error.statusText,
    errorCode: error.data.c,
    errorMessage: error.data.m,
    error: error.data.e
  };
}

type OrderBookData = {
  a: number[],
  b: number[],
  T: number,
  m: string
}

function convertOrderBookStream(orderBookData: OrderBookData) {
  const asks = orderBookData.a.map(it => JSON.stringify(it));
  const bids = orderBookData.b.map(it => JSON.stringify(it));
  return {
    timestamp: orderBookData.T,
    asks: asks,
    bids: bids,
    marketPair: orderBookData.m
  };
}

function convertOnePrice(priceData: any) {
  return {
    symbolName: priceData.s,
    symbol: priceData.S,
    timestamp: priceData.T,
    priceUsd: priceData.u,
    priceBtc: priceData.b,
    volume: priceData.a,
    volumeUsd: priceData.v,
    reportedVolume: priceData.ra,
    reportedVolumeUsd: priceData.rv,
    marketCapUsd: priceData.m,
    priceChange1d: priceData.c,
    highPrice1d: priceData.h,
    lowPrice1d: priceData.l,
    priceChange1w: priceData.cw,
    highPrice1w: priceData.hw,
    lowPrice1w: priceData.lw,
    priceChange1m: priceData.cm,
    highPrice1m: priceData.hm,
    lowPrice1m: priceData.lm,
    highPriceAll: priceData.ha,
    lowPriceAll: priceData.la
  };
}

function convertOneTicker(tickerData: any) {
  return {
    timestamp: tickerData.T,
    marketPair: tickerData.m,
    openPrice: tickerData.o,
    lastPrice: tickerData.c,
    lowPrice: tickerData.l,
    highPrice: tickerData.h,
    askPrice: tickerData.a,
    askAmount: tickerData.A,
    bidPrice: tickerData.b,
    changeDaily: tickerData.C,
    baseVolume: tickerData.bv,
    quoteVolume: tickerData.qv,
    usdRate: tickerData.r,
    purity: tickerData.p,
    spread: tickerData.s
  };
}

function convertOrderBookData(data: any) {
  return {
    timestamp: data.T,
    asks: data.a,
    bids: data.b,
    marketPair: data.m
  };
}

function convertPriceData(data: any[]) {
  return data.map(it => convertOnePrice(it));
}

function convertHistoryPriceData(data: any[]) {
  return data.map(it => {
    return {
      timestamp: it.T,
      priceUsd: it.u,
      priceBtc: it.b,
      volume: it.a,
      volumeUsd: it.v,
      marketCapUsd: it.m
    };
  });
}

function convertExchangeRateData(data: any[]) {
  return data.map(it => {
    return {
      currency: it.c,
      rate: it.r
    };
  });
}

function convertTickerData(data: any[]) {
  return data.map(it => convertOneTicker(it));
}

function convertTradeData(data: any[]) {
  return data.map(it => {
    return {
      timestamp: it.T,
      marketPair: it.m,
      tradeType: it.s,
      price: it.p,
      volume: it.v
    };
  });
}

function convertKlineData(data: any[]) {
  return data.map(it => {
    return {
      timestamp: it.T,
      open: it.o,
      high: it.h,
      low: it.l,
      close: it.c,
      volume: it.v
    };
  });
}

function parseData(topic: string, data: any) {

  if (topic === undefined) {
    return undefined;
  }
  if (topic.indexOf("ticker") !== -1) {
    return convertOneTicker(data);
  } else if (topic.indexOf("orderbook") !== -1) {
    return convertOrderBookStream(data);
  } else if (topic.indexOf("price") !== -1) {
    return convertOnePrice(data);
  } else {
    return undefined;
  }
}

export class Interval {

  static readonly ONE_MIN = "1m";

  static readonly FIVE_MIN = "5m";

  static readonly FIFTEEN_MIN = "15m";

  static readonly THIRTY_MIN = "30m";

  static readonly ONE_HOUR = "1h";

  static readonly TWO_HOUR = "2h";

  static readonly SIX_HOUR = "6h";

  static readonly TWELVE_HOUR = "12h";

  static readonly ONE_DAY = "1d";

  static readonly TWO_DAY = "2d";

}

export class Locale {

  static readonly zh_CN = "zh_CN";

  static readonly en_US = "en_US";

  static readonly ko_KR = "ko_KR";

}

export class Source {

  static readonly WEIBO = "WEIBO";

  static readonly TWITTER = "TWITTER";

}

export function price(coinId: string) {
  return "\"price:" + coinId + "\"";
}

export function ticker(desc: string) {
  return "\"ticker:" + desc + "\"";
}

export function orderbook(desc: string) {
  return "\"orderbook:" + desc + "\"";
}
