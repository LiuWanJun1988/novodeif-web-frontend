import { ref, watch } from 'vue'

const isClosestNode = (source: Node, target: Node): boolean =>
  source === target || source.contains(target)

export default function ({
  disableOutsideClose = false,
  preventNodes = () => [],
  onClose,
  onOpen,
}: {
  disableOutsideClose?: boolean
  preventNodes?: () => Node[]
  onOpen?: () => void
  onClose?: () => void
}) {
  const isOpened = ref(false)

  const open = (): void => {
    if (isOpened.value) return
    if (typeof onOpen === 'function') onOpen()
    isOpened.value = true
  }

  const close = (): void => {
    if (!isOpened.value) return
    if (typeof onClose === 'function') onClose()
    isOpened.value = false
  }

  const toggle = (): void => (isOpened.value ? close() : open())

  const onDocumentClick = (e: Event): void => {
    if (preventNodes().some((node) => isClosestNode(node, e.target as Node)))
      return

    close()
  }

  const onDocumentKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') close()
  }

  if (!disableOutsideClose) {
    watch(isOpened, (isOpened) => {
      if (isOpened) {
        document.addEventListener('click', onDocumentClick, true)
        document.addEventListener('keyup', onDocumentKeyUp, true)
      } else {
        document.removeEventListener('click', onDocumentClick, true)
        document.removeEventListener('keyup', onDocumentKeyUp, true)
      }
    })
  }

  return { isOpened, open, close, toggle }
}
