import type { WriteFileResult } from '@capacitor/filesystem';
import type { AvatarProps, IconProps, RBACProps } from './props';
import type { UserDto } from './models';
// enum
export enum CrudListDataType {
  TEXT,
  HTML,
  IMAGE,
  AVATAR,
  STATUS,
  DATE,
  DATE_TIME,
  LINKABLE,
  BASE_TOOL,
  NUMBER_FORMAT
}

export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE
}
export enum ICrudListHeaderOptionSearchType {
  TEXT,
  NUMBER,
  BOOLEAN,
  DATE,
  DATETIME
}
// type
export type IonicColor = 'danger' | 'danger' | 'dark' | 'accent' | 'light' | 'medium' | 'primary' | 'secondary' | 'success' | 'tertiary' | 'warning'
// Palette names/shades match src/assets/css/color.scss (Tailwind CSS v4 palette
// + brand palettes); each pair has .text-<name>-<shade> / .bg-<name>-<shade>.
export type ColorName =
  | 'primary' | 'success' | 'danger' | 'warning' | 'info'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal'
  | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink'
  | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'mauve' | 'olive'
  | 'mist' | 'taupe'
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export type AppColor = 'danger' | 'dark' | 'accent' | 'light' | 'medium' | 'primary' | 'secondary' | 'success' | 'tertiary' | 'warning' | 'black' | 'white' | 'muted'
  | `${ColorName}-${ColorShade}`
export type ButtonFill = 'clear' | 'outline' | 'solid' | 'default';
export type ItemLines = 'none' | 'inset' | 'full';
export type GenerateLinkType = 'post' | 'profile';
export type FileMimeType = 'IMAGE' | 'VIDEO' | 'FILE' | 'DIRECTORY';
export type IAlert =
  | 'is-primary'
  | 'is-link'
  | 'is-info'
  | 'is-success'
  | 'is-warning'
  | 'is-danger'
  | 'is-light';
export type IconSetType =
  | 'bootstrap-icons'
  | 'line-awesome'
  | 'ion'
  | 'material-icons'
  | 'mdi';
export type IconColor = 'grey' | 'color' | 'white' | 'outline';
export type ICrudAction = 'new' | 'view' | 'copy';
export type AppLocale = 'th' | 'en';
export type AppTheme =
  | 'dark'
  | 'light';
export type FileType = 'pdf' | 'msexcel' | 'msword' | 'mspowerpoint' | 'image' | 'zip' | 'txt' | 'csv' |'audio' | 'video' | 'unknown';
export type ImgRatioType = '1' | '16/9' | '4/3';
export type IHrefTarget = '_blank' | '_parent' | '_self' | '_top';
export type IHttpStatus =
  | '200 OK'
  | 'OK'
  | '201 Created'
  | 'Created'
  | '404 Not Found'
  | 'Not Found'
  | '401 Unauthorized'
  | 'Unauthorized'
  | '400 Bad Request'
  | 'Bad Request'
  | '403 Forbidden'
  | 'Forbidden'
  | '500 Internal Server Error'
  | 'Internal Server Error'
  ;
export type IResult =
  | '400'
  | '404'
  | '403'
  | '500'
  | '418'
  | 'info'
  | 'success'
  | 'error'
  | 'warning'
  | 'empty';
export type ISortModeType = 'asc' | 'desc';
export type IAlign = 'center' | 'left' | 'right';

export type OsPlatForm =
  | 'ipad'
  | 'iphone'
  | 'ios'
  | 'android'
  | 'phablet'
  | 'tablet'
  | 'cordova'
  | 'capacitor'
  | 'electron'
  | 'pwa'
  | 'mobile'
  | 'mobileweb'
  | 'desktop'
  | 'hybrid';
export type ITheme = 'dark' | 'light' | 'synapse';
export type JwtStatus = 'VALID' | 'EXPIRED' | 'NO_EXPIRATION_TIME' | 'INVALID';
export type ResponseDataType = 'arraybuffer' | 'blob' | 'json' | 'download' | 'response';
export type SearchOperation = ':' | '>' | '>=' | '<' | '<=' | '=' | '!=';
export type MDPreviewTheme = 'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis';
export type MDCodeTheme =
  'atom'
  | 'a11y'
  | 'github'
  | 'gradient'
  | 'kimbie'
  | 'paraiso'
  | 'qtcreator'
  | 'stackoverflow';
export type ChatType = 'PERSONAL' | 'GROUP';
export type ChatMessageType = 'MEDIA' | 'TEXT' | 'IMAGE' | 'FILE' | 'INVITE' | 'LEAVE' | 'LOCATION';
export type EmojiType = 'LIKE' | 'FIGHTING' | 'LAUGH' | 'WOW' | 'CARE' | 'SAD';
export type ChatMessageAction = 'reply' | 'share' | 'copy' | 'unsend' | 'delete';
export type DatetimePresentation = 'date-time' | 'time-date' | 'date' | 'time' | 'month' | 'year' | 'month-year';
export type UploadStatus = 'UPLOADING' | 'COMPLETED' | 'FAILED';
// interface
export interface AppActionSheet {
  text?: string
  icon?: string
  cssClass?: string | string[];
  id?: string;
  disabled?: boolean;
  data?: {
    action: string | number | boolean
  },
  role?: 'cancel' | 'destructive' | 'selected'
}
export interface AppAlertOptions {
  text: string
  header?: string
  subHeader?: string
  icon?: string
  type?: 'danger' | 'warning' | 'success' | undefined
}
export interface ApiResponse {
  response?: any
  error?: any
}
export interface AppException {
  status: string
  message: string
  errors?: string[]
  timestamp?: string
}
export interface AppToastOptions {
  text: string
  time?: number
  headerText?: string
  icon?: string
  closeIcon?: string
  color?:
    | 'danger'
    | 'dark'
    | 'light'
    | 'medium'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'tertiary'
    | 'warning'
    | undefined
  toastPosition?: 'bottom' | 'top' | 'middle' | undefined
}
export interface AppConfirmOptions {
  cancelText?: string | undefined
  okayText?: string | undefined
}
export interface CacheDateAndKey {
  key: string
  date: string | number
}
export interface CheckboxDetail {
  checked: boolean
  value?: any
}
export interface Country {
  code: CountryCode
  no: number
  name: string
}
export interface ChoosePhotoItem {
  webPath?: string
  file?: File | Blob
  fileBase64?: any
}
export interface ImageDimensions {
  width: number;
  height: number;
}
export interface ImageResizeOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean
}
export interface CrudListApiOptions {
  apiEndpoint?: string;
  crudName?: string;
  enpointList?: string;
  enpointDelete?: string;
  enpointPost?: string;
  enpointPut?: string;
  enpointGetOne?: string;
  pathNew?: string;
  pathView?: string;
  pathCopy?: string;
  additionalUri?: string;
  defaultSort?: ISort;
  defaultSorts?: ISort[];
  itemsPerPage?: number;
  fetchListOnload?: boolean;
  pageAble?: boolean;
  pageStartZero?: boolean;
  sortAble?: boolean;
  concatList?: boolean;
  reverseList?: boolean;
  addUnshift?: boolean;
  preventResetListReload?: boolean;
  headers?: ICrudListHeader[];
}
export interface ICrudListApiOptions extends CrudListApiOptions {
  urlEndpoint: string
  reverseList?: boolean
  addUnshift?: boolean
  preventResetListReload?: boolean
}
export interface CrudFormApiOptions {
  apiEndpoint?: string
  crudName?: string
  fetchDataLink?: string
  backLink?: string
  actionList?: string
  actionPost?: string
  actionPut?: string
  actionDelete?: string
  fectchDataOnLoad?: boolean
  autoPageTitle?: boolean
  preventRedirectToList?: boolean
}
export interface ForgotPasswordRequest {
  email: string
  token?: string
  newPassword?: string
  confirmPassword?: string
}
export interface FileSaveResult {
  filepath: string
  webviewPath: string
  result?: WriteFileResult
}
export interface ICrudListHeaderOption {
  searchable?: boolean
  fillable?: boolean
  sortable?: boolean
  external?: boolean // LINKABLE
  editButton?: boolean // BASE_TOOL
  deleteButton?: boolean // BASE_TOOL
  copyButton?: boolean // BASE_TOOL
  square?: boolean // AVATAR,
  rounded?: boolean // AVATAR,
  size?: string // AVATAR 45px,
  style?: string // 'height: auto; width: 100px' for IMAGE,
  align?: IAlign // 'center', center left right
  searchType?: ICrudListHeaderOptionSearchType
  searchModel?: any
  searchColunm?: string
  sortColunm?: string
  searchOperation?: SearchOperation
  searchOperationReadonly?: boolean
}
export interface ICrudListHeader {
  column?: string
  label: string
  type: CrudListDataType
  options: ICrudListHeaderOption
}
export interface IApiListResponse {
  dataList: []
  totalPages: number
  totalElements: number
  last: boolean
}
export interface ApiListResponse<Type> {
  totalPages: number
  totalElements: number
  last: boolean
  dataList: Type[]
}
export interface IFile {
  type: string
  size: number
  icon: string
  name?: string
  filePath?: string | null
}
export interface IMenu {
  pages?: IMenuPage[]
  header?: string
  border?: boolean
  translate?: boolean
}
export interface IMenuPage extends IMenuPageItem {
  items?: IMenuPageItem[]
}
export interface IMenuPageItem {
  iconText?: string
  color?: string
  icon?: string
  iconSet?: IconSetType
  to?: string
  title?: string
  caption?: string
  titleI18n?: boolean
  permission?: string
  border?: boolean
  header?: string
  headerI18n?: boolean
  noActiveLink?: boolean
  userAcl?: boolean
  canShow?: boolean
  image?: string
  imageSize?: number
  fetchImage?: boolean
  iconSize?: number
  iconColor?: AppColor
  translate?: boolean
  translateCaption?: boolean
  button?: boolean
}
export interface LabelValue<Type> {
  label?: string;
  description?: string;
  // avatar?: string;
  // avatarSize?: number;
  avatar?: AvatarProps;
  icon?: IconProps;
  // iconSet?: IconSetType
  // iconSize?: number;
  // iconColor?: string;
  fetch?: boolean;
  color?: AppColor | undefined;
  value?: Type;
  border?: boolean;
  to?: string;
  translateLabel?: boolean;
  translateDescription?: boolean;
  params?: string[];
  queries?: string[];
  rbac?: RBACProps;
  noActiveLink?: boolean;
  button?: boolean;
  disable?: boolean;
  children?: LabelValue<Type>[];
}
export interface ILocales {
  name: string
  iso: AppLocale
  flag: string
}
export interface StorageItem {
  key?: string
  value?: any
  userId?: number | string
}
export interface NotificationCount {
  lastestId: number
  totalNotify: number
  totalNewMessage: number
}
export interface LoginedProfileItem {
  user?: UserDto
  notificationCount?: NotificationCount
}
// export interface ILocales {
//   [key: string]: {
//     name: string;
//     iso: string;
//     flag: string;
//   };
// }
export interface IPagination {
  current: number
  itemsPerPage: number
  totalPages: number
  totalElements?: number
  last?: boolean
  perPageList: ITextValue[]
}
export interface ISort {
  mode: ISortModeType
  column: string
}

export interface ISortMode {
  label: string
  value: ISortModeType
}
export interface ITextValue {
  text: string
  value: number | string
}
export interface LocaleOption {
  id: string
  name: string
}
export interface KeyValue {
  key: string
  value: any
}
export interface NotifyOptions {
  icon?: string
  caption?: string
  avatar?: string
  color?: string
  textColor?: string
  type?: 'positive' | 'negative' | 'warning' | 'info'
  timeout?: number
  progress?: boolean
  multiLine?: boolean
  spinner?: boolean
  html?: boolean
  hideClose?: boolean
  position?:
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-right'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center'
  actions?: any[]
}
export interface RefeshTokenStatus {
  status: boolean
  fourceLogout: boolean
  token?: string
}
export interface ResponseMessage {
  status: IHttpStatus
  message?: string
  timestamp: string
}
export interface RequestDto {
  [key: string]: any
}
export interface SlideAutoplay {
  delay: number
}
export interface SlideZoom {
  maxRatio: number
}

export interface SlidePaginationy {
  hideOnClick?: boolean
  enabled?: boolean
  dynamicBullets?: boolean
}
export interface SwiperSlideChange {
  activeIndex: number
  realIndex: number
}
export type SlidePaginationType = 'progressbar' | 'bullets' | 'fraction' | 'custom';
export type SlideDirectionType = 'horizontal' | 'vertical';
export type SlideEffectType = 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'creative' | 'cards';

export interface SlideOptions {
  autoplay?: boolean | SlideAutoplay;
  breakpoints?: any;
  centeredSlides?: boolean;
  allowTouchMove?: boolean;
  direction?: SlideDirectionType;
  effect?: SlideEffectType;
  freeMode?: boolean;
  initialSlide?: number;
  keyboard?: boolean;
  lazy?: boolean;
  loop?: boolean;
  modules?: SlideModule[];
  navigation?: boolean;
  navigationType?: boolean;
  navigationCustom?: boolean;
  pagination?: boolean | SlidePaginationy;
  paginationClickable?: boolean;
  paginationType?: SlidePaginationType;
  paginationDynamic?: boolean;
  scrollbar?: boolean;
  style?: any | object;
  speed?: number;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  slidesPerGroup?: number;
  thumbs?: boolean;
  updateOnWindowResize?: boolean;
  zoom?: boolean | SlideZoom;
  gridRows?: number;
  grabCursor?: boolean;
}

export type SlideModule =
  | 'Autoplay'
  | 'Keyboard'
  | 'Scrollbar'
  | 'Zoom'
  | 'Navigation';
export interface ServerException {
  status: number | string
  message: string
  error: string
  timestamp: string
  path: string
}
export interface UserCredentialPicture {
  path: string
  x: string
  xx: string
  xxx: string
}
export interface UserCredential {
  id: number | string
  username: string
  email: string
  rolesText?: string
  status: boolean
  picture: UserCredentialPicture
  userRoles?: string[]
  apiKey: string
}
export interface UseMetaOptions {
  additionalTitle?: string
  manualSet?: boolean
}
export interface UploadRequest {
  fileBase64?: string
  fileDirectoryId?: number
  resizeImage?: boolean
}

export interface VueMoneyConFig {
  decimal: string
  separator: string
  prefix: string
  suffix: string
  precision: number
  masked: boolean
  nullValue: string
  reverseFill: boolean
}
export interface VirtualScrollerUpdate {
  viewStartIndex: number
  viewEndIndex: number
  visibleStartIndex: number
  visibleEndIndex: number
}
export type CountryCode =
  | 'AC'
  | 'AD'
  | 'AE'
  | 'AF'
  | 'AG'
  | 'AI'
  | 'AL'
  | 'AM'
  | 'AO'
  | 'AR'
  | 'AS'
  | 'AT'
  | 'AU'
  | 'AW'
  | 'AX'
  | 'AZ'
  | 'BA'
  | 'BB'
  | 'BD'
  | 'BE'
  | 'BF'
  | 'BG'
  | 'BH'
  | 'BI'
  | 'BJ'
  | 'BL'
  | 'BM'
  | 'BN'
  | 'BO'
  | 'BQ'
  | 'BR'
  | 'BS'
  | 'BT'
  | 'BW'
  | 'BY'
  | 'BZ'
  | 'CA'
  | 'CC'
  | 'CD'
  | 'CF'
  | 'CG'
  | 'CH'
  | 'CI'
  | 'CK'
  | 'CL'
  | 'CM'
  | 'CN'
  | 'CO'
  | 'CR'
  | 'CU'
  | 'CV'
  | 'CW'
  | 'CX'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DJ'
  | 'DK'
  | 'DM'
  | 'DO'
  | 'DZ'
  | 'EC'
  | 'EE'
  | 'EG'
  | 'EH'
  | 'ER'
  | 'ES'
  | 'ET'
  | 'FI'
  | 'FJ'
  | 'FK'
  | 'FM'
  | 'FO'
  | 'FR'
  | 'GA'
  | 'GB'
  | 'GD'
  | 'GE'
  | 'GF'
  | 'GG'
  | 'GH'
  | 'GI'
  | 'GL'
  | 'GM'
  | 'GN'
  | 'GP'
  | 'GQ'
  | 'GR'
  | 'GT'
  | 'GU'
  | 'GW'
  | 'GY'
  | 'HK'
  | 'HN'
  | 'HR'
  | 'HT'
  | 'HU'
  | 'ID'
  | 'IE'
  | 'IL'
  | 'IM'
  | 'IN'
  | 'IO'
  | 'IQ'
  | 'IR'
  | 'IS'
  | 'IT'
  | 'JE'
  | 'JM'
  | 'JO'
  | 'JP'
  | 'KE'
  | 'KG'
  | 'KH'
  | 'KI'
  | 'KM'
  | 'KN'
  | 'KP'
  | 'KR'
  | 'KW'
  | 'KY'
  | 'KZ'
  | 'LA'
  | 'LB'
  | 'LC'
  | 'LI'
  | 'LK'
  | 'LR'
  | 'LS'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'LY'
  | 'MA'
  | 'MC'
  | 'MD'
  | 'ME'
  | 'MF'
  | 'MG'
  | 'MH'
  | 'MK'
  | 'ML'
  | 'MM'
  | 'MN'
  | 'MO'
  | 'MP'
  | 'MQ'
  | 'MR'
  | 'MS'
  | 'MT'
  | 'MU'
  | 'MV'
  | 'MW'
  | 'MX'
  | 'MY'
  | 'MZ'
  | 'NA'
  | 'NC'
  | 'NE'
  | 'NF'
  | 'NG'
  | 'NI'
  | 'NL'
  | 'NO'
  | 'NP'
  | 'NR'
  | 'NU'
  | 'NZ'
  | 'OM'
  | 'PA'
  | 'PE'
  | 'PF'
  | 'PG'
  | 'PH'
  | 'PK'
  | 'PL'
  | 'PM'
  | 'PR'
  | 'PS'
  | 'PT'
  | 'PW'
  | 'PY'
  | 'QA'
  | 'RE'
  | 'RO'
  | 'RS'
  | 'RU'
  | 'RW'
  | 'SA'
  | 'SB'
  | 'SC'
  | 'SD'
  | 'SE'
  | 'SG'
  | 'SH'
  | 'SI'
  | 'SJ'
  | 'SK'
  | 'SL'
  | 'SM'
  | 'SN'
  | 'SO'
  | 'SR'
  | 'SS'
  | 'ST'
  | 'SV'
  | 'SX'
  | 'SY'
  | 'SZ'
  | 'TA'
  | 'TC'
  | 'TD'
  | 'TG'
  | 'TH'
  | 'TJ'
  | 'TK'
  | 'TL'
  | 'TM'
  | 'TN'
  | 'TO'
  | 'TR'
  | 'TT'
  | 'TV'
  | 'TW'
  | 'TZ'
  | 'UA'
  | 'UG'
  | 'US'
  | 'UY'
  | 'UZ'
  | 'VA'
  | 'VC'
  | 'VE'
  | 'VG'
  | 'VI'
  | 'VN'
  | 'VU'
  | 'WF'
  | 'WS'
  | 'XK'
  | 'YE'
  | 'YT'
  | 'ZA'
  | 'ZM'
  | 'ZW';
