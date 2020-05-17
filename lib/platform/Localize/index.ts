import i18next, { TFunction } from "i18next"
import Polyglot from "node-polyglot"
import parseISO from "date-fns/parseISO"
import getTimezoneOffset from "../../platform/Utils/getTimezoneOffset"

const DATE_SHORT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
}
const DATE_FULL: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
}
const DATETIME_SHORT: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
}
const DATETIME_FULL: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
}

const dtfCache: { [key: string]: Intl.DateTimeFormat } = {}
const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

function formatDate(
  date: Date,
  langCode: string,
  formatData: Intl.DateTimeFormatOptions,
  timezone?: string
) {
  if (timezone) {
    const timestamp = date.getTime()
    const systemOffset = getTimezoneOffset(systemTimezone, date)
    const offset = getTimezoneOffset(timezone, date)
    date = new Date(timestamp - systemOffset + offset)
  }

  return Intl.DateTimeFormat(langCode, formatData).format(date)
}

export function flattenTranslations(translation: any) {
  const out: { [key: string]: string } = {}

  function inner(path: string[], obj: any, key: string) {
    const innerPath = path.concat([key])
    const val = obj[key]
    if (typeof val == "string") {
      out[innerPath.join(".")] = val
    } else {
      Object.keys(val).forEach((key) => inner(innerPath, val, key))
    }
  }
  Object.keys(translation).forEach((key) => inner([], translation, key))
  return out
}

export default class LocalizeContext {
  private t_: TFunction
  public displayTimezone: string

  constructor(public langCode: string, translation: any) {
    this.t_ = (key: string) => {
      return `${key} UNINITIALISED`
    }

    const polyglot = new Polyglot({
      phrases: flattenTranslations(translation),
      locale: langCode,
      onMissingKey: (key, opts, lang) => {
        console.warn(`Missing translation for: ${key}`)
        return `{{${key}}}`
      },
    })

    this.displayTimezone = systemTimezone
    this.t_ = (key: string, params?: any) => {
      return polyglot.t(key, params)
    }

    this.formatDate = this.formatDate.bind(this)
    this.formatDateTimeNaive = this.formatDateTimeNaive.bind(this)
    this.formatDateTimeUTC = this.formatDateTimeUTC.bind(this)
    this.formatNumber = this.formatNumber.bind(this)
    this.formatStorageSize = this.formatStorageSize.bind(this)
    this.formatCurrency = this.formatCurrency.bind(this)
    this.formatPercentage = this.formatPercentage.bind(this)
    this.translate = this.translate.bind(this)
  }

  // STRING TRANSLATION
  translate(key: string, params?: any) {
    return this.t_(key, params)
  }

  t(key: string, params?: any) {
    return this.translate(key, params)
  }

  // DATE AND TIME FORMATTING
  formatDate(dateStr: string, format: string = "full") {
    const date = parseISO(dateStr)

    switch (format) {
      case "abbr":
        return formatDate(date, this.langCode, DATE_SHORT)
      case "full":
        return formatDate(date, this.langCode, DATE_FULL)
    }

    return date
  }

  formatDateTimeNaive(dtStr: string, format: string = "full") {
    const dt = parseISO(dtStr)

    switch (format) {
      case "abbr":
        return formatDate(dt, this.langCode, DATETIME_SHORT)
      case "full":
        return formatDate(dt, this.langCode, DATETIME_FULL)
    }

    return dt
  }

  formatDateTimeUTC(dtStr: string, format: string = "full") {
    const dt = parseISO(dtStr)

    switch (format) {
      case "abbr":
        return formatDate(
          dt,
          this.langCode,
          DATETIME_SHORT,
          this.displayTimezone
        )
      case "full":
        return formatDate(
          dt,
          this.langCode,
          DATETIME_FULL,
          this.displayTimezone
        )
      case "abbr-local":
        return formatDate(
          dt,
          this.langCode,
          DATETIME_SHORT,
          this.displayTimezone
        )
      case "full-local":
        return formatDate(
          dt,
          this.langCode,
          DATETIME_FULL,
          this.displayTimezone
        )
      case "abbr-utc":
        return formatDate(dt, this.langCode, DATETIME_SHORT, "Etc/UTC")
      case "full-utc":
        return formatDate(dt, this.langCode, DATETIME_FULL, "Etc/UTC")
    }

    return dt
  }

  // NUMBER FORMATTING
  formatNumber(num: number) {
    return new Intl.NumberFormat(this.langCode).format(num)
  }

  formatStorageSize(num: number, format: string = "abbr-reduce") {
    const getUnit = (unit: string) => {
      if (format.indexOf("abbr") == 0) {
        return this.translate("storage_size_units.abbr." + unit)
      } else {
        return this.translate("storage_size_units.full." + unit)
      }
    }

    if (format == "abbr-reduce" || format == "full-reduce") {
      let stepper = num
      let steps = 0

      while (stepper > 1024) {
        stepper = stepper / 1024
        steps++
      }

      const suffix = (() => {
        switch (steps) {
          case 0:
            return getUnit("bytes")
          case 1:
            return getUnit("kilobytes")
          case 2:
            return getUnit("megabytes")
          case 3:
            return getUnit("gigabytes")
          case 4:
            return getUnit("terabytes")
          case 5:
            return getUnit("petabytes")
          default:
            return "?"
        }
      })()

      return (
        new Intl.NumberFormat(this.langCode, {
          maximumFractionDigits: steps == 0 ? 0 : 1,
        }).format(stepper) + suffix
      )
    } else {
      return (
        new Intl.NumberFormat(this.langCode).format(num) +
        " " +
        this.translate("storage_size_units.abbr.bytes")
      )
    }
  }

  formatCurrency(num: number, currencyCode: string, format: string = "full") {
    if (format == "abbr-auto") {
      let stepper = num
      let steps = 0

      while (stepper > 1000) {
        stepper = stepper / 1000
        steps++
      }

      const suffix = (() => {
        switch (steps) {
          case 0:
            return ""
          case 1:
            return this.translate("currency_abbreviations.thousand")
          case 2:
            return this.translate("currency_abbreviations.million")
          case 3:
            return this.translate("currency_abbreviations.billion")
          case 4:
            return this.translate("currency_abbreviations.trillion")
          case 5:
            return this.translate("currency_abbreviations.quadrillion")
          default:
            return "?"
        }
      })()

      return (
        new Intl.NumberFormat(this.langCode, {
          style: "currency",
          currency: currencyCode,
        }).format(stepper) + suffix
      )
    } else if (format == "abbr-thousands") {
      return (
        new Intl.NumberFormat(this.langCode, {
          style: "currency",
          currency: currencyCode,
        }).format(num / 1000) +
        this.translate("currency_abbreviations.thousand")
      )
    }

    return new Intl.NumberFormat(this.langCode, {
      style: "currency",
      currency: currencyCode,
    }).format(num)
  }

  formatPercentage(num: number) {
    return new Intl.NumberFormat(this.langCode, { style: "percent" }).format(
      num
    )
  }
}
