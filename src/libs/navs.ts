import type { IMenu } from '@/types/common';
import {
    biApp,
    biArrowDownUp,
    biArrowLeftRight,
    biArrowsMove,
    biBack,
    biBarChart,
    biBrush,
    biBug,
    biCalendar,
    biChatDots,
    biChevronExpand,
    biChevronRight,
    biCrop,
    biCursorText,
    biDatabase,
    biEmojiSmile,
    biFile,
    biFileEarmark,
    biFileImage,
    biFolder,
    biInputCursorText,
    biList,
    biMarkdown,
    biPeople, biPerson,
    biPersonCircle,
    biPieChart,
    biShieldCheck,
    biToggleOff,
    biUpload,
    biWindowFullscreen,
    biWindowSidebar
} from '@quasar/extras/bootstrap-icons';
import { bugOutline, warningOutline } from 'ionicons/icons';

export const appNavs: IMenu[] = [
    {
        header: 'nav.developers',
        pages: [
            {
                title: 'model_permission',
                icon: biShieldCheck,
                iconSet: 'bootstrap-icons',
                to: '/permission',
                permission: 'permission_list'
            }
        ]
    },
    {
        header: 'nav.forAdmin',
        pages: [
            {
                title: 'nav.userRole',
                icon: biPeople,
                iconSet: 'bootstrap-icons',
                to: '/role',
                permission: 'role_list'
            },
            {
                title: 'nav.appUser',
                icon: biPerson,
                iconSet: 'bootstrap-icons',
                to: '/user',
                permission: 'user_list'
            }
        ]
    },
    {
        border: false,
        header: 'nav.more',
        pages: [
            {
                title: 'model_files_manager',
                icon: biFolder,
                iconSet: 'bootstrap-icons',
                to: '/myFiles?_id=root',
                permission: 'file_manager_manage'
            }
        ]
    }
];

export const additionalMenu: IMenu[] = [
    {
        border: true,
        translate: false,
        header: 'Example',
        pages: [
            {
                icon: biList,
                iconSet: 'bootstrap-icons',
                title: 'Composables',
                translate: false,
                items: [
                    {
                        icon: biChevronRight,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'useBase',
                        translate: false,
                        translateCaption: false,
                        to: '/example/composables/use-base'
                    },
                    {
                        icon: biFileEarmark,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'usePageFetch',
                        translate: false,
                        translateCaption: false,
                        to: '/example/composables/use-pagefecth'
                    },
                ]
            },
            {
                icon: biBrush,
                title: 'UI',
                translate: false,
                items: [
                    {
                        icon: biPersonCircle,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Avatar',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/avatar'
                    },
                    {
                        icon: biApp,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Button',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/button'
                    },
                    {
                        icon: biCalendar,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Date-time picker',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/date-picker'
                    },
                    {
                        icon: biBack,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Dialog/Modal',
                        caption: 'dialog, modal',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/dialog'
                    },
                    {
                        icon: biList,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Dropdown menu',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/dropdown-menu'
                    },
                    {
                        icon: biUpload,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'File picker',
                        caption: 'File/Image picker',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/file-picker'
                    },
                    {
                        icon: biInputCursorText,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Form Input',
                        caption: 'Form, Input, Textarea',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/input-text'
                    },
                    {
                        icon: biChevronExpand,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Select',
                        caption: 'Select, Command palette',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/select'
                    },
                    {
                        icon: biToggleOff,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        caption: 'Toggle,Options,Radios',
                        title: 'Options group',
                        translate: false,
                        translateCaption: false,
                        to: '/example/ui/toggle'
                    },
                ],
            },
            {
                icon: biPieChart,
                iconSet: 'bootstrap-icons',
                title: 'Charts',
                translate: false,
                items: [
                    {
                        icon: biBarChart,
                        iconSet: 'bootstrap-icons',
                        permission: '',
                        title: 'Bar',
                        translate: false,
                        translateCaption: false,
                        to: '/example/charts/bar'
                    },
                ]
            },
            {
                icon: biChatDots,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Chat',
                translate: false,
                translateCaption: false,
                to: '/chats'
            },
            {
                icon: biCursorText,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Content text',
                caption: 'Display user input',
                translate: false,
                translateCaption: false,
                to: '/example/content-text'
            },
            {
                icon: biArrowsMove,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Darg and Drop',
                translate: false,
                translateCaption: false,
                to: '/example/drag-drop'
            },
            {
                icon: biEmojiSmile,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Icon/Emoji picker',
                caption: 'Emoji and Icon',
                translate: false,
                translateCaption: false,
                to: '/example/emoji-picker'
            },
            {
                icon: biDatabase,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Fetch data',
                translate: false,
                translateCaption: false,
                to: '/example/fetch-data'
            },
            {
                icon: biCrop,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Image cropper',
                translate: false,
                translateCaption: false,
                to: '/example/image-cropper'
            },
            {
                icon: biFileImage,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Image/Pdf View',
                translate: false,
                translateCaption: false,
                to: '/example/image-view'
            },
            {
                icon: biMarkdown,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Markdown editor',
                translate: false,
                translateCaption: false,
                to: '/example/markdown-editor'
            },
            {
                icon: biFile,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Result',
                caption: 'Error, Success, 404',
                translate: false,
                translateCaption: false,
                to: '/example/result'
            },
            {
                icon: biArrowLeftRight,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Swiper',
                translate: false,
                translateCaption: false,
                to: '/example/swiper'
            },
            {
                icon: biWindowSidebar,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Social feed',
                translate: false,
                translateCaption: false,
                to: '/feed'
            },
            {
                icon: biArrowDownUp,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Virtual scroller',
                translate: false,
                translateCaption: false,
                to: '/example/virtual-scroller'
            },
            {
                icon: biBug,
                iconSet: 'bootstrap-icons',
                permission: '',
                title: 'Test page',
                translate: false,
                translateCaption: false,
                to: '/test'
            },
            {
                icon: warningOutline,
                iconSet: 'ion',
                permission: '',
                title: 'Error page',
                translate: false,
                translateCaption: false,
                to: '/permission/duplicate/0'
            },
            {
                icon: warningOutline,
                iconSet: 'ion',
                permission: '',
                title: '404 page',
                translate: false,
                translateCaption: false,
                to: '/notfound'
            },
        ]
    }
];
