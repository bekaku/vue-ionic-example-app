import type { LabelValue } from '@/types/common';
import {
    biApp,
    biArrowDownUp,
    biArrowLeftRight,
    biArrowsMove,
    biBack,
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
    biSegmentedNav,
    biShieldCheck,
    biUpload,
    biWindowSidebar
} from '@quasar/extras/bootstrap-icons';
import { brushOutline, fingerPrintOutline, warningOutline } from 'ionicons/icons';

export const appNavs: LabelValue<any>[] = [
    {
        label: 'nav.developers',
        children: [
            {
                label: 'model_permission',
                icon: biShieldCheck,
                iconSet: 'bootstrap-icons',
                to: '/permission',
                permission: 'permission_list'
            }
        ]
    },
    {
        label: 'nav.forAdmin',
        children: [
            {
                label: 'nav.userRole',
                icon: biPeople,
                iconSet: 'bootstrap-icons',
                to: '/role',
                permission: 'role_list'
            },
            {
                label: 'nav.appUser',
                icon: biPerson,
                iconSet: 'bootstrap-icons',
                to: '/user',
                permission: 'user_list'
            }
        ]
    },
    {
        border: false,
        label: 'nav.more',
        children: [
            {
                label: 'model_files_manager',
                icon: biFolder,
                iconSet: 'bootstrap-icons',
                to: '/myFiles?_id=root',
                permission: 'file_manager_manage'
            }
        ]
    }
];


export const additionalMenu: LabelValue<any>[] = [
    {
        border: true,
        translateLabel: false,
        label: 'Example',
        children: [
            {
                icon: biList,
                iconSet: 'bootstrap-icons',
                label: 'Composables',
                translateLabel: false,
                children: [
                    {
                        icon: biDatabase,
                        iconSet: 'bootstrap-icons',
                        label: 'useAxios',
                        translateLabel: false,
                        to: '/example/composables/use-axios'
                    },
                    {
                        icon: biChevronRight,
                        iconSet: 'bootstrap-icons',
                        label: 'useBase',
                        translateLabel: false,
                        to: '/example/composables/use-base'
                    },
                    {
                        icon: biFileEarmark,
                        iconSet: 'bootstrap-icons',
                        label: 'usePageFetch',
                        translateLabel: false,
                        to: '/example/composables/use-pagefecth'
                    },
                ]
            },
            {
                icon: brushOutline,
                iconSet: 'ion',
                label: 'UI',
                translateLabel: false,
                children: [
                    {
                        icon: biPersonCircle,
                        iconSet: 'bootstrap-icons',
                        label: 'Avatar',
                        translateLabel: false,
                        to: '/example/ui/avatar'
                    },
                    {
                        icon: biApp,
                        iconSet: 'bootstrap-icons',
                        label: 'Button',
                        translateLabel: false,
                        to: '/example/ui/button'
                    },
                    {
                        icon: biCalendar,
                        iconSet: 'bootstrap-icons',
                        label: 'Date-time picker',
                        translateLabel: false,
                        to: '/example/ui/date-picker'
                    },
                    {
                        icon: biBack,
                        iconSet: 'bootstrap-icons',
                        label: 'Dialog/Modal',
                        description: 'dialog, modal, popover',
                        translateLabel: false,
                        to: '/example/ui/dialog'
                    },
                    {
                        icon: biUpload,
                        iconSet: 'bootstrap-icons',
                        label: 'File picker',
                        description: 'File/Image picker',
                        translateLabel: false,
                        to: '/example/ui/file-picker'
                    },
                    {
                        icon: biInputCursorText,
                        iconSet: 'bootstrap-icons',
                        label: 'Form Input',
                        description: 'Form, Input, Textarea',
                        translateLabel: false,
                        to: '/example/ui/input-text'
                    },
                    {
                        icon: biEmojiSmile,
                        iconSet: 'bootstrap-icons',
                        label: 'Icon',
                        translateLabel: false,
                        to: '/example/ui/icon'
                    },
                    {
                        icon: fingerPrintOutline,
                        iconSet: 'ion',
                        label: 'Long press',
                        description: 'Long press, Actionsheet',
                        translateLabel: false,
                        to: '/example/ui/long-press'
                    },
                    {
                        icon: biList,
                        iconSet: 'bootstrap-icons',
                        label: 'Menu',
                        description: 'Dropdown, Menu',
                        translateLabel: false,
                        to: '/example/ui/menu'
                    },
                    {
                        icon: biChevronExpand,
                        iconSet: 'bootstrap-icons',
                        label: 'Select',
                        description: 'Select, Command palette',
                        translateLabel: false,
                        to: '/example/ui/select'
                    },
                    {
                        icon: biSegmentedNav,
                        iconSet: 'bootstrap-icons',
                        label: 'Segment',
                        translateLabel: false,
                        to: '/example/ui/segment'
                    },
                ],
            },
            {
                icon: biPieChart,
                iconSet: 'bootstrap-icons',
                label: 'Charts',
                translateLabel: false,
                to: '/example/charts'
            },
            {
                icon: biChatDots,
                iconSet: 'bootstrap-icons',
                label: 'Chat',
                translateLabel: false,
                to: '/chats'
            },
            {
                icon: biCursorText,
                iconSet: 'bootstrap-icons',
                label: 'Content text',
                description: 'Display user input',
                translateLabel: false,
                to: '/example/content-text'
            },
            {
                icon: biArrowsMove,
                iconSet: 'bootstrap-icons',
                label: 'Darg and Drop',
                translateLabel: false,
                to: '/example/drag-drop'
            },
            {
                icon: biCrop,
                iconSet: 'bootstrap-icons',
                label: 'Image cropper',
                translateLabel: false,
                to: '/example/image-cropper'
            },
            {
                icon: biFileImage,
                iconSet: 'bootstrap-icons',
                label: 'Image/Pdf View',
                translateLabel: false,
                to: '/example/image-view'
            },
            {
                icon: biMarkdown,
                iconSet: 'bootstrap-icons',
                label: 'Markdown editor',
                translateLabel: false,
                to: '/example/markdown-editor'
            },
            {
                icon: biFile,
                iconSet: 'bootstrap-icons',
                label: 'Result',
                description: 'Error, Success, 404, Alert',
                translateLabel: false,
                to: '/example/result'
            },
            {
                icon: biArrowLeftRight,
                iconSet: 'bootstrap-icons',
                label: 'Swiper',
                translateLabel: false,
                to: '/example/swiper'
            },
            {
                icon: biWindowSidebar,
                iconSet: 'bootstrap-icons',
                label: 'Social feed',
                translateLabel: false,
                to: '/feed'
            },
            {
                icon: biArrowDownUp,
                iconSet: 'bootstrap-icons',
                label: 'Virtual scroller',
                translateLabel: false,
                to: '/example/virtual-scroller'
            },
            {
                icon: biBug,
                iconSet: 'bootstrap-icons',
                label: 'Test page',
                translateLabel: false,
                to: '/test'
            },
            {
                icon: warningOutline,
                iconSet: 'ion',
                label: 'Error page',
                translateLabel: false,
                to: '/permission/duplicate/0'
            },
            {
                icon: warningOutline,
                iconSet: 'ion',
                label: '404 page',
                translateLabel: false,
                to: '/notfound'
            },
        ]
    }
];