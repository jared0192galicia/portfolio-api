import { database } from '@config/connections';

export async function queryPostLocation(payload: any) {
  try {
    await database.visit.create({
      data: {
        ip: payload.ip,
        network: payload.network,
        version: payload.version,
        city: payload.city,
        region: payload.region,
        regionCode: payload.region_code, // Ojo: usa el nombre que definiste en el schema
        country: payload.country,
        countryName: payload.country_name,
        countryCode: payload.country_code,
        countryCodeIso3: payload.country_code_iso3,
        countryCapital: payload.country_capital,
        countryTld: payload.country_tld,
        continentCode: payload.continent_code,
        inEu: payload.in_eu,
        postal: payload.postal,
        latitude: payload.latitude,
        longitude: payload.longitude,
        timezone: payload.timezone,
        utcOffset: payload.utc_offset,
        countryCallingCode: payload.country_calling_code,
        currency: payload.currency,
        currencyName: payload.currency_name,
        languages: payload.languages,
        countryArea: payload.country_area,
        // Importante: Convierte a BigInt si usaste BigInt en el schema
        countryPopulation: BigInt(payload.country_population), 
        asn: payload.asn,
        org: payload.org,
      }
    });
  } catch (error) {
    console.error("Error al guardar ubicación:", error);
  }
}
