// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiBaseUrl: 'http://localhost:8892/processmonitoring',
  apiBaseUrl: 'http://10.144.114.114:32009/processmonitoring',
  processMonitoringUrl: 'http://10.144.114.114:31756/ProcessMonitoring',
  //processMonitoringUrl: 'http://localhost:8090/ProcessMonitoring',
  dmcUrl: 'http://10.144.114.114:31755/digitalapi/app',
  //dmcUrl: 'http://localhost:8091/digitalapi/app',
  pmcLogin: 'http://10.144.114.114:31755/digitalapi/app',
  //pmcLogin: 'http://localhost:8091/digitalapi/app',
  userLogin: 'http://10.144.114.114:31755/digitalapi/app',
  //userLogin: 'http://localhost:8091/digitalapi/app',
  //ldapEndPoint: "http://10.144.114.114:30020/ldapservice/authenticate",
  ldapEndPoint: "http://10.144.21.40:30020/ldapservice/authenticate",
  idleSessionExpired: 1800000,
  encryptSecretKey: '75lvsfy6P7hy5:/bUiF4la@G@<?JqO',
  replyBatchSize: 10
};

export var config = {
  admin:["recharge","billplanchange","dealerorder","tpdigitalservice","digitalplanconfiguration","entplanconfiguration"],
  user:["recharge","billplanchange","tpdigitalservice"],
  dashboards: []
};