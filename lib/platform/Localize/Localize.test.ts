import { expect } from "chai"
import { Settings } from "luxon"

import LocalizeContext from "./index"
const testEnLocale = require("./test-locale.json")

describe("LocalizeContext", () => {
  let enContext: LocalizeContext

  before(() => {
    enContext = new LocalizeContext("en-AU", testEnLocale)
    return enContext
  })

  describe("Text Translation", () => {
    it("translate simple string", () => {
      const t_ = enContext.translate
      expect(t_("standard_string")).to.equal("Standard String")
    })

    it("translate pluralised string", () => {
      const t_ = enContext.translate
      expect(t_("some_count", { smart_count: 0 })).to.equal("There is 0 items")
      expect(t_("some_count", { smart_count: 1 })).to.equal("There is 1 item")
      expect(t_("some_count", { smart_count: 2 })).to.equal("There is 2 items")
    })
  })

  describe("Date and Time Formatting", () => {
    it("format date", () => {
      const f = enContext.formatDate
      expect(f("2018-05-05")).to.equal("5 May 2018")
      expect(f("2018-05-05", "abbr")).to.equal("05/05/2018")
    })

    it("format naive date and time", () => {
      const f = enContext.formatDateTimeNaive
      expect(f("2018-05-05")).to.equal("5 May 2018, 12:00 am")
      expect(f("2018-05-05T04:30:21", "abbr")).to.equal("05/05/2018, 4:30 am")
      expect(f("2018-05-05T04:30:21", "full")).to.equal("5 May 2018, 4:30 am")
    })

    it("format UTC date and time", () => {
      enContext.displayTimezone = "Europe/Zurich"
      const f = enContext.formatDateTimeUTC
      expect(f("2018-05-05T04:30:21Z")).to.equal("5 May 2018, 6:30 am")
      expect(f("2018-05-05T04:30:21Z", "abbr")).to.equal("05/05/2018, 6:30 am")
      expect(f("2018-05-05T04:30:21Z", "full-local")).to.equal(
        "5 May 2018, 6:30 am"
      )
      expect(f("2018-05-05T04:30:21Z", "abbr-local")).to.equal(
        "05/05/2018, 6:30 am"
      )
      expect(f("2018-05-05T04:30:21Z", "abbr-utc")).to.equal(
        "05/05/2018, 4:30 am"
      )
      expect(f("2018-05-05T04:30:21Z", "full-utc")).to.equal(
        "5 May 2018, 4:30 am"
      )
      enContext.displayTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    })
  })

  describe("Number Formatting", () => {
    it("standard number formatting", () => {
      const formatted = enContext.formatNumber(103021982309821)
      expect(formatted).to.equal("103,021,982,309,821")
    })

    it("storage formatting", () => {
      const f = enContext.formatStorageSize
      expect(f(10302198321)).to.equal("9.6Gb")
      expect(f(1030219, "full-reduce")).to.equal("1,006.1 kilobytes")
      expect(f(10302)).to.equal("10.1kb")
      expect(f(12)).to.equal("12b")
    })

    it("currency formatting", () => {
      const f = enContext.formatCurrency
      expect(f(103021982, "USD", "abbr-thousands")).to.equal("USD 103,021.98K")
      expect(f(103021302, "USD", "abbr-auto")).to.equal("USD 103.02M")
      expect(f(108221302, "USD", "abbr-thousands")).to.equal("USD 108,221.30K")
      expect(f(1302, "USD", "abbr-thousands")).to.equal("USD 1.30K")
    })

    it("percentage formatting", () => {
      const f = enContext.formatPercentage
      expect(f(0.2)).to.equal("20%")
    })
  })
})
