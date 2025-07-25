import type { IChartSeries, ISeriresCategories } from './chart';
import type { AppLocale, ChatMessageType, ChatType, EmojiType } from './common';
export type IPlatForm = 1 | 2 | 3; // 1=web, 2=ios, 3=android
export type IPermissionOperationType = 1 | 2 | 3; // 1=crud, 2=report, 3=other
export type SearchType = 'POST' | 'PROFILE' | 'HASHTAG' | 'THEME';
export type PlatformType = 'WEB' | 'IOS' | 'ANDROID';
export type NotifyFunctionType =
  | 'SYSTEM_ANNOUNMENT'
  | 'GENERAL'
  | 'LIKE_POST'
  | 'LIKE_COMMENT'
  | 'COMMENT_POST'
  | 'COMMENT_REPLY'
  | 'SHARE'
  | 'CHAT'
  ;
export interface Id {
  id: number | null
}

export interface Todo {
  id: number
  content: string
}
export interface LogDate {
  lastestLogDate: string
}
export interface Meta {
  totalCount: number
}
export interface LogDate {
  lastestLogDate: string
}
export interface ImageDto {
  index?: number
  id?: number
  image: string
  thumbnail: string
}

export interface AuthenticationResponse {
  authenticationToken: string | null
  refreshToken: string | null
  expiresAt: string
  email: string | null
  username?: string
  avatar: ImageDto
}
export interface UserDto extends Id {
  email: string
  username?: string | null
  password?: string | null
  token?: string
  fcmToken?: string
  avatarFileId?: number
  coverFileId?: number
  avatar?: ImageDto | null
  cover?: ImageDto | null
  active: boolean
  selectedRoles?: number[]
  defaultLocale?: AppLocale
  ownerProfile?: boolean
  permissions?: string[] | undefined
}
export interface UserProfileDto extends Id {
  id: number
  username: string
  fullName: string
  avatar: ImageDto | null
  cover: ImageDto | null
}


// export interface LoginParamRequest {
//   [key: string]: {
//     email: string | null;
//     password: string | null;
//     loginForm: IPlatForm;
//   };
// }
export interface LoginRequest {
  user: {
    emailOrUsername?: string | null
    password?: string | null
    fcmToken?: string | null
    deviceId?: string | null
    loginFrom: PlatformType
  }
}
export interface RefreshTokenRequest {
  refreshToken: {
    refreshToken?: string | null
    fcmToken?: string | null
    email?: string | null
    fcmEnable?: boolean
  }
}
export interface UserChangePasswordRequest {
  userChangePasswordRequest: {
    password: string
    newPassword?: string
    logoutAllDevice: boolean
  }
}
export interface RefreshTokenResponse {
  userId: number
  authenticationToken: string
  refreshToken: string
  expiresAt?: string
}
export interface FileManagerDto {
  id: number
  uniqueId?: string
  fileMime: string
  fileName: string
  filePath: string
  fileThumbnailPath: string
  fileSize: string
  functionId?: number
  isImage?: boolean
  image?: boolean
  file?: any
}
export interface AccessTokenDto {
  id: number
  ipAddredd: string
  hostName: string
  agent: string
  loginFrom: PlatformType
  activeNow: boolean
  createdDate: string
  lastestActive: string
}

export interface IMenuPageItem {
  iconText?: string
  color?: string
  icon?: string
  to?: string
  title?: string
  permission?: string
  border?: boolean
  noActiveLink?: boolean
}
export interface IMenuPage extends IMenuPageItem {
  items?: IMenuPageItem[]
}
export interface IMenu {
  pages?: IMenuPage[]
  header?: string
  border?: true
}
export interface IAcl {
  menus: IMenu[]
  permissions: string[]
  frontendMenus: IMenu[]
  frontendPermissions: string[]
}

export interface Permission {
  id: number | null
  code: string
  remark?: string | null
  description?: string | null
  operationType: IPermissionOperationType
  frontEnd?: boolean
}
export interface PermissionRequest {
  [key: string]: Permission
}
export interface Role {
  id: number | null
  name: string
  nameEn?: string | null
  active: boolean
  frontEnd: boolean
  selectdPermissions: number[]
  companySelected: number | null
}


export interface OgMeta {
  domain: string
  url: string
  title?: string
  desc?: string
  image?: string
  imageAlt?: string
}

export interface NameIdDto {
  id: number
  name: string
}
export interface ChartSeries extends IChartSeries {
  id: string
}

export interface ChartDataXy {
  x: number
  y: number
}
export interface ChartSeriesTypeVo {
  name: string
  type: string
  data: ChartDataXy[]
}
export interface ChartAnotationPointMarkerVo {
  size: number
}
export interface ChartAnotationPointLabelStyle {
  background: string
  color: string
  fontSize: string
}
export interface ChartAnotationPointLabelVo {
  borderColor: string
  offsetY: number
  offsetX: number
  text: string
  style: ChartAnotationPointLabelStyle
}
export interface ChartAnotationPointVo {
  x: number | string
  y: number | string
  marker: ChartAnotationPointMarkerVo
  label: ChartAnotationPointLabelVo
}
export interface SeriresCategories extends ISeriresCategories {
  orgName?: string
}

export interface ISearch {
  searchId: number
  searchResult: string
  searchType: SearchType
  avatar: ImageDto | null
  cover: ImageDto | null
}
export interface NotificationDto {
  id: number
  functionId: number
  readStatus: boolean
  message: string
  createdDate: string
  fromUser: UserProfileDto | null
  functionCode: NotifyFunctionType
}
export interface NotificationCount {
  lastestId: number
  totalNotify: number
}

export interface IMenuItem {
  id?: number
  title: string
  description?: string
  i18n?: boolean
  link?: string
  external?: boolean
  itemDetail?: boolean
  icon?: string
  iconColor?: string
  iconSize?: number
  iconType?: 'ss' | 'ion' | 'bootstrap'
  value?: string | number | boolean
}


export interface SortingRequest {
  ids: number[]
}

export interface UserPersonalEditRequest {
  fullName?: string
  email?: string
  username?: string
  mobilePhone?: string
  positionName?: string
  teamLeaderName?: string
  initialConfig?: boolean
  autoFollowUser?: boolean
}
export interface AppVersionDto {
  codeVersion: number
  fourceUpdate: boolean
  puaseUpdate: boolean
  appVersionIos: string | null
  appVersionAndroid: string | null
}
export interface GroupChatMemberDto extends Id {
  favorite: boolean
  muteNotify: boolean
  pin: boolean
  online?: boolean
  joinDate: string
  offDate?: string
  member: UserProfileDto
}

export interface GroupChatDto extends Id {
  dtoAvatar?: ImageDto | null
  chatType: ChatType
  groupName?: string | null
  latestMessage?: string | null
  latestUpdate?: string | null
  latestMessageType?: ChatMessageType | null
  totalNewMessage: number
  totalMembers?: number
  pin: boolean
  favorite: boolean
  muteNotify: boolean
  online: boolean
  memberItems?: GroupChatMemberDto[]
  totalImages?: number
  totalFile?: number
}

export interface GroupChatRequest {
  fileAvatarSelectId?: number | null | undefined
  chatType: ChatType
  groupName: string | null
  newMemberUserIds: number[]
  deleteAvatar?: boolean | undefined
  newAvatar?: ImageDto | undefined
  avatarPreview?: string | undefined
}
export interface GroupChatFileDto extends Id {
  fileManager?: FileManagerDto | null | undefined
}

export interface EmojiCountDto {
  total: number
  emojiType: EmojiType
}
export interface GroupChatMsgDto extends Id {
  groupId?: number | undefined
  chatMsg?: string | undefined | null
  msgDateTime: string
  readCount: number
  unsend?: boolean | undefined
  sent: boolean
  sendUser?: UserDto | undefined
  files?: GroupChatFileDto[] | undefined |null
  liked?: boolean | undefined
  onlyLabel?: boolean | undefined
  emojiType?: EmojiType | null | undefined
  reactionEngage?: EmojiCountDto[] | undefined
  dtoReplyTo?: GroupChatMsgDto | null | undefined
  chatMessageType?: ChatMessageType | undefined
}
export interface GroupChatMsgRequest {
  chatMessageType?: ChatMessageType | undefined | null
  chatMsg?: string | null
  fileIds?: number[]
  shareMessageIds?: number[]
  replyToId?: number | null
}