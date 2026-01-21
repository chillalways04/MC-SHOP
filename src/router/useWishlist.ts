import { ref } from 'vue'

interface WishlistItem {
  id: number
  name: string
  price: number
  image?: string
  desc?: string
  tag?: string
  sold?: string
}

const wishlist = ref<WishlistItem[]>([])

export function useWishlist() {
  const toggle = (item: WishlistItem) => {
    const index = wishlist.value.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      wishlist.value.splice(index, 1)
    } else {
      wishlist.value.push(item)
    }
  }

  const isSaved = (id: number) => wishlist.value.some((i) => i.id === id)

  return {
    items: wishlist,
    toggle,
    isSaved,
  }
}
