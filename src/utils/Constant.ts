export const config = {
  //Development
  apiBaseUrl: 'http://localhost:8080',
  cdnBaseUrl: 'http://localhost:8080',
  //
  //Production Test
  // apiBaseUrl: 'https://testapi.mydomain.com',
  // cdnBaseUrl: 'https://testapi.mydomain.com',

  //Production
  // apiBaseUrl: 'https://api.mydomain.com',
  // cdnBaseUrl: 'https://cdn.mydomain.com',

  timeOut: 5 * 60000, // 60000 = 1 minute, 0 = no timeout
  feedPostPerPage: 3,
  commentsPerPage: 3,
  token: '',
  webAppUrl: 'https://app.mydomain.com',
  appVersion: '1.0.0.dev',
  codeVersion: 1,
  androidStoreLink:
    'https://play.google.com/store/apps/details?id=com.mobile.myapp',
  iOSStoreLink:
    'https://apps.apple.com/th/app/myapp/id00000000000',
  apkLink:
    'https://cdn.mydomain.com/app-release.apk?v=1.0.5'
};

export const Devmode = true;
export const PrefixKey = '_gd5_';
export const DefaultLocale = 'th';
export const LocaleKey = PrefixKey + 'mb_locale';
export const ThemeKey = PrefixKey + 'mb_theme';
export const DefaultApiCLient = 'default';
export const AppAuthTokenKey = PrefixKey + 'mb_01';
export const AppAuthRefeshTokenKey = PrefixKey + 'mb_02';
export const AppAuthDataKey = PrefixKey + 'mb_03';
export const AppAuthTokenExpireKey = PrefixKey + 'mb_04';
export const AppAuthTokenCreatedKey = PrefixKey + 'mb_05';
export const CacheDateCheckKey = PrefixKey + 'mb_cache_date_check';
export const FcmTokenKey = PrefixKey + 'mb_fcm';
export const FcmSettingKey = PrefixKey + 'mb_fcm_setting';
export const NotifyKey = PrefixKey + 'mb_notify';
export const LatestDeviceActiveKey = PrefixKey + 'mb_latest_active';
export const DefaultColor = '#3880ff';
export const SucureDeviceIdAtt = PrefixKey + '_device_jid';
export const RefreshTokenProcessAtt = '_refresh_token_processing';
export const FileImageNameAtt = PrefixKey + '_image';
export const DeviceIdAtt = PrefixKey + '_device_id';
export const CacheKey = {
  FCM_SETTING: PrefixKey + 'mb_fcm_setting',
};
export const ExpireCookieDays = 365;
export const autoRefeshTokenDays = 30;
export const SearchParamiter = '_q';
export const PageActionParamiter = 'crud';
export const PageIdParamiter = 'id';
export const BackendRootPath = 'backend';
export const CompanyIdAtt = 'companyId';
export const UserIdAtt = 'userId';
export const ProfileNameAtt = 'userProfileId';
export const FileExtensionAccept =
  '.png,.jpg,.jpeg,.gif,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.pps';

export const FileTypeAcceptList = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/gif'
];

export const FILES_UPLOAD_ATT = '_filesUploadName';
export const FILES_DIRECTORY_ID_ATT = 'fileDirectoryId';
export const OS_PLATFORM = {
  WEB: 1,
  IOS: 2,
  ANDROID: 3
};
export const CrudAction = {
  VIEW: 'view',
  NEW: 'new',
  COPY: 'copy'
};
export const DEFULT_ITEM_PER_PAGET = 10;
export const SearchOperation = {
  MATCH: ':',
  GREATER_THAN: '>',
  GREATER_THAN_EQUA: '>=',
  LESS_THAN: '<',
  LESS_THAN_EQUA: '<=',
  EQUA: '=',
  NOT_EQUA: '!='
};
export const randomNo = (min: number, max: number) =>
  Math.floor(Math.random() * max) + min;
export const AvatarPlaceHolder128 =
  'https://i.pravatar.cc/128?img=' + randomNo(1, 70);
export const FeedSectionWidth = 280;
export const TabsName = {
  HOME: 'tabHome',
  REPORT: 'tabReport',
  POST: 'tabPost',
  CHAT: 'tabChat',
  OTHER: 'tabOther'
};
export const UserLevelBenefitType = {
  MASTER: 4,
  ADVANCE: 3,
  ACTIVE: 2,
  LEARNER: 1,
  PASSIVE: 0
};
export const FeelingColors = {
  WARNING: '#ff8a06',
  YELLOW: '#ffc107',
  SUCCESS: '#2dd36f',
  DANGER: '#ec1c27'
};
export const FCM_USER_TOPIC = 'io.mydomain.fcm.user.';
export const PolicyLink = 'https://ionicframework.com/docs';