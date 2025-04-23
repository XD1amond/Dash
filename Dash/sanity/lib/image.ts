import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: any) => {
  if (!source?.asset?._ref) {
    return {
      url: '',
      width: () => 0,
      height: () => 0,
      format: () => '',
      fit: () => imageBuilder,
      auto: () => imageBuilder,
    }
  }
  
  return imageBuilder.image(source)
}