import { useRbac } from '@/composables/useRBAC'
import type { RBACProps } from '@/types/props'
import type { DirectiveBinding } from 'vue'

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding<RBACProps | undefined>) {
        const { hasPermission } = useRbac()
        const rbac = binding.value

        if (!hasPermission(rbac)) {
            el.remove() // 🧼 Cleanly remove the element from DOM
        }
    }
}