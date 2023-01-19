var rest = require("restler");
var apiUrl = "https://openexchangerates.org/api/historical/";
var APP_ID = "c45dde88452e4c8a8bc8eba812cb8eda";

var DATE_REGEX = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

var self = (module.exports = {
  ver001: (data, res) => {
    if (data.symbols && typeof data.symbols !== "string") {
      self.sendResponse(res, 403, "Please provide the symbols as a string");
      return;
    }

    var symbols = (data.symbols || "").toUpperCase();

    // validate that an amount is provided
    if (typeof data.amount === "undefined" || data.amount === "") {
      self.sendResponse(res, 403, "Please supply an amount to convert");
      return;
    }

    if (typeof data.date !== "string") {
      self.sendResponse(res, 403, "Please provide the date as a string");
      return;
    }

    // validate that date is valid
    if (!DATE_REGEX.test(data.date)) {
      self.sendResponse(
        res,
        403,
        'Please provide a valid date in format "yyyy-mm-dd"'
      );
      return;
    }

    var date = data.date;

    // build the API call URL
    var url = apiUrl + date + ".json?&symbols=" + symbols + "&app_id=" + APP_ID;

    console.log("Calling OpenExchangeRates API at: ", url);

    rest.get(url).on("complete", function (result, response) {
      if (response.statusCode == 200) {
        var returns = {
          base: data.base,
          amount: data.amount,
          results: self.convertAmount(data.amount, result),
          dated: data.date,
        };

        self.sendResponse(res, 200, returns);
      }
      if (response.statusCode == 400) {
        self.sendResponse(res, 400, "Bad Request");
      }
      if (response.statusCode == 401) {
        callback("Not Authorized");
      }
      if (response.statusCode == 502) {
        callback("API Error");
      }
    });
  },
  //We don't allow switching BASE currencies because the API requires payment
  ver002: async (data, res) => {
    const { symbols, date, amount } = data;

    if (!symbols && typeof symbols !== "string") {
      self.sendResponse(res, 403, "Please provide the symbols as a string");
      return;
    }

    // validate that an amount is provided
    if (typeof amount === "undefined" || amount === "") {
      self.sendResponse(res, 403, "Please supply an amount to convert");
      return;
    }

    if (typeof date !== "string") {
      self.sendResponse(res, 403, "Please provide the date as a string");
      return;
    }

    // validate that date is valid
    if (!DATE_REGEX.test(date)) {
      self.sendResponse(
        res,
        403,
        'Please provide a valid date in format "yyyy-mm-dd"'
      );
      return;
    }

    // build the API call URL
    const url =
      apiUrl +
      date +
      ".json?&symbols=" +
      symbols.toUpperCase() +
      "&app_id=" +
      APP_ID;

    console.log("Calling OpenExchangeRates API at: ", url);

    const apiRequest = await fetch(url);
    const result = await apiRequest.json();
    if (apiRequest.status == 200) {
      self.sendResponse(res, 200, {
        base: base,
        amount: amount,
        results: self.convertAmount(amount, result),
        dated: date,
      });
    }
    if (apiRequest.status == 400) {
      self.sendResponse(res, 400, "Bad Request: " + result.description);
    }
    if (apiRequest.status == 401) {
      self.sendResponse(res, 401, "Not Authorized: " + result.description);
    }
    if (apiRequest.status == 502) {
      self.sendResponse(res, 502, "Api Error: " + result.description);
    }

    self.sendResponse(res, apiRequest.status, result);
  },

  convertAmount: (amount, data) => {
    var rates = data.rates;
    var returns = [];

    for (var r in rates) {
      if (rates.hasOwnProperty(r)) {
        var convert = amount * rates[r];
        returns.push({
          from: data.base,
          to: r,
          roundedResult: convert.toFixed(2),
          fullResult: convert,
          rate: rates[r],
        });
      }
    }

    return returns;
  },

  sendResponse: (res, status, response) => {
    res.status(status);
    res.json(response);
    res.end();
  },
});
