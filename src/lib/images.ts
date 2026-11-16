/**
 * Fotos do site: comprime no navegador para caber no localStorage e no
 * export HTML. Não há upload para servidor nesta versão.
 */

const MAX_FILE_BYTES = 12 * 1024 * 1024

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
    image.src = src
  })
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Não foi possível abrir o arquivo.'))
    reader.readAsDataURL(file)
  })
}

export async function compressImage(
  file: File,
  maxWidth = 1400,
  quality = 0.78,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem (JPG, PNG ou WebP).')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('A imagem é grande demais. Use uma foto de até 12 MB.')
  }

  const dataUrl = await readAsDataUrl(file)
  const image = await loadImage(dataUrl)
  const scale = Math.min(1, maxWidth / image.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  const context = canvas.getContext('2d')
  if (!context) return dataUrl

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

export function imageSizeKb(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Math.round((base64.length * 3) / 4 / 1024)
}
