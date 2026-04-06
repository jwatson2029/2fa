/**
 * Google SAML Identity Provider (IdP) configuration.
 *
 * These values come from the Google Admin console →
 * Security → Authentication → SSO with third-party IdP.
 *
 * They are referenced here for documentation purposes; the
 * authoritative configuration lives in your Supabase project's
 * Authentication → SSO Providers dashboard.
 */

export const SAML_IDP = {
  ssoUrl: 'https://accounts.google.com/o/saml2/idp?idpid=C01r32475',
  entityId: 'https://accounts.google.com/o/saml2?idpid=C01r32475',

  // Certificate: Google_2031-2-20-85248_SAML2_0  (expires Feb 20, 2031)
  certificate: `MIIDdDCCAlygAwIBAgIGAZyBHj7DMA0GCSqGSIb3DQEBCwUAMHsxFDASBgNVBAoT
C0dvb2dsZSBJbmMuMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MQ8wDQYDVQQDEwZH
b29nbGUxGDAWBgNVBAsTD0dvb2dsZSBGb3IgV29yazELMAkGA1UEBhMCVVMxEzAR
BgNVBAgTCkNhbGlmb3JuaWEwHhcNMjYwMjIxMTY1MjQ4WhcNMzEwMjIwMTY1MjQ4
WjB7MRQwEgYDVQQKEwtHb29nbGUgSW5jLjEWMBQGA1UEBxMNTW91bnRhaW4gVmll
dzEPMA0GA1UEAxMGR29vZ2xlMRgwFgYDVQQLEw9Hb29nbGUgRm9yIFdvcmsxCzAJ
BgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEApPjtg3VRAb7CeX/JkPZ/TAlTiiuc7RsFzsH0QJms3Dgp
qBsb4IKOzt7mYJyvNsiffjFO+kkxFaWDCNwOoHdfwpaWuyKP0YHuHoE6tNQ/tV9q
AwAie6C5391Y3VTxRiSYoHTTwTQPRYqmb7TnfYk63EVsUNWP87OmxfkjuI2fS0/4
zLP2ai+qoDhGUNRyZLfxII7V+3pwLL6OcbiV2N0AP5YgpCtzrESedrWCqD7Xv15k
v54dtJHde5oqhvpJt6wIY7sVNVA9E61vRZZOGuYMpoVZpGS/nIcmcNRPJtVqRmK0
VDVROkkJ1X6FPHkdy3pXGIys4Q8bn6Wp7YPT9QSoTwIDAQABMA0GCSqGSIb3DQEB
CwUAA4IBAQBEX373QXx6RlAzmNzp5/vpR1nxcEasNTJ2kYu2yZnCTcYZTO30RSNC
ZsWeVk9Xv9jquHormZtm54hn5wpvIp6WYZB1ybb4EVc0kghXyJmoN4nMuKyXranD
zGCymk2x+OOcdeIWcgeJx7OCyWCAun9YKAbUFBlfHQvupiPT9W2mwdGTh53kIMh5
lYgBnx/2HUyGs3ubeQlKOUEggFJ2kzLc3puP3akQdi1wF2n4dzqgHkObB9rSskgY
w5UxgqC9MoTpxvDRpFPkJUkh1XEIJC+6Ea0T67CbsYZQjxucax58IczvxmzoovSX
vZcm6KMYlCTb4Yj+XZ6vZGLRDrCewMTS`,

  // SHA-256 fingerprint of the certificate above
  sha256Fingerprint:
    '9A:F8:6D:54:E4:B5:C8:E6:24:E2:C9:B5:31:7B:6C:ED:3D:2B:36:69:4C:96:AE:CC:D8:C0:DF:DA:BA:20:14:EE',
};

/**
 * The email domain whose users are signed in via Google SAML SSO.
 * Supabase matches this domain to the registered SAML IdP provider.
 *
 * Update this to your organisation's email domain, e.g. "acme.com".
 */
export const SSO_DOMAIN = import.meta.env.VITE_SSO_DOMAIN || '';
